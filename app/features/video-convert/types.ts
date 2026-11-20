import type { ConvertRequest, ConvertResponse } from '~/features/file-convert/types'

// 映像のコーデック（出力は WebM。コーデックを足すときはここと worker に足す）
export const VIDEO_CODECS = ['vp9', 'vp8'] as const

export type VideoCodec = (typeof VIDEO_CODECS)[number]

// 画質の段階（1: いちばん小さく 〜 5: いちばんきれいに）。Mediabunny の 5 段階の品質に対応させる。
// Mediabunny は、VP9 では量子化値（ffmpeg の CRF に近いもの）で書き出し、エンコーダーが対応していなければ
// ビットレートの指定に切り替える。VP8 は量子化値に対応していないため、ビットレートの指定になる。
// CRF の数値をそのまま選ばせないのは、VP9 の量子化値の範囲がブラウザの版で変わり（Chromium 145 より前は 0〜63、
// 以降は 0〜255）、VP8 には量子化値がないため。
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
  // 映像が入っていない（音声だけの MP4 など）
  | 'NO_VIDEO_TRACK'
  // このブラウザで映像を読み出せない（コーデックに対応していない）
  | 'UNDECODABLE_VIDEO'
  // 長すぎる
  | 'TOO_LONG'
  // このブラウザでは、選んだコーデックで書き出せない
  | 'UNSUPPORTED_ENCODER'
  | 'CONVERT_FAILED'

// 音声を映像だけにした理由
export type VideoConvertWarningCode =
  // 音声を読み出せない（このブラウザが対応していない、または Mediabunny がコーデックを判別できない）
  | 'AUDIO_UNDECODABLE'
  // このブラウザで音声を書き出せない
  | 'AUDIO_UNENCODABLE'

// Web Worker とのやりとり（形は画像・動画で共通）
export type VideoConvertRequest = ConvertRequest<VideoConvertOptions>
export type VideoConvertResponse = ConvertResponse<VideoConvertErrorCode, VideoConvertWarningCode>
