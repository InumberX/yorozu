import { cleanup, type RenderResult } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

import { ImageConverter } from '~/components/pages/YZ20_100/ImageConverter'

// 操作パネルは Worker を使うため、ここでは置き換える（パネル自体のテストは features 側にある）。
vi.mock('~/features/image-convert/components/ImageConvertPanel', () => ({
  ImageConvertPanel: () => <div data-testid="panel" />,
}))

describe('ImageConverter', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
  })

  describe('日本語', () => {
    test('見出し・リード・パンくずリストを出す', () => {
      result = renderWithProviders(<ImageConverter lang="ja" />)

      expect(result.getByRole('heading', { level: 1, name: '画像を変換する' })).not.toBe(null)
      expect(result.getByText('PNG・JPEG の画像を、WebP または AVIF に変換します。')).not.toBe(null)

      const breadcrumb = result.getByRole('navigation', { name: 'パンくずリスト' })
      expect(breadcrumb.querySelector('a')?.getAttribute('href')).toBe('/')
      expect(breadcrumb.querySelector('[aria-current="page"]')?.textContent).toBe('画像を変換する')
    })

    test('操作パネルと注記を出す', () => {
      result = renderWithProviders(<ImageConverter lang="ja" />)

      expect(result.getByTestId('panel')).not.toBe(null)
      expect(result.getByRole('heading', { level: 2, name: '対応形式と上限' })).not.toBe(null)
      expect(result.getByText('PNG・JPEG を読み込めます。1ファイル 20MB までです。')).not.toBe(null)
      expect(result.getByRole('heading', { level: 2, name: 'プライバシー' })).not.toBe(null)
    })
  })

  describe('英語', () => {
    test('パンくずリストの「ホーム」が英語のトップを指す', () => {
      result = renderWithProviders(<ImageConverter lang="en" />, { route: '/en/image' })

      const breadcrumb = result.getByRole('navigation', { name: 'パンくずリスト' })
      expect(breadcrumb.querySelector('a')?.getAttribute('href')).toBe('/en')
      expect(breadcrumb.querySelector('a')?.textContent).toBe('Home')
    })
  })
})
