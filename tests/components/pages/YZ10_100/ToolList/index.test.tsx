import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

import { ToolList } from '~/components/pages/YZ10_100/ToolList'
import { EXTERNAL_LINKS } from '~/config/consts'
import { TOOLS } from '~/config/tools'

describe('ToolList', () => {
  afterEach(() => {
    cleanup()
  })

  test('section に id が付き、見出しが h2 で出力される', () => {
    const result = renderWithProviders(<ToolList lang="ja" id="tools" />)
    expect(result.container.querySelector('section#tools')).not.toBe(null)
    expect(result.getByRole('heading', { level: 2, name: 'ツール一覧' })).not.toBe(null)
  })

  test('ツール登録の数と次のツールの分だけ並ぶ', () => {
    const result = renderWithProviders(<ToolList lang="ja" id="tools" />)
    expect(result.getAllByRole('listitem')).toHaveLength(TOOLS.length + 1)
  })

  test('日本語ではツールが接頭辞なしのページを同じタブで開く', () => {
    const result = renderWithProviders(<ToolList lang="ja" id="tools" />)
    const image = result.getByText('画像を変換する').closest('a')
    expect(image?.getAttribute('href')).toBe('/image')
    expect(image?.getAttribute('target')).toBe(null)
    expect(result.getByText('動画を変換する').closest('a')?.getAttribute('href')).toBe('/video')
  })

  test('英語ではツールが /en 接頭辞のページを指す', () => {
    const result = renderWithProviders(<ToolList lang="en" id="tools" />, { route: '/en' })
    expect(result.container.querySelector('a[href="/en/image"]')).not.toBe(null)
    expect(result.container.querySelector('a[href="/en/video"]')).not.toBe(null)
  })

  test('次のツールは要望の受付を別タブで開く', () => {
    const result = renderWithProviders(<ToolList lang="ja" id="tools" />)
    const request = result.getByText('次のツール').closest('a')
    expect(request?.getAttribute('href')).toBe(EXTERNAL_LINKS.REQUEST)
    expect(request?.getAttribute('target')).toBe('_blank')
    expect(request?.getAttribute('rel')).toBe('noopener noreferrer')
  })
})
