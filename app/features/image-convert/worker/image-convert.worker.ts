import type {
  ImageConvertOptions,
  ImageConvertRequest,
  ImageConvertResponse,
  ImageOutputFormat,
} from '~/features/image-convert/types'

// DedicatedWorkerGlobalScope を webworker lib 無しで扱うための最小の型付け。
// （tsconfig の lib は DOM 前提のため、self を直接使わず globalThis 経由で受ける）
const ctx = globalThis as unknown as {
  onmessage: ((event: MessageEvent<ImageConvertRequest>) => void) | null
  postMessage: (message: ImageConvertResponse) => void
}

const post = (message: ImageConvertResponse) => {
  ctx.postMessage(message)
}

const MIME_TYPES: Record<ImageOutputFormat, string> = {
  webp: 'image/webp',
  avif: 'image/avif',
}

// 読み込み（デコード）はブラウザに任せる。PNG / JPEG はどのブラウザも読め、EXIF の向きも反映される。
const decode = async (file: File): Promise<ImageData> => {
  const bitmap = await createImageBitmap(file)

  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('OffscreenCanvas 2d context is not available')
    }
    context.drawImage(bitmap, 0, 0)
    return context.getImageData(0, 0, bitmap.width, bitmap.height)
  } finally {
    bitmap.close()
  }
}

// 書き出し（エンコード）は jSquash（WASM）。選んだ形式のエンコーダーだけを、初めて使うときに読み込む。
// WASM は Vite が静的アセットとして同じオリジンに出力し、Worker のスクリプトには含めない。
const encode = async (imageData: ImageData, options: ImageConvertOptions): Promise<ArrayBuffer> => {
  switch (options.format) {
    case 'webp': {
      const { default: encodeWebp } = await import('@jsquash/webp/encode')
      return options.lossless
        ? encodeWebp(imageData, { lossless: 1, quality: 100 })
        : encodeWebp(imageData, { quality: options.quality })
    }
    case 'avif': {
      const { default: encodeAvif } = await import('@jsquash/avif/encode')
      return options.lossless
        ? encodeAvif(imageData, { lossless: true })
        : encodeAvif(imageData, { quality: options.quality })
    }
  }
}

ctx.onmessage = async (event) => {
  const data = event.data

  if (data.type !== 'convert') {
    return
  }

  const { id, file, options } = data

  post({ type: 'progress', id, progress: 5 })

  let imageData: ImageData
  try {
    imageData = await decode(file)
  } catch (error) {
    post({ type: 'error', id, code: 'DECODE_FAILED', message: String(error) })
    return
  }

  post({ type: 'progress', id, progress: 30 })

  try {
    const buffer = await encode(imageData, options)
    post({ type: 'done', id, blob: new Blob([buffer], { type: MIME_TYPES[options.format] }) })
  } catch (error) {
    post({ type: 'error', id, code: 'ENCODE_FAILED', message: String(error) })
  }
}
