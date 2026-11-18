import { cleanup, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

import { MainVisual } from '~/components/pages/YZ10_100/MainVisual'
import { TOOLS } from '~/config/tools'

describe('MainVisual', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    result = renderWithProviders(<MainVisual lang="ja" toolsId="tools" />)
  })

  test('見出しが h1 で 2 行に分かれている', () => {
    const heading = result.getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('あらゆるものが揃う器。')
    expect(heading.children).toHaveLength(2)
  })

  test('タグラインは読み上げ用に全文を持つ', () => {
    const tagline = result.getAllByText('A VESSEL THAT HOLDS EVERYTHING')
    expect(tagline.some((element) => element.getAttribute('aria-hidden') !== 'true')).toBe(true)
  })

  test('CTA がツール一覧のセクションを指す', () => {
    expect(result.getByText('ツールを見る').closest('a')?.getAttribute('href')).toBe('#tools')
  })

  test('稼働ツールの数がツール登録の数と一致する', () => {
    const value = result.getByText('稼働ツール').nextElementSibling
    expect(value?.textContent).toBe(String(TOOLS.length).padStart(2, '0'))
  })

  test('背景の模様は読み上げから外れている', () => {
    const geometry = result.container.querySelector('[class*="mainVisualGeometry"]')
    expect(geometry?.getAttribute('aria-hidden')).toBe('true')
    expect(geometry?.querySelectorAll('span')).toHaveLength(16)
  })
})
