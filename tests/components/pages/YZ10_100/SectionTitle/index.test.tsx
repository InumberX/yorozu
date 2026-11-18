import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { SectionTitle } from '~/components/pages/YZ10_100/SectionTitle'

describe('SectionTitle', () => {
  afterEach(() => {
    cleanup()
  })

  test('見出しが h2 で、番号は読み上げから外れている', () => {
    const result = render(<SectionTitle label="SEC.01" title="ツール一覧" />)
    expect(result.getByRole('heading', { level: 2, name: 'ツール一覧' })).not.toBe(null)
    expect(result.getByText('SEC.01').getAttribute('aria-hidden')).toBe('true')
  })
})
