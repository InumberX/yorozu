import type { ConvertRequest, ConvertResponse } from '~/features/file-convert/types'

// 映像のコーデック（出力は WebM。コーデックを足すときはここと worker に足す）
export const VIDEO_CODECS = ['vp9', 'vp8'] as const

export type VideoCodec = (typeof VIDEO_CODECS)[number]

// 画質の段階（1: いちばん小さく 〜 5: いちばんきれいに）。WebCodecs のエンコーダーには CRF がないため、
// Mediabunny の 5 段階の品質（解像度とコーデックに応じたビットレート）に対応させる。
export const VIDEO_QUALITY_LEVELS = [1, 2, 3, 4, 5] as const

export type VideoQualityLevel = (typeof VIDEO_QUALITY_LEVELS)[number]

// 解像度。数字は短い辺の上限（px）。縦長の動画も短い辺でそろえ、元より大きくはしない。
export const VIDEO_RESOLUTIONS = ['original', '1080', '720', '480'] as const

export type VideoResolution = (typeof VIDEO_RESOLUTIONS)[number]

export type VideoConvertOptions = {
  codec: VideoCodec
  quality: VideoQualityLevel
  resolution: VideoResolution
}

export type VideoConvertErrorCode =
  // 読めない（MP4 / MOV ではない、壊れている）
  | 'UNSUPPORTED_INPUT'
  // 映像が入っていない、またはこのブラウザで映像を読み出せない（コーデックに対応していない）
  | 'UNDECODABLE_VIDEO'
  // 長すぎる
  | 'TOO_LONG'
  // このブラウザでは、選んだコーデックで書き出せない
  | 'UNSUPPORTED_ENCODER'
  | 'CONVERT_FAILED'

// 音声を書き出せなかったので、映像だけにした
export type VideoConvertWarningCode = 'AUDIO_DROPPED'

// Web Worker とのやりとり（形は画像・動画で共通）
export type VideoConvertRequest = ConvertRequest<VideoConvertOptions>
export type VideoConvertResponse = ConvertResponse<VideoConvertErrorCode, VideoConvertWarningCode>
