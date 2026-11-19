import { describe, expect, test } from 'vitest'

import { formatDateTime, formatDateTimeForFileName } from '~/utils/date'

describe('date', () => {
  const date = new Date(2026, 0, 5, 9, 7)

  test('画面に出す日時', () => {
    expect(formatDateTime(date)).toBe('2026/01/05 09:07')
  })

  test('ファイル名に使う日時', () => {
    expect(formatDateTimeForFileName(date)).toBe('20260105-0907')
  })
})
