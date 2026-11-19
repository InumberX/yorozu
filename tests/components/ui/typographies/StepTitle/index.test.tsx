import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { StepTitle } from '~/components/ui/typographies/StepTitle'

describe('StepTitle', () => {
  afterEach(() => {
    cleanup()
  })

  test('番号を 2 桁にして、見出しの前に置く（読み上げからは外す）', () => {
    const result = render(<StepTitle step={1} title="読み込む" />)
    const step = result.getByText('STEP 01')
    expect(step.getAttribute('aria-hidden')).toBe('true')
    expect(result.getByRole('heading', { level: 2, name: '読み込む' })).not.toBe(null)
  })

  test('見出しのタグと、右端に置くものを指定できる', () => {
    const result = render(
      <StepTitle step={3} title="変換する" titleTag="h3" action={<button type="button">リセット</button>} />
    )
    expect(result.getByRole('heading', { level: 3, name: '変換する' })).not.toBe(null)
    expect(result.getByRole('button', { name: 'リセット' })).not.toBe(null)
  })
})
