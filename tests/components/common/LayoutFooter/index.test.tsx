import { cleanup, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { renderWithProviders } from '../../../test-utils'

import { LayoutFooter } from '~/components/common/LayoutFooter'

describe('LayoutFooter', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    result = renderWithProviders(<LayoutFooter />)
  })

  test('サイトの説明文（note）が出力されている', () => {
    expect(result.getByText('ブラウザ完結の便利ツールハブ')).not.toBe(null)
  })

  test('コピーライトが出力されている', () => {
    expect(result.getByText('© yorozu')).not.toBe(null)
  })
})
