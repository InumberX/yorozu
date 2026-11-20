import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { LayoutMain } from '~/components/ui/layouts/LayoutMain'

describe('LayoutMain', () => {
  afterEach(() => {
    cleanup()
  })

  test('既定では main 要素で中身を包む', () => {
    const result = render(<LayoutMain>本文</LayoutMain>)
    const main = result.container.querySelector('main')
    expect(main?.textContent).toBe('本文')
    expect(main?.hasAttribute('id')).toBe(false)
  })

  test('id を渡すと main 要素に付く（スキップリンクの飛び先になる）', () => {
    const result = render(<LayoutMain id="main-content">本文</LayoutMain>)
    expect(result.container.querySelector('main')?.getAttribute('id')).toBe('main-content')
  })

  test('tag で要素を変えられる', () => {
    const result = render(<LayoutMain tag="div">本文</LayoutMain>)
    expect(result.container.querySelector('main')).toBe(null)
    expect(result.container.firstElementChild?.tagName).toBe('DIV')
  })
})
