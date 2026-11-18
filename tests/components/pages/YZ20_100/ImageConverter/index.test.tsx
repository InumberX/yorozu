import { cleanup, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

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

  beforeEach(() => {
    result = renderWithProviders(<ImageConverter />)
  })

  test('見出しが h1 で出力される', () => {
    expect(result.getByRole('heading', { level: 1, name: '画像変換' })).not.toBe(null)
  })

  test('section の中に操作パネルがある', () => {
    expect(result.getByTestId('panel').closest('section')).not.toBe(null)
  })
})
