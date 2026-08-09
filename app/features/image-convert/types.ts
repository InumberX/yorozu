// 画像変換の出力フォーマット（画面内で選択。将来フォーマット追加もここに足す）
export type ImageOutputFormat = 'webp' | 'avif'

export type ImageConvertOptions = {
  format: ImageOutputFormat
  quality: number
}

// Web Worker へのリクエスト（変換エンジン非依存の契約）
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
      progress: number
    }
  | {
      type: 'done'
      id: string
      blob: Blob
      fileName: string
    }
  | {
      type: 'error'
      id: string
      code: string
      message: string
    }
