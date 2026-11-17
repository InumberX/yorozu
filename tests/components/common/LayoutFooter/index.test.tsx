import { cleanup, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { renderWithProviders } from '../../../test-utils'

import { getYearInJapan, LayoutFooter } from '~/components/common/LayoutFooter'

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
      expect(nav.querySelector('a[href="https://github.com/InumberX/yorozu/issues"]')?.textContent).toBe('REQUEST')
      expect(nav.querySelector('a[href="https://github.com/InumberX"]')?.textContent).toBe('GITHUB')
      expect(nav.querySelector('a[href="https://afterworks.jp"]')?.textContent).toBe('AFTERWORKS')
    })

    test('コピーライトが閲覧時点の日本時間の年で出力されている', () => {
      const year = getYearInJapan(new Date())
      expect(result.getByText(`© ${year} NiNE, ALL RIGHTS RESERVED.`)).not.toBe(null)
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

  test('日本時間の 0 時で年が変わる（UTC ではまだ前年）', () => {
    expect(getYearInJapan(new Date('2026-12-31T15:00:00Z'))).toBe(2027)
    expect(getYearInJapan(new Date('2026-12-31T14:59:59Z'))).toBe(2026)
  })
})
