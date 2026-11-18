import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

import { Concept } from '~/components/pages/YZ10_100/Concept'
import { EXTERNAL_LINKS } from '~/config/consts'

describe('Concept', () => {
  afterEach(() => {
    cleanup()
  })

  test('見出しが h2、各項目が h3 で出力される', () => {
    const result = renderWithProviders(<Concept />)
    expect(result.getByRole('heading', { level: 2, name: 'コンセプト' })).not.toBe(null)
    expect(result.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  test('要望のリンクが文中にあり、別タブで開く', () => {
    const result = renderWithProviders(<Concept />)
    const link = result.getByText('こちら').closest('a')
    expect(link?.getAttribute('href')).toBe(EXTERNAL_LINKS.REQUEST)
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.closest('p')?.textContent).toBe('ツールは継続的に追加します。こちらから要望もお送りいただけます。')
  })
})
