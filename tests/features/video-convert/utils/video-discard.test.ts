import { describe, expect, test } from 'vitest'

import { toAudioDiscardWarning, toVideoDiscardError } from '~/features/video-convert/utils/video-discard'

describe('toVideoDiscardError', () => {
  test.each([
    ['undecodable_source_codec', 'UNDECODABLE_VIDEO'],
    ['unknown_source_codec', 'UNDECODABLE_VIDEO'],
    ['no_encodable_target_codec', 'UNSUPPORTED_ENCODER'],
    ['cannot_copy', 'CONVERT_FAILED'],
    ['discarded_by_user', 'CONVERT_FAILED'],
  ] as const)('映像が %s で外されたら %s', (reason, code) => {
    expect(toVideoDiscardError(reason)).toBe(code)
  })
})

describe('toAudioDiscardWarning', () => {
  test.each([
    ['undecodable_source_codec', 'AUDIO_UNDECODABLE'],
    ['unknown_source_codec', 'AUDIO_UNDECODABLE'],
    ['no_encodable_target_codec', 'AUDIO_UNENCODABLE'],
  ] as const)('音声が %s で外されたら %s', (reason, code) => {
    expect(toAudioDiscardWarning(reason)).toBe(code)
  })
})
