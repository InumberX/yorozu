import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { FormErrorMessage } from '~/components/ui/forms/FormErrorMessage'

describe('FormErrorMessage', () => {
  afterEach(() => {
    cleanup()
  })

  test('エラーがないときも、参照先の要素だけは残す', () => {
    const result = render(<FormErrorMessage id="field-error" />)
    const element = result.container.querySelector('#field-error')
    expect(element).not.toBe(null)
    expect(element?.getAttribute('aria-live')).toBe('polite')
    expect(element?.querySelectorAll('li')).toHaveLength(0)
  })

  test('エラーを 1 件ずつ並べる', () => {
    const result = render(<FormErrorMessage id="field-error" errors={['A', 'B']} />)
    const items = result.container.querySelectorAll('#field-error li')
    expect(Array.from(items).map((item) => item.textContent)).toEqual(['A', 'B'])
  })
})
