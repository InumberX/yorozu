import { cleanup, fireEvent, type RenderResult, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

import type { ImageConvertResultGroup } from '~/features/image-convert/hooks/use-image-convert'

// Worker を作る hook は置き換える（jsdom に Worker はないため）。返す状態はテストごとに変える。
const { hookState } = vi.hoisted(() => ({
  hookState: {
    status: 'idle' as 'idle' | 'converting' | 'done',
    progress: 0,
    groups: [] as ImageConvertResultGroup[],
    convert: vi.fn(),
    cancel: vi.fn(),
    clearDone: vi.fn(),
    removeGroup: vi.fn(),
  },
}))
vi.mock('~/features/image-convert/hooks/use-image-convert', () => ({
  useImageConvert: () => hookState,
}))

const { createZipMock } = vi.hoisted(() => ({ createZipMock: vi.fn() }))
vi.mock('~/utils/download', () => ({ createZip: createZipMock, downloadBlob: vi.fn() }))

import { ImageConvertPanel } from '~/features/image-convert/components/ImageConvertPanel'

const createFile = (name: string, type = 'image/png') => new File(['x'], name, { type, lastModified: 1 })

const createGroup = (): ImageConvertResultGroup => ({
  id: 'g1',
  convertedAt: new Date(2026, 10, 19, 12, 34),
  options: { format: 'avif', quality: 60, lossless: false },
  items: [
    {
      id: 'i1',
      sourceName: 'a.png',
      fileName: 'a.avif',
      beforeSize: 4000,
      afterSize: 1000,
      blob: new Blob(['x']),
      url: 'blob:a',
    },
    {
      id: 'i2',
      sourceName: 'b.jpg',
      fileName: 'b.avif',
      beforeSize: 2000,
      afterSize: 1000,
      blob: new Blob(['x']),
      url: 'blob:b',
    },
  ],
  failedNames: ['c.png'],
})

describe('ImageConvertPanel', () => {
  let result: RenderResult

  const getInput = () => result.container.querySelector('input[type="file"]') as HTMLInputElement
  const pickFiles = (files: File[]) => fireEvent.change(getInput(), { target: { files } })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    hookState.status = 'idle'
    hookState.progress = 0
    hookState.groups = []
  })

  describe('ファイルがないとき', () => {
    test('変換するボタンが押せず、読み込むよう案内する', () => {
      result = renderWithProviders(<ImageConvertPanel />)
      expect(result.getByText('ファイルを読み込むと変換できます。')).not.toBe(null)
      expect(result.getByRole('button', { name: /変換する/ })).toBeDisabled()
    })

    test('既定は WebP・品質 80・ロスレスなし', () => {
      result = renderWithProviders(<ImageConvertPanel />)
      expect(result.getByRole('radio', { name: 'WebP' })).toBeChecked()
      expect((result.getByRole('slider', { name: '品質' }) as HTMLInputElement).value).toBe('80')
      expect(result.getByRole('checkbox', { name: 'ロスレスで書き出す' })).not.toBeChecked()
    })

    test('読み込める形式を input の accept に渡す', () => {
      result = renderWithProviders(<ImageConvertPanel />)
      expect(getInput().getAttribute('accept')).toBe('image/png,image/jpeg')
    })
  })

  describe('ファイルを読み込んだとき', () => {
    test('一覧に出し、件数と出力の設定を見せる', () => {
      result = renderWithProviders(<ImageConvertPanel />)
      pickFiles([createFile('a.png'), createFile('b.jpg', 'image/jpeg')])

      expect(result.getByText('a.png')).not.toBe(null)
      expect(result.getByText('b.jpg')).not.toBe(null)
      expect(result.getByText('2件のファイル')).not.toBe(null)
      expect(result.getByText('→ WebP / 品質 80')).not.toBe(null)
      expect(result.getByRole('button', { name: /変換する/ })).toBeEnabled()
    })

    test('削除とリセットで一覧から外す', () => {
      result = renderWithProviders(<ImageConvertPanel />)
      pickFiles([createFile('a.png'), createFile('b.png')])

      fireEvent.click(result.getByRole('button', { name: 'ファイルを削除: a.png' }))
      expect(result.queryByText('a.png')).toBe(null)
      expect(result.getByText('b.png')).not.toBe(null)

      fireEvent.click(result.getByRole('button', { name: 'リセット' }))
      expect(result.queryByText('b.png')).toBe(null)
      expect(result.getByRole('button', { name: /変換する/ })).toBeDisabled()
      expect(result.queryByText('ファイルを読み込んでください。')).toBe(null)
    })

    test('ロスレスにすると品質のスライダーが押せなくなり、設定の表示も変わる', () => {
      result = renderWithProviders(<ImageConvertPanel />)
      pickFiles([createFile('a.png')])

      fireEvent.click(result.getByRole('checkbox', { name: 'ロスレスで書き出す' }))
      expect(result.getByRole('slider', { name: '品質' })).toBeDisabled()
      expect(result.getByText('→ WebP / ロスレスで書き出す')).not.toBe(null)
    })

    test('変換すると、読み込んだファイルと設定で convert を呼ぶ', async () => {
      // jsdom の FormData は、テストで差し替えた input.files を読まない。
      // ブラウザと同じく、ファイルの入力の中身を FormData に入れる。
      const OriginalFormData = globalThis.FormData
      class FormDataWithFiles extends OriginalFormData {
        constructor(form?: HTMLFormElement, submitter?: HTMLElement | null) {
          super(form, submitter)
          form?.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach((input) => {
            this.delete(input.name)
            for (const file of Array.from(input.files ?? [])) {
              this.append(input.name, file)
            }
          })
        }
      }
      vi.stubGlobal('FormData', FormDataWithFiles)

      result = renderWithProviders(<ImageConvertPanel />)
      const file = createFile('a.png')
      pickFiles([file])

      fireEvent.click(result.getByRole('radio', { name: 'AVIF' }))
      fireEvent.change(result.getByRole('slider', { name: '品質' }), { target: { value: '60' } })
      fireEvent.click(result.getByRole('button', { name: /変換する/ }))

      await waitFor(() =>
        expect(hookState.convert).toHaveBeenCalledWith([file], { format: 'avif', quality: 60, lossless: false })
      )
      vi.unstubAllGlobals()
    })
  })

  describe('変換中', () => {
    test('進み具合と中止ボタンを出し、入力を押せなくする', () => {
      hookState.status = 'converting'
      hookState.progress = 42
      result = renderWithProviders(<ImageConvertPanel />)

      expect(result.getByRole('progressbar', { name: '変換しています' }).getAttribute('value')).toBe('42')
      expect(result.getByText('42%')).not.toBe(null)
      expect(result.getByRole('radio', { name: 'WebP' })).toBeDisabled()

      fireEvent.click(result.getByRole('button', { name: '中止する' }))
      expect(hookState.cancel).toHaveBeenCalled()
    })
  })

  describe('変換結果', () => {
    test('回ごとに日時・設定・ファイルを並べ、1 件ずつ保存できる', () => {
      hookState.status = 'done'
      hookState.groups = [createGroup()]
      result = renderWithProviders(<ImageConvertPanel />)

      expect(result.getByText('変換が完了しました')).not.toBe(null)
      expect(result.getByText('2026/11/19 12:34')).not.toBe(null)
      expect(result.getByText('AVIF / 品質 60')).not.toBe(null)

      const download = result.getByRole('link', { name: 'ダウンロード: a.avif' })
      expect(download.getAttribute('href')).toBe('blob:a')
      expect(download.getAttribute('download')).toBe('a.avif')
      expect(result.getByText('-75%')).not.toBe(null)
    })

    test('2 件以上ならまとめて保存でき、変換できなかったファイルを知らせる', () => {
      hookState.groups = [createGroup()]
      result = renderWithProviders(<ImageConvertPanel />)

      expect(result.getByRole('button', { name: 'すべてダウンロード（ZIP）: 2026/11/19 12:34' })).not.toBe(null)
      expect(result.getByText('変換できなかったファイル: c.png').getAttribute('role')).toBe('alert')
    })

    test('ZIP を作れなかったら、そのことを知らせる', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      createZipMock.mockRejectedValueOnce(new Error('zip failed'))
      hookState.groups = [createGroup()]
      result = renderWithProviders(<ImageConvertPanel />)

      fireEvent.click(result.getByRole('button', { name: 'すべてダウンロード（ZIP）: 2026/11/19 12:34' }))

      await waitFor(() =>
        expect(result.getByText('ZIP を作れませんでした。もう一度お試しください。').getAttribute('role')).toBe('alert')
      )
    })

    test('回ごとに削除できる', () => {
      hookState.groups = [createGroup()]
      result = renderWithProviders(<ImageConvertPanel />)

      fireEvent.click(result.getByRole('button', { name: 'この変換結果を削除: 2026/11/19 12:34' }))
      expect(hookState.removeGroup).toHaveBeenCalledWith('g1')
    })
  })
})
