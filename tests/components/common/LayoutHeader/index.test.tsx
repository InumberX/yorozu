import { act, cleanup, fireEvent, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { renderWithProviders } from '../../../test-utils'

import { LayoutHeader } from '~/components/common/LayoutHeader'

describe('LayoutHeader', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
  })

  describe('日本語', () => {
    beforeEach(() => {
      result = renderWithProviders(<LayoutHeader lang="ja" />)
    })

    test('ロゴがブランド名を代替テキストに持ち、ホームを指す', () => {
      const logo = result.getByAltText('yorozu')
      expect(logo.closest('a')?.getAttribute('href')).toBe('/')
    })

    test('ナビゲーション（ホーム / 画像 / 動画）が出力されている', () => {
      expect(result.getByText('ホーム')).not.toBe(null)
      expect(result.getByText('画像変換')).not.toBe(null)
      expect(result.getByText('動画変換')).not.toBe(null)
    })

    test('ナビゲーションが日本語（接頭辞なし）を指す', () => {
      const nav = result.container.querySelector('nav')
      expect(nav?.querySelector('a[href="/"]')).not.toBe(null)
      expect(nav?.querySelector('a[href="/image"]')).not.toBe(null)
      expect(nav?.querySelector('a[href="/video"]')).not.toBe(null)
    })

    test('現在のページに aria-current="page" が付く', () => {
      const nav = result.container.querySelector('nav')
      expect(nav?.querySelector('a[href="/"]')?.getAttribute('aria-current')).toBe('page')
      expect(nav?.querySelector('a[href="/image"]')?.getAttribute('aria-current')).toBe(null)
    })

    test('言語切り替え（JA / EN）が出力され、現在の言語に aria-current が付く', () => {
      const ja = result.getByText('JA').closest('a')
      const en = result.getByText('EN').closest('a')
      expect(ja?.getAttribute('href')).toBe('/')
      expect(en?.getAttribute('href')).toBe('/en')
      expect(ja?.getAttribute('aria-current')).toBe('true')
      expect(en?.getAttribute('aria-current')).toBe(null)
      expect(en?.getAttribute('hreflang')).toBe('en')
    })
  })

  describe('英語', () => {
    beforeEach(() => {
      result = renderWithProviders(<LayoutHeader lang="en" />, { route: '/en/image' })
    })

    test('ナビゲーションが /en 接頭辞を指す', () => {
      const nav = result.container.querySelector('nav')
      expect(nav?.querySelector('a[href="/en"]')).not.toBe(null)
      expect(nav?.querySelector('a[href="/en/image"]')).not.toBe(null)
      expect(nav?.querySelector('a[href="/en/video"]')).not.toBe(null)
    })

    test('現在のページに aria-current="page" が付く', () => {
      const nav = result.container.querySelector('nav')
      expect(nav?.querySelector('a[href="/en/image"]')?.getAttribute('aria-current')).toBe('page')
    })
  })

  describe('言語切り替えは現在ページを保つ', () => {
    test('JA の /image では EN が /en/image を指す', () => {
      result = renderWithProviders(<LayoutHeader lang="ja" />, { route: '/image' })
      expect(result.getByText('EN').closest('a')?.getAttribute('href')).toBe('/en/image')
      expect(result.getByText('JA').closest('a')?.getAttribute('href')).toBe('/image')
    })

    test('EN の /en/video では JA が /video を指す', () => {
      result = renderWithProviders(<LayoutHeader lang="en" />, { route: '/en/video' })
      expect(result.getByText('JA').closest('a')?.getAttribute('href')).toBe('/video')
      expect(result.getByText('EN').closest('a')?.getAttribute('href')).toBe('/en/video')
    })
  })

  describe('SP メニュー', () => {
    beforeEach(() => {
      result = renderWithProviders(<LayoutHeader lang="ja" />)
    })

    test('初期状態は閉じていて、ボタンがナビゲーションを制御対象に持つ', () => {
      const button = result.getByRole('button', { name: 'メニューを開く' })
      const nav = result.container.querySelector('nav')
      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(button.getAttribute('aria-controls')).toBe(nav?.id)
    })

    test('ボタンで開閉できる', () => {
      fireEvent.click(result.getByRole('button', { name: 'メニューを開く' }))
      const button = result.getByRole('button', { name: 'メニューを閉じる' })
      expect(button.getAttribute('aria-expanded')).toBe('true')

      fireEvent.click(button)
      expect(result.getByRole('button', { name: 'メニューを開く' }).getAttribute('aria-expanded')).toBe('false')
    })

    test('メニュー内にフォーカスがあるとき Esc で閉じると、フォーカスが開閉ボタンへ戻る', () => {
      fireEvent.click(result.getByRole('button', { name: 'メニューを開く' }))
      const link = result.container.querySelector<HTMLAnchorElement>('nav a[href="/image"]')
      link?.focus()
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(document.activeElement).toBe(result.getByRole('button', { name: 'メニューを開く' }))
    })

    test('Esc で閉じる', () => {
      fireEvent.click(result.getByRole('button', { name: 'メニューを開く' }))
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(result.getByRole('button', { name: 'メニューを開く' }).getAttribute('aria-expanded')).toBe('false')
    })

    test('メニュー内のリンクでページを移動すると閉じる', () => {
      fireEvent.click(result.getByRole('button', { name: 'メニューを開く' }))
      fireEvent.click(result.getByText('画像変換'))
      expect(result.getByRole('button', { name: 'メニューを開く' }).getAttribute('aria-expanded')).toBe('false')
    })
  })

  describe('SP メニューのアニメーション', () => {
    let notifyMediaChange: () => void

    beforeEach(() => {
      const listeners: (() => void)[] = []
      notifyMediaChange = () => listeners.forEach((listener) => listener())
      vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({
          matches: false,
          addEventListener: (_: string, listener: () => void) => listeners.push(listener),
          removeEventListener: vi.fn(),
        }))
      )
      result = renderWithProviders(<LayoutHeader lang="ja" />)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    test('初期状態ではアニメーションをかけない', () => {
      expect(result.container.querySelector('nav')?.className).not.toContain('layoutHeaderNav__animated')
    })

    test('ボタンで開閉したときはアニメーションをかける', () => {
      fireEvent.click(result.getByRole('button', { name: 'メニューを開く' }))
      expect(result.container.querySelector('nav')?.className).toContain('layoutHeaderNav__animated')
    })

    test('PC / SP が切り替わったら、アニメーションなしで閉じる', () => {
      fireEvent.click(result.getByRole('button', { name: 'メニューを開く' }))
      act(() => notifyMediaChange())

      const nav = result.container.querySelector('nav')
      expect(nav?.className).not.toContain('layoutHeaderNav__animated')
      expect(result.getByRole('button', { name: 'メニューを開く' }).getAttribute('aria-expanded')).toBe('false')
    })
  })
})
