import { describe, expect, test } from 'vitest'

import { toTwoDigits } from '~/utils/to-two-digits'

describe('toTwoDigits', () => {
  test('1 桁は 0 を補って 2 桁にする', () => {
    expect(toTwoDigits(1)).toBe('01')
  })

  test('2 桁以上はそのまま', () => {
    expect(toTwoDigits(12)).toBe('12')
    expect(toTwoDigits(123)).toBe('123')
  })
})
