import { describe, expect, test } from 'vitest'

import { toTwoDigits, TOOLS } from '~/config/tools'
import enPage from '~/locales/en/pages/YZ10_100.json'
import jaPage from '~/locales/ja/pages/YZ10_100.json'

describe('TOOLS', () => {
  test('id が重複していない', () => {
    const ids = TOOLS.map((tool) => tool.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test.each(TOOLS.map((tool) => tool.id))('%s の名前と説明が日本語・英語の両方にある', (id) => {
    for (const page of [jaPage, enPage]) {
      const item = (page.tools.items as Record<string, { name: string; description: string }>)[id]
      expect(item?.name).toBeTruthy()
      expect(item?.description).toBeTruthy()
    }
  })
})

describe('toTwoDigits', () => {
  test('2 桁にそろえる', () => {
    expect(toTwoDigits(1)).toBe('01')
    expect(toTwoDigits(12)).toBe('12')
  })
})
