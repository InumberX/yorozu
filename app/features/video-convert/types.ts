// 動画変換のコーデック（第一弾の出力は WebM 固定。選択軸はコーデック/品質）
export type VideoCodec = 'vp9' | 'vp8'

export type VideoConvertOptions = {
  codec: VideoCodec
  crf: number
}

// Web Worker へのリクエスト（変換エンジン非依存の契約）
export type VideoConvertRequest = {
  type: 'convert'
  id: string
  file: File
  options: VideoConvertOptions
}

// Web Worker からのレスポンス
export type VideoConvertResponse =
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
