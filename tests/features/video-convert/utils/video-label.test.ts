import { describe, expect, test } from 'vitest'

import { testI18n } from '../../../test-utils'

import { LANG } from '~/config/consts'
import { formatDuration, toSettingLabel, toVideoMetaLabel } from '~/features/video-convert/utils/video-label'

describe('video-label', () => {
  test('長さを「分:秒」で表し、1 時間を超えたら時間も付ける', () => {
    expect(formatDuration(42)).toBe('00:42')
    expect(formatDuration(75.4)).toBe('01:15')
    expect(formatDuration(3723)).toBe('1:02:03')
  })

  test('わかっている情報だけを「大きさ · 長さ · 容量」の順に並べる', () => {
    expect(toVideoMetaLabel({ width: 1920, height: 1080, duration: 42, size: 86.4 * 1024 * 1024 })).toBe(
      '1920×1080 · 00:42 · 86.4MB'
    )
    expect(toVideoMetaLabel({ size: 2048 })).toBe('2KB')
    expect(toVideoMetaLabel({ duration: Number.POSITIVE_INFINITY, size: 2048 })).toBe('2KB')
  })

  test('変換の設定を、画面の言語で表す', () => {
    const ja = testI18n.getFixedT(LANG.JA, 'pages/YZ30_100')
    const en = testI18n.getFixedT(LANG.EN, 'pages/YZ30_100')
    expect(toSettingLabel(ja, { codec: 'vp9', quality: 3, resolution: 'original' })).toBe(
      'WebM · VP9 / 画質 標準 / 元のまま'
    )
    expect(toSettingLabel(en, { codec: 'vp8', quality: 5, resolution: '1080' })).toBe(
      'WebM · VP8 / Quality: Highest / 1080p'
    )
  })
})
