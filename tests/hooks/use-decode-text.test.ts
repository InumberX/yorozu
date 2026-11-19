import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { getDecodingText, useDecodeText } from '~/hooks/use-decode-text'

const TEXT = 'A VESSEL THAT HOLDS EVERYTHING'

const mockReducedMotion = (matches: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
    })
  )
}

describe('getDecodingText', () => {
  test('コマが進むほど先頭から確定し、空白は空白のまま残る', () => {
    const text = getDecodingText(TEXT, 15)
    expect(text).toHaveLength(TEXT.length)
    expect(text.startsWith(TEXT.slice(0, 15))).toBe(true)
    expect(text[TEXT.indexOf(' ', 16)]).toBe(' ')
  })

  test('最後のコマで全文になる', () => {
    expect(getDecodingText(TEXT, 30)).toBe(TEXT)
  })
})

describe('useDecodeText', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  test('最初の描画では全文を返し、演出のあと全文に戻る', () => {
    mockReducedMotion(false)
    const { result } = renderHook(() => useDecodeText(TEXT))
    expect(result.current).toBe(TEXT)

    act(() => {
      vi.advanceTimersByTime(40)
    })
    expect(result.current).not.toBe(TEXT)
    expect(result.current).toHaveLength(TEXT.length)

    act(() => {
      vi.advanceTimersByTime(40 * 30)
    })
    expect(result.current).toBe(TEXT)
  })

  test('動きを減らす設定では演出しない', () => {
    mockReducedMotion(true)
    const { result } = renderHook(() => useDecodeText(TEXT))

    act(() => {
      vi.advanceTimersByTime(40)
    })
    expect(result.current).toBe(TEXT)
  })

  test('空文字では演出しない', () => {
    mockReducedMotion(false)
    const { result } = renderHook(() => useDecodeText(''))

    act(() => {
      vi.advanceTimersByTime(40)
    })
    expect(result.current).toBe('')
  })

  test('text が変わったら、すぐ新しい text を返す', () => {
    mockReducedMotion(false)
    const { result, rerender } = renderHook(({ text }) => useDecodeText(text), { initialProps: { text: TEXT } })

    act(() => {
      vi.advanceTimersByTime(40)
    })
    rerender({ text: 'NEW TEXT' })
    expect(result.current).toBe('NEW TEXT')
  })
})
