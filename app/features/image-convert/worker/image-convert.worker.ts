import type { ImageConvertRequest, ImageConvertResponse } from '~/features/image-convert/types'

// DedicatedWorkerGlobalScope を webworker lib 無しで安全に扱うための最小型付け。
// （tsconfig の lib は DOM 前提のため、self を直接使わず globalThis 経由で受ける）
const ctx = globalThis as unknown as {
  onmessage: ((event: MessageEvent<ImageConvertRequest>) => void) | null
  postMessage: (message: ImageConvertResponse) => void
}

const post = (message: ImageConvertResponse) => {
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

  // TODO: jSquash（WASM）を同一オリジン配信（public/wasm/）から読み込み、
  // options.format（webp / avif）と options.quality に応じて変換を実装する。
  // 大きい WASM は Worker バンドルに含めず静的アセットとして配信すること。
  post({
    type: 'error',
    id,
    code: 'NOT_IMPLEMENTED',
    message: '画像変換エンジン（jSquash）は未実装です。',
  })
}
