import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { toOutputFileName, useImageConvert } from '~/features/image-convert/hooks/use-image-convert'
import type { ImageConvertRequest, ImageConvertResponse } from '~/features/image-convert/types'

// jsdom に Worker はないため、変換の Worker を置き換える。
// 依頼が届いたら behavior の指示どおりに返す（成功・失敗・落ちる・返事をしない）。
type Behavior = 'done' | 'error' | 'crash' | 'hang'

const workers: FakeWorker[] = []
let behaviors: Behavior[] = []

class FakeWorker {
  onmessage: ((event: MessageEvent<ImageConvertResponse>) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onmessageerror: ((event: Event) => void) | null = null
  isTerminated = false

  constructor() {
    workers.push(this)
  }

  postMessage(request: ImageConvertRequest) {
    const behavior = behaviors.shift() ?? 'done'
    queueMicrotask(() => {
      if (this.isTerminated) {
        return
      }
      switch (behavior) {
        case 'done':
          this.onmessage?.({ data: { type: 'done', id: request.id, blob: new Blob(['ok']) } } as MessageEvent)
          break
        case 'error':
          this.onmessage?.({
            data: { type: 'error', id: request.id, code: 'ENCODE_FAILED', message: 'x' },
          } as MessageEvent)
          break
        case 'crash':
          this.onerror?.(new Event('error'))
          break
        case 'hang':
          break
      }
    })
  }

  terminate() {
    this.isTerminated = true
  }
}

const createFile = (name: string) => new File(['x'], name, { type: 'image/png' })
const OPTIONS = { format: 'webp', quality: 80, lossless: false } as const

describe('useImageConvert', () => {
  beforeEach(() => {
    workers.length = 0
    behaviors = []
    vi.stubGlobal('Worker', FakeWorker)
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() }))
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('描画しただけでは Worker を作らない', () => {
    renderHook(() => useImageConvert())
    expect(workers).toHaveLength(0)
  })

  test('ファイルを 1 つずつ変換し、終わったら結果をまとめて Worker を止める', async () => {
    const { result } = renderHook(() => useImageConvert())

    await act(() => result.current.convert([createFile('a.png'), createFile('b.png')], OPTIONS))

    expect(result.current.status).toBe('done')
    expect(result.current.progress).toBe(100)
    expect(result.current.groups[0].items.map((item) => item.fileName)).toEqual(['a.webp', 'b.webp'])
    expect(workers).toHaveLength(1)
    expect(workers[0].isTerminated).toBe(true)
  })

  test('変換できなかったファイルは、名前を残して次へ進む', async () => {
    behaviors = ['error', 'done']
    const { result } = renderHook(() => useImageConvert())

    await act(() => result.current.convert([createFile('a.png'), createFile('b.png')], OPTIONS))

    expect(result.current.groups[0].failedNames).toEqual(['a.png'])
    expect(result.current.groups[0].items.map((item) => item.sourceName)).toEqual(['b.png'])
  })

  test('Worker が 1 回落ちたら、作り直して次のファイルを変換する', async () => {
    behaviors = ['crash', 'done']
    const { result } = renderHook(() => useImageConvert())

    await act(() => result.current.convert([createFile('a.png'), createFile('b.png')], OPTIONS))

    expect(result.current.status).toBe('done')
    expect(result.current.groups[0].failedNames).toEqual(['a.png'])
    expect(result.current.groups[0].items.map((item) => item.sourceName)).toEqual(['b.png'])
    expect(workers).toHaveLength(2)
  })

  test('Worker が続けて落ちたら、残りのファイルは変換せずに終える', async () => {
    behaviors = ['crash', 'crash', 'done']
    const { result } = renderHook(() => useImageConvert())

    await act(() => result.current.convert([createFile('a.png'), createFile('b.png'), createFile('c.png')], OPTIONS))

    expect(result.current.status).toBe('done')
    expect(result.current.groups[0].failedNames).toEqual(['a.png', 'b.png', 'c.png'])
    expect(workers).toHaveLength(2)
  })

  test('中止すると Worker を止め、結果を残さない', async () => {
    behaviors = ['hang']
    const { result } = renderHook(() => useImageConvert())

    let converting: Promise<void> | undefined
    act(() => {
      converting = result.current.convert([createFile('a.png')], OPTIONS)
    })
    await waitFor(() => expect(result.current.status).toBe('converting'))

    act(() => result.current.cancel())
    await act(() => converting)

    expect(result.current.status).toBe('idle')
    expect(result.current.groups).toHaveLength(0)
    expect(workers[0].isTerminated).toBe(true)
  })

  test('結果を削除すると、保存用の URL を手放す', async () => {
    const { result } = renderHook(() => useImageConvert())
    await act(() => result.current.convert([createFile('a.png')], OPTIONS))

    act(() => result.current.removeGroup(result.current.groups[0].id))

    expect(result.current.groups).toHaveLength(0)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:x')
  })
})

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
