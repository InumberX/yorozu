import {
  BlobSource,
  BufferTarget,
  canEncodeVideo,
  Conversion,
  Input,
  MP4,
  Output,
  QTFF,
  QUALITY_HIGH,
  QUALITY_LOW,
  QUALITY_MEDIUM,
  QUALITY_VERY_HIGH,
  QUALITY_VERY_LOW,
  type Quality,
  WebMOutputFormat,
} from 'mediabunny'

import { MAX_DURATION_SECONDS } from '~/features/video-convert/limits'
import type {
  VideoConvertErrorCode,
  VideoConvertRequest,
  VideoConvertResponse,
  VideoConvertWarningCode,
  VideoQualityLevel,
} from '~/features/video-convert/types'
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
  1: QUALITY_VERY_LOW,
  2: QUALITY_LOW,
  3: QUALITY_MEDIUM,
  4: QUALITY_HIGH,
  5: QUALITY_VERY_HIGH,
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
      throw new ConvertError('UNDECODABLE_VIDEO', 'no video track')
    }
    if (!(await videoTrack.canDecode())) {
      throw new ConvertError('UNDECODABLE_VIDEO', `cannot decode ${videoTrack.codec ?? 'unknown codec'}`)
    }

    const duration = await input.computeDuration()
    if (duration > MAX_DURATION_SECONDS) {
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

    const isVideoDiscarded = conversion.discardedTracks.some(({ track }) => track.isVideoTrack())
    if (!conversion.isValid || isVideoDiscarded) {
      throw new ConvertError('UNDECODABLE_VIDEO', JSON.stringify(conversion.discardedTracks.map((t) => t.reason)))
    }
    // 音声を読めない・書き出せないブラウザでは、映像だけにして知らせる
    const warnings: VideoConvertWarningCode[] = conversion.discardedTracks.some(({ track }) => track.isAudioTrack())
      ? ['AUDIO_DROPPED']
      : []

    conversion.onProgress = (progress) => {
      post({ type: 'progress', id, progress: Math.floor(progress * 100) })
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
