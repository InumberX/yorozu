// 画像・動画の変換で共通の、Worker とのやりとりと変換結果の型。
// 各ツールは options（O）・エラーの種類（C）・注意の種類（W）を自分の型で埋める。

// Web Worker への依頼（変換エンジンに依らない取り決め）。1 回に 1 ファイル。
export type ConvertRequest<O> = {
  type: 'convert'
  id: string
  file: File
  options: O
}

// Web Worker からの返事
export type ConvertResponse<C extends string = string, W extends string = string> =
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
      // 変換はできたが、知らせておきたいこと（例: 音声を書き出せなかった）
      warnings?: W[]
    }
  | {
      type: 'error'
      id: string
      code: C
      message: string
    }

// 変換できた 1 ファイル
export type ConvertResultItem = {
  id: string
  sourceName: string
  // 書き出したファイルの名前（拡張子を出力形式に変えたもの）
  fileName: string
  beforeSize: number
  afterSize: number
  blob: Blob
  // ダウンロードとプレビューに使う。グループを消したときと、画面を離れるときに解放する。
  url: string
  warnings: string[]
}

// 変換できなかった 1 ファイル。code は Worker が返したエラーの種類で、
// Worker ごと落ちた・打ち切られたなど、理由がわからないときは null。
export type ConvertFailure = {
  name: string
  code: string | null
}

// 1 回の変換でできたもののまとまり
export type ConvertResultGroup<O> = {
  id: string
  convertedAt: Date
  options: O
  items: ConvertResultItem[]
  failures: ConvertFailure[]
}

export type ConvertStatus = 'idle' | 'converting' | 'done'
