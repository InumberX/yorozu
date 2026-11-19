import { describe, expect, test } from 'vitest'

import { getDescriptionId, getErrorId, joinIds } from '~/utils/form'

describe('form', () => {
  test('Conform と同じ決まりで、エラーと説明の ID を求める', () => {
    expect(getErrorId('form-x')).toBe('form-x-error')
    expect(getDescriptionId('form-x')).toBe('form-x-description')
  })

  test('空の ID を落として並べ、何もなければ undefined を返す', () => {
    expect(joinIds('a', undefined, false, 'b')).toBe('a b')
    expect(joinIds(undefined, false)).toBe(undefined)
  })
})
