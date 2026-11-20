import type { DiscardedTrack } from 'mediabunny'

import type { VideoConvertErrorCode, VideoConvertWarningCode } from '~/features/video-convert/types'

type DiscardReason = DiscardedTrack['reason']

// 読み出せないことを表す理由。unknown_source_codec は Mediabunny がコーデックを判別できなかったとき。
const UNREADABLE_REASONS: readonly DiscardReason[] = ['unknown_source_codec', 'undecodable_source_codec']

// 映像トラックが変換から外されたときの、エラーの種類。
// 読み出せない → UNDECODABLE_VIDEO、書き出せない → UNSUPPORTED_ENCODER。
// それ以外（tracks: 'primary' では起きない理由）は、原因を言い当てられないので CONVERT_FAILED にする。
export const toVideoDiscardError = (reason: DiscardReason): VideoConvertErrorCode => {
  if (UNREADABLE_REASONS.includes(reason)) {
    return 'UNDECODABLE_VIDEO'
  }
  if (reason === 'no_encodable_target_codec') {
    return 'UNSUPPORTED_ENCODER'
  }
  return 'CONVERT_FAILED'
}

// 音声トラックが変換から外されたときの、注意の種類。
// 読み出せない → AUDIO_UNDECODABLE、それ以外（書き出せない、など） → AUDIO_UNENCODABLE。
export const toAudioDiscardWarning = (reason: DiscardReason): VideoConvertWarningCode =>
  UNREADABLE_REASONS.includes(reason) ? 'AUDIO_UNDECODABLE' : 'AUDIO_UNENCODABLE'
