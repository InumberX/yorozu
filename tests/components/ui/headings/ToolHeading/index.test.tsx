import { cleanup, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

import { ToolHeading } from '~/components/ui/headings/ToolHeading'

describe('ToolHeading', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    result = renderWithProviders(
      <ToolHeading
        breadcrumbs={[{ name: 'ホーム', url: '/' }]}
        breadcrumbLabel="パンくずリスト"
        label="IMAGE"
        title="画像を変換する"
        lead="リード"
      />
    )
  })

  test('見出しを h1 で出し、リードを添える', () => {
    expect(result.getByRole('heading', { level: 1, name: '画像を変換する' })).not.toBe(null)
    expect(result.getByText('リード')).not.toBe(null)
  })

  test('パンくずリストは上の階層をリンクにし、最後に今のページを置く', () => {
    const items = result.getByRole('navigation', { name: 'パンくずリスト' }).querySelectorAll('li')
    expect(items).toHaveLength(2)
    expect(items[0].querySelector('a')?.getAttribute('href')).toBe('/')
    expect(items[1].querySelector('[aria-current="page"]')?.textContent).toBe('画像を変換する')
  })

  test('ラベルを英語として出す', () => {
    expect(result.getByText('IMAGE').getAttribute('lang')).toBe('en')
  })
})
