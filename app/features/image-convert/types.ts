import type { ConvertRequest, ConvertResponse } from '~/features/file-convert/types'

// 画像変換の出力形式（画面で選ぶ。形式を足すときはここと worker のエンコーダーに足す）
export const IMAGE_OUTPUT_FORMATS = ['webp', 'avif'] as const

export type ImageOutputFormat = (typeof IMAGE_OUTPUT_FORMATS)[number]

export type ImageConvertOptions = {
  format: ImageOutputFormat
  // 1〜100。lossless のときは使わない
  quality: number
  lossless: boolean
}

export type ImageConvertErrorCode = 'DECODE_FAILED' | 'ENCODE_FAILED'

// Web Worker とのやりとり（形は画像・動画で共通）
export type ImageConvertRequest = ConvertRequest<ImageConvertOptions>
export type ImageConvertResponse = ConvertResponse<ImageConvertErrorCode, never>
