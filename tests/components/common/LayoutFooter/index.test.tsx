import { cleanup, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { renderWithProviders } from '../../../test-utils'

import { LayoutFooter } from '~/components/common/LayoutFooter'

describe('LayoutFooter', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
  })

  describe('日本語', () => {
    beforeEach(() => {
      result = renderWithProviders(<LayoutFooter lang="ja" />)
    })

    test('ロゴがブランド名を代替テキストに持ち、タグラインが英語として出力されている', () => {
      expect(result.getByAltText('yorozu')).not.toBe(null)
      expect(result.getByText('A VESSEL THAT HOLDS EVERYTHING').getAttribute('lang')).toBe('en')
    })

    test('ツールのナビゲーションが日本語（接頭辞なし）のページを指す', () => {
      const nav = result.getByRole('navigation', { name: 'ツール一覧' })
      expect(result.getByText('画像を変換する').closest('a')?.getAttribute('href')).toBe('/image')
      expect(result.getByText('動画を変換する').closest('a')?.getAttribute('href')).toBe('/video')
      expect(nav.querySelectorAll('a')).toHaveLength(2)
    })

    test('関連リンクのナビゲーションが外部サイトを指す', () => {
      const nav = result.getByRole('navigation', { name: '関連リンク' })
      expect(nav.querySelector('a[href="https://github.com/InumberX/yorozu/issues"]')?.textContent).toBe(
        'REQUEST（新しいタブで開きます）'
      )
      expect(nav.querySelector('a[href="https://github.com/InumberX"]')?.textContent).toBe(
        'GITHUB（新しいタブで開きます）'
      )
      expect(nav.querySelector('a[href="https://afterworks.jp"]')?.textContent).toBe(
        'AFTERWORKS（新しいタブで開きます）'
      )
    })

    test('関連リンクは別タブで開く', () => {
      const links = result.getByRole('navigation', { name: '関連リンク' }).querySelectorAll('a')
      expect(links).toHaveLength(3)
      links.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank')
        expect(link.getAttribute('rel')).toBe('noopener')
      })
    })

    test('ツールのリンクは同じタブで開く', () => {
      const links = result.getByRole('navigation', { name: 'ツール一覧' }).querySelectorAll('a')
      expect(links).toHaveLength(2)
      links.forEach((link) => {
        expect(link.getAttribute('target')).toBe(null)
      })
    })

    test('コピーライトが英語として出力されている', () => {
      expect(result.getByText('© NiNE, ALL RIGHTS RESERVED.').getAttribute('lang')).toBe('en')
    })
  })

  // テスト用の i18n は日本語に固定しているため、文言は日本語のまま、リンク先だけを確かめる。
  describe('英語（/en 接頭辞）', () => {
    beforeEach(() => {
      result = renderWithProviders(<LayoutFooter lang="en" />, { route: '/en' })
    })

    test('ツールのナビゲーションが /en 接頭辞のページを指す', () => {
      const nav = result.getByRole('navigation', { name: 'ツール一覧' })
      expect(nav.querySelector('a[href="/en/image"]')).not.toBe(null)
      expect(nav.querySelector('a[href="/en/video"]')).not.toBe(null)
    })
  })
})
