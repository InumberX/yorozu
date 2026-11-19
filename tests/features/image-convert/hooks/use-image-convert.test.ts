import { describe, expect, test } from 'vitest'

import { toOutputFileName } from '~/features/image-convert/hooks/use-image-convert'

describe('toOutputFileName', () => {
  test('拡張子を出力形式のものに変える', () => {
    expect(toOutputFileName('photo.png', 'webp', new Set())).toBe('photo.webp')
    expect(toOutputFileName('archive.v2.jpg', 'avif', new Set())).toBe('archive.v2.avif')
    expect(toOutputFileName('noext', 'webp', new Set())).toBe('noext.webp')
  })

  test('同じ回の中で名前がぶつかったら、番号を付ける', () => {
    const used = new Set<string>()
    expect(toOutputFileName('a.png', 'webp', used)).toBe('a.webp')
    expect(toOutputFileName('a.jpg', 'webp', used)).toBe('a-2.webp')
    expect(toOutputFileName('a.jpeg', 'webp', used)).toBe('a-3.webp')
  })
})
