import { describe, expect, test } from 'vitest'

import { testI18n } from '../../../test-utils'

import { LANG } from '~/config/consts'
import { toImageMetaLabel, toSettingLabel } from '~/features/image-convert/utils/image-label'

describe('image-label', () => {
  test('大きさ（px）がわかれば先頭に付ける', () => {
    expect(toImageMetaLabel({ width: 3024, height: 2016, size: 4.2 * 1024 * 1024, type: 'image/png' })).toBe(
      '3024×2016 · 4.2MB · PNG'
    )
    expect(toImageMetaLabel({ size: 2048, type: 'image/jpeg' })).toBe('2KB · JPEG')
  })

  test('変換の設定を、画面の言語で表す', () => {
    const ja = testI18n.getFixedT(LANG.JA, 'pages/YZ20_100')
    const en = testI18n.getFixedT(LANG.EN, 'pages/YZ20_100')
    expect(toSettingLabel(ja, { format: 'webp', quality: 80 })).toBe('WebP / 品質 80')
    expect(toSettingLabel(ja, { format: 'avif', lossless: true })).toBe('AVIF / ロスレスで書き出す')
    expect(toSettingLabel(en, { format: 'avif', quality: 60 })).toBe('AVIF / Quality 60')
  })
})
