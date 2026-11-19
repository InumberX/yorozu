import { describe, expect, test } from 'vitest'

import { toFileTypeLabel, toOutputFileName, toReductionLabel } from '~/features/file-convert/utils/convert-label'

describe('toOutputFileName', () => {
  test('拡張子を出力形式のものに変える', () => {
    expect(toOutputFileName('photo.png', 'webp', new Set())).toBe('photo.webp')
    expect(toOutputFileName('archive.v2.jpg', 'avif', new Set())).toBe('archive.v2.avif')
    expect(toOutputFileName('noext', 'webm', new Set())).toBe('noext.webm')
  })

  test('同じ回の中で名前がぶつかったら、番号を付ける', () => {
    const used = new Set<string>()
    expect(toOutputFileName('a.mp4', 'webm', used)).toBe('a.webm')
    expect(toOutputFileName('a.mov', 'webm', used)).toBe('a-2.webm')
    expect(toOutputFileName('a.MP4', 'webm', used)).toBe('a-3.webm')
  })
})

describe('toReductionLabel', () => {
  test('小さくなれば「-」、大きくなれば「+」を付ける', () => {
    expect(toReductionLabel(1000, 120)).toBe('-88%')
    expect(toReductionLabel(1000, 1420)).toBe('+42%')
    expect(toReductionLabel(1000, 1000)).toBe('±0%')
    expect(toReductionLabel(0, 10)).toBe('')
  })
})

describe('toFileTypeLabel', () => {
  test('ファイルの種類を短い名前にする', () => {
    expect(toFileTypeLabel('image/png')).toBe('PNG')
    expect(toFileTypeLabel('video/mp4')).toBe('MP4')
    expect(toFileTypeLabel('video/quicktime')).toBe('MOV')
    expect(toFileTypeLabel('')).toBe('')
  })
})
