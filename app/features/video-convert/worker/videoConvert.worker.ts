import type { VideoConvertRequest, VideoConvertResponse } from '~/features/video-convert/types'

// DedicatedWorkerGlobalScope を webworker lib 無しで安全に扱うための最小型付け。
const ctx = globalThis as unknown as {
  onmessage: ((event: MessageEvent<VideoConvertRequest>) => void) | null
  postMessage: (message: VideoConvertResponse) => void
}

const post = (message: VideoConvertResponse) => {
  ctx.postMessage(message)
}

ctx.onmessage = (event) => {
  const data = event.data

  if (data.type !== 'convert') {
    return
  }

  const { id } = data

  post({
    type: 'progress',
    id,
    progress: 10,
  })

  // TODO: ffmpeg.wasm（シングルスレッド版で開始）を同一オリジン配信（public/wasm/）
  // から読み込み、options.codec（vp9 / vp8）と options.crf に応じて WebM 変換を実装する。
  // ffmpeg core（~25-30MB）は Worker バンドルに含めず静的アセットとして配信すること。
  // 将来 MT 版へ上げる場合は /video のみに COOP/COEP をスコープする。
  post({
    type: 'error',
    id,
    code: 'NOT_IMPLEMENTED',
    message: '動画変換エンジン（ffmpeg.wasm）は未実装です。',
  })
}
