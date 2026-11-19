// 画像変換の出力形式（画面で選ぶ。形式を足すときはここと worker のエンコーダーに足す）
export const IMAGE_OUTPUT_FORMATS = ['webp', 'avif'] as const

export type ImageOutputFormat = (typeof IMAGE_OUTPUT_FORMATS)[number]

export type ImageConvertOptions = {
  format: ImageOutputFormat
  // 1〜100。lossless のときは使わない
  quality: number
  lossless: boolean
}

// Web Worker へのリクエスト（変換エンジンに依らない取り決め）。1 回に 1 ファイル。
export type ImageConvertRequest = {
  type: 'convert'
  id: string
  file: File
  options: ImageConvertOptions
}

// Web Worker からのレスポンス
export type ImageConvertResponse =
  | {
      type: 'progress'
      id: string
      // そのファイルの中での進み具合（0〜100）
      progress: number
    }
  | {
      type: 'done'
      id: string
      blob: Blob
    }
  | {
      type: 'error'
      id: string
      code: ImageConvertErrorCode
      message: string
    }

export type ImageConvertErrorCode = 'DECODE_FAILED' | 'ENCODE_FAILED'
