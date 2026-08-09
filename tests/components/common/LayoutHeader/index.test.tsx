import { cleanup, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

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

    test('ブランド名が出力されている', () => {
      expect(result.getByText('yorozu')).not.toBe(null)
    })

    test('ナビゲーション（画像 / 動画）が出力されている', () => {
      expect(result.getByText('画像変換')).not.toBe(null)
      expect(result.getByText('動画変換')).not.toBe(null)
    })

    test('トップリンクが日本語（接頭辞なし）を指す', () => {
      const nav = result.container.querySelector('nav')
      const imageLink = nav?.querySelector('a[href="/image"]')
      const videoLink = nav?.querySelector('a[href="/video"]')
      expect(imageLink).not.toBe(null)
      expect(videoLink).not.toBe(null)
    })

    test('言語切り替えリンク（/ と /en）が出力されている', () => {
      expect(result.container.querySelector('a[href="/"]')).not.toBe(null)
      expect(result.container.querySelector('a[href="/en"]')).not.toBe(null)
    })
  })

  describe('英語', () => {
    beforeEach(() => {
      result = renderWithProviders(<LayoutHeader lang="en" />, { route: '/en' })
    })

    test('ナビゲーションが /en 接頭辞を指す', () => {
      const nav = result.container.querySelector('nav')
      expect(nav?.querySelector('a[href="/en/image"]')).not.toBe(null)
      expect(nav?.querySelector('a[href="/en/video"]')).not.toBe(null)
    })
  })

  describe('言語切り替えは現在ページを保つ', () => {
    test('JA の /image では English が /en/image を指す', () => {
      result = renderWithProviders(<LayoutHeader lang="ja" />, { route: '/image' })
      expect(result.getByText('English').getAttribute('href')).toBe('/en/image')
      expect(result.getByText('日本語').getAttribute('href')).toBe('/image')
    })

    test('EN の /en/video では 日本語 が /video を指す', () => {
      result = renderWithProviders(<LayoutHeader lang="en" />, { route: '/en/video' })
      expect(result.getByText('日本語').getAttribute('href')).toBe('/video')
      expect(result.getByText('English').getAttribute('href')).toBe('/en/video')
    })
  })
})
