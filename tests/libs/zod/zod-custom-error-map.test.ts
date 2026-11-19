import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { z } from 'zod'

import { testI18n } from '../../test-utils'

import { LANG } from '~/config/consts'
import { createZodCustomErrorMap } from '~/libs/zod/zod-custom-error-map'

const getMessage = (schema: z.ZodType, value: unknown) => {
  const result = schema.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}

describe('createZodCustomErrorMap', () => {
  afterAll(() => {
    z.config({ customError: undefined })
  })

  describe('日本語', () => {
    beforeAll(() => {
      z.config({ customError: createZodCustomErrorMap(testI18n.getFixedT(LANG.JA, 'common')) })
    })

    test('値がないときは、入力を求める', () => {
      expect(getMessage(z.string(), undefined)).toBe('入力してください。')
    })

    test('数値と配列の範囲', () => {
      expect(getMessage(z.number().max(100), 101)).toBe('100 以下にしてください。')
      expect(getMessage(z.array(z.string()).min(1), [])).toBe('1 個以上選んでください。')
    })

    test('ファイルの大きさは、単位を付けて出す', () => {
      const file = new File([new Uint8Array(2 * 1024 * 1024)], 'a.png', { type: 'image/png' })
      expect(getMessage(z.file().max(1024 * 1024), file)).toBe('1MB までのファイルにしてください。')
    })

    test('ファイルの形式', () => {
      const file = new File(['x'], 'a.gif', { type: 'image/gif' })
      expect(getMessage(z.file().mime(['image/png']), file)).toBe('選べない値です。')
    })

    test('スキーマに書いた文言は、そちらを優先する', () => {
      expect(getMessage(z.string({ error: '個別の文言' }), undefined)).toBe('個別の文言')
    })
  })

  describe('英語', () => {
    beforeAll(() => {
      z.config({ customError: createZodCustomErrorMap(testI18n.getFixedT(LANG.EN, 'common')) })
    })

    test('数に合わせて単数形・複数形を使い分ける', () => {
      expect(getMessage(z.array(z.string()).min(1), [])).toBe('Choose at least 1 item.')
      expect(getMessage(z.array(z.string()).max(2), ['a', 'b', 'c'])).toBe('Choose up to 2 items.')
    })
  })
})
