import {
  BlobSource,
  BufferTarget,
  canEncodeVideo,
  Conversion,
  Input,
  MP4,
  Output,
  QTFF,
  Quality,
  WebMOutputFormat,
} from 'mediabunny'

import { DURATION_TOLERANCE_SECONDS, MAX_DURATION_SECONDS } from '~/features/video-convert/limits'
import type {
  VideoConvertErrorCode,
  VideoConvertRequest,
  VideoConvertResponse,
  VideoConvertWarningCode,
  VideoQualityLevel,
} from '~/features/video-convert/types'
import { toAudioDiscardWarning, toVideoDiscardError } from '~/features/video-convert/utils/video-discard'
import { toOutputSize } from '~/features/video-convert/utils/video-size'

// DedicatedWorkerGlobalScope を webworker lib 無しで扱うための最小の型付け。
// （tsconfig の lib は DOM 前提のため、self を直接使わず globalThis 経由で受ける）
const ctx = globalThis as unknown as {
  onmessage: ((event: MessageEvent<VideoConvertRequest>) => void) | null
  postMessage: (message: VideoConvertResponse) => void
}

const post = (message: VideoConvertResponse) => {
  ctx.postMessage(message)
}

const QUALITIES: Record<VideoQualityLevel, Quality> = {
  1: new Quality('very-low'),
  2: new Quality('low'),
  3: new Quality('medium'),
  4: new Quality('high'),
  5: new Quality('very-high'),
}

class ConvertError extends Error {
  constructor(
    readonly code: VideoConvertErrorCode,
    message: string
  ) {
    super(message)
  }
}

// 読み込みは MP4 / MOV のみ。映像・音声の読み出しと書き出しはブラウザの WebCodecs に任せ、
// Mediabunny がファイルの読み書き（MP4 / MOV を開き、WebM にまとめる）を受け持つ。
// ファイルは必要なところだけを少しずつ読むので、200MB の動画でもまるごとメモリには載せない。
const convert = async (request: VideoConvertRequest): Promise<{ blob: Blob; warnings: VideoConvertWarningCode[] }> => {
  const { id, file, options } = request
  const input = new Input({ formats: [MP4, QTFF], source: new BlobSource(file) })

  try {
    const videoTrack = await input.getPrimaryVideoTrack().catch((error: unknown) => {
      throw new ConvertError('UNSUPPORTED_INPUT', String(error))
    })
    if (!videoTrack) {
      throw new ConvertError('NO_VIDEO_TRACK', 'no video track')
    }
    if (!(await videoTrack.canDecode())) {
      throw new ConvertError('UNDECODABLE_VIDEO', `cannot decode ${videoTrack.codec ?? 'unknown codec'}`)
    }

    const duration = await input.computeDuration()
    if (duration > MAX_DURATION_SECONDS + DURATION_TOLERANCE_SECONDS) {
      throw new ConvertError('TOO_LONG', `duration ${duration}s`)
    }

    const size = toOutputSize(videoTrack.displayWidth, videoTrack.displayHeight, options.resolution)
    if (!(await canEncodeVideo(options.codec, size))) {
      throw new ConvertError('UNSUPPORTED_ENCODER', `cannot encode ${options.codec}`)
    }

    const output = new Output({ format: new WebMOutputFormat(), target: new BufferTarget() })
    const conversion = await Conversion.init({
      input,
      output,
      tracks: 'primary',
      video: {
        codec: options.codec,
        quality: QUALITIES[options.quality],
        width: size.width,
        height: size.height,
        fit: 'fill',
        // 元が同じコーデックでも、選んだ画質と大きさで書き直す
        forceTranscode: true,
      },
      // 音声は WebM で使える Opus にする（元が Opus ならそのまま移す）
      audio: { codec: 'opus' },
      // 撮影日時などの情報は書き出さない
      tags: {},
      showWarnings: false,
    })

    // 外された理由（reason）で、エラーと注意の種類を分ける
    const discardedVideo = conversion.discardedTracks.find(({ track }) => track.isVideoTrack())
    if (discardedVideo) {
      throw new ConvertError(toVideoDiscardError(discardedVideo.reason), `video ${discardedVideo.reason}`)
    }
    if (!conversion.isValid) {
      throw new ConvertError('CONVERT_FAILED', JSON.stringify(conversion.discardedTracks.map((t) => t.reason)))
    }
    // 音声を読めない・書き出せないブラウザでは、映像だけにして知らせる
    const warnings: VideoConvertWarningCode[] = conversion.discardedTracks
      .filter(({ track }) => track.isAudioTrack())
      .map(({ reason }) => toAudioDiscardWarning(reason))

    // onProgress は進み具合（小数）が変わるたびに、ほぼ 1 コマごとに呼ばれる。
    // 画面に出すのは整数の % なので、それが変わったときだけ知らせる。
    let lastProgress = 0
    conversion.onProgress = (progress) => {
      const percent = Math.floor(progress * 100)
      if (percent !== lastProgress) {
        lastProgress = percent
        post({ type: 'progress', id, progress: percent })
      }
    }
    await conversion.execute()

    const buffer = output.target.buffer
    if (!buffer) {
      throw new ConvertError('CONVERT_FAILED', 'empty output')
    }
    return { blob: new Blob([buffer], { type: 'video/webm' }), warnings }
  } finally {
    input.dispose()
  }
}

ctx.onmessage = async (event) => {
  const data = event.data

  if (data.type !== 'convert') {
    return
  }

  const { id } = data
  post({ type: 'progress', id, progress: 0 })

  try {
    const { blob, warnings } = await convert(data)
    post({ type: 'done', id, blob, warnings })
  } catch (error) {
    post({
      type: 'error',
      id,
      code: error instanceof ConvertError ? error.code : 'CONVERT_FAILED',
      message: String(error),
    })
  }
}
