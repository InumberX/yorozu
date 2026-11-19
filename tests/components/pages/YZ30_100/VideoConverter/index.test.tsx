import { cleanup, type RenderResult } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

import { VideoConverter } from '~/components/pages/YZ30_100/VideoConverter'

// 操作パネルは Worker を使うため、ここでは置き換える（パネル自体のテストは features 側にある）。
vi.mock('~/features/video-convert/components/VideoConvertPanel', () => ({
  VideoConvertPanel: () => <div data-testid="panel" />,
}))

describe('VideoConverter', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
  })

  describe('日本語', () => {
    test('見出し・リード・パンくずリストを出す', () => {
      result = renderWithProviders(<VideoConverter lang="ja" />)

      expect(result.getByRole('heading', { level: 1, name: '動画を変換する' })).not.toBe(null)
      expect(result.getByText('MP4・MOV の動画を、WebM に変換します。')).not.toBe(null)

      const breadcrumb = result.getByRole('navigation', { name: 'パンくずリスト' })
      expect(breadcrumb.querySelector('a')?.getAttribute('href')).toBe('/')
      expect(breadcrumb.querySelector('[aria-current="page"]')?.textContent).toBe('動画を変換する')
    })

    test('操作パネルと注記を出す', () => {
      result = renderWithProviders(<VideoConverter lang="ja" />)

      expect(result.getByTestId('panel')).not.toBe(null)
      expect(result.getByRole('heading', { level: 2, name: '対応形式と上限' })).not.toBe(null)
      expect(result.getByText('MP4・MOV を読み込めます。端末内で処理するため、長さ 2分・200MB までです。')).not.toBe(
        null
      )
      expect(result.getByRole('heading', { level: 2, name: 'プライバシー' })).not.toBe(null)
    })
  })

  describe('英語', () => {
    test('パンくずリストの「ホーム」が英語のトップを指す', () => {
      result = renderWithProviders(<VideoConverter lang="en" />, { route: '/en/video' })

      const breadcrumb = result.getByRole('navigation', { name: 'パンくずリスト' })
      expect(breadcrumb.querySelector('a')?.getAttribute('href')).toBe('/en')
      expect(breadcrumb.querySelector('a')?.textContent).toBe('Home')
    })
  })
})
