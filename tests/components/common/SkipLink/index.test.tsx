import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { renderWithProviders } from '../../../test-utils'

import { SkipLink } from '~/components/common/SkipLink'

describe('SkipLink', () => {
  afterEach(() => {
    cleanup()
  })

  test('本文の id を指すリンクを出力する', () => {
    const result = renderWithProviders(<SkipLink targetId="main-content" />)
    const link = result.getByRole('link', { name: '本文へスキップ' })
    expect(link.getAttribute('href')).toBe('#main-content')
  })
})
