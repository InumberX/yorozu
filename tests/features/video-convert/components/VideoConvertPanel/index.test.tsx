import { cleanup, fireEvent, type RenderResult, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

import type { ConvertResultGroup } from '~/features/file-convert/types'
import type { VideoConvertOptions } from '~/features/video-convert/types'

// Worker を作る hook は置き換える（jsdom に Worker はないため）。返す状態はテストごとに変える。
const { hookState } = vi.hoisted(() => ({
  hookState: {
    status: 'idle' as 'idle' | 'converting' | 'done',
    progress: 0,
    groups: [] as ConvertResultGroup<VideoConvertOptions>[],
    convert: vi.fn(),
    cancel: vi.fn(),
    clearDone: vi.fn(),
    removeGroup: vi.fn(),
  },
}))
vi.mock('~/features/video-convert/hooks/use-video-convert', () => ({
  useVideoConvert: () => hookState,
}))

// 見本を作る処理は置き換え、長さをテストごとに決める（jsdom は動画を読めないため）
const { thumbnailDurations } = vi.hoisted(() => ({ thumbnailDurations: new Map<string, number>() }))
vi.mock('~/features/video-convert/utils/video-thumbnail', () => ({
  loadVideoThumbnail: async (file: File) => {
    const duration = thumbnailDurations.get(file.name)
    if (duration === undefined) {
      throw new Error('cannot play')
    }
    return {
      bitmap: { width: 112, height: 112, close: () => undefined },
      meta: { width: 1920, height: 1080, duration },
    }
  },
}))

import { VideoConvertPanel } from '~/features/video-convert/components/VideoConvertPanel'

const createFile = (name: string, type = 'video/mp4') => new File(['x'], name, { type, lastModified: 1 })

const createGroup = (): ConvertResultGroup<VideoConvertOptions> => ({
  id: 'g1',
  convertedAt: new Date(2026, 10, 19, 12, 34),
  options: { codec: 'vp8', quality: 4, resolution: '720' },
  items: [
    {
      id: 'i1',
      sourceName: 'a.mp4',
      fileName: 'a.webm',
      beforeSize: 4000,
      afterSize: 1000,
      blob: new Blob(['x']),
      url: 'blob:a',
      warnings: ['AUDIO_DROPPED'],
    },
  ],
  failures: [
    { name: 'long.mov', code: 'TOO_LONG' },
    { name: 'h265.mp4', code: 'UNSUPPORTED_ENCODER' },
    { name: 'crashed.mp4', code: null },
  ],
})

describe('VideoConvertPanel', () => {
  let result: RenderResult

  const getInput = () => result.container.querySelector('input[type="file"]') as HTMLInputElement
  const pickFiles = (files: File[]) => fireEvent.change(getInput(), { target: { files } })

  beforeEach(() => {
    // jsdom に WebCodecs はないため、対応しているブラウザとして扱う
    vi.stubGlobal('VideoEncoder', class {})
    vi.stubGlobal('VideoDecoder', class {})
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
    // 見本をキャンバスに描けるようにする（jsdom のキャンバスは描けない）
    vi.stubGlobal('createImageBitmap', vi.fn())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: () => undefined,
    } as unknown as CanvasRenderingContext2D)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    thumbnailDurations.clear()
    hookState.status = 'idle'
    hookState.progress = 0
    hookState.groups = []
  })

  describe('ファイルがないとき', () => {
    test('変換するボタンが押せず、読み込むよう案内する', () => {
      result = renderWithProviders(<VideoConvertPanel />)
      expect(result.getByText('ファイルを読み込むと変換できます。')).not.toBe(null)
      expect(result.getByRole('button', { name: /変換する/ })).toBeDisabled()
    })

    test('既定は VP9・画質 標準・元のまま', () => {
      result = renderWithProviders(<VideoConvertPanel />)
      expect(result.getByRole('radio', { name: 'VP9' })).toBeChecked()
      const slider = result.getByRole('slider', { name: '画質' })
      expect(slider).toHaveValue('3')
      expect(slider.getAttribute('aria-valuetext')).toBe('標準')
      expect(result.getByRole('combobox', { name: '解像度' })).toHaveValue('original')
    })

    test('読み込める形式を input の accept に渡し、上限を出す', () => {
      result = renderWithProviders(<VideoConvertPanel />)
      expect(getInput().getAttribute('accept')).toBe('video/mp4,video/quicktime')
      expect(result.getByText('長さ 2分・200MB まで')).not.toBe(null)
    })
  })

  describe('WebCodecs に対応していないブラウザ', () => {
    test('そのことを知らせ、ファイルがあっても変換するボタンを押せなくする', () => {
      vi.unstubAllGlobals()
      result = renderWithProviders(<VideoConvertPanel />)
      pickFiles([createFile('a.mp4')])

      expect(result.getByText(/このブラウザは動画の変換（WebCodecs）に対応していません。/)).not.toBe(null)
      expect(result.getByRole('button', { name: /変換する/ })).toBeDisabled()
    })
  })

  describe('ファイルを読み込んだとき', () => {
    test('一覧に出し、件数と出力の設定を見せる', () => {
      result = renderWithProviders(<VideoConvertPanel />)
      pickFiles([createFile('a.mp4'), createFile('b.mov', 'video/quicktime')])

      expect(result.getByText('a.mp4')).not.toBe(null)
      expect(result.getByText('b.mov')).not.toBe(null)
      expect(result.getByText('2件のファイル')).not.toBe(null)
      expect(result.getByText('→ WebM · VP9 / 画質 標準 / 元のまま')).not.toBe(null)
      expect(result.getByRole('button', { name: /変換する/ })).toBeEnabled()
    })

    test('設定を変えると、出力の設定の表示も変わる', () => {
      result = renderWithProviders(<VideoConvertPanel />)
      pickFiles([createFile('a.mp4')])

      fireEvent.click(result.getByRole('radio', { name: 'VP8' }))
      // ブラウザと同じく、値を変えたら input と change の両方を送る（Conform は input で値を拾う）
      const slider = result.getByRole('slider', { name: '画質' })
      fireEvent.input(slider, { target: { value: '5' } })
      fireEvent.change(slider)
      const select = result.getByRole('combobox', { name: '解像度' })
      fireEvent.input(select, { target: { value: '720' } })
      fireEvent.change(select)

      expect(result.getByText('→ WebM · VP8 / 画質 最高画質 / 720p')).not.toBe(null)
    })

    test('変換すると、読み込んだファイルと設定で convert を呼ぶ', async () => {
      result = renderWithProviders(<VideoConvertPanel />)
      const file = createFile('a.mp4')
      pickFiles([file])

      fireEvent.change(result.getByRole('slider', { name: '画質' }), { target: { value: '2' } })
      fireEvent.change(result.getByRole('combobox', { name: '解像度' }), { target: { value: '480' } })
      fireEvent.click(result.getByRole('button', { name: /変換する/ }))

      await waitFor(() =>
        expect(hookState.convert).toHaveBeenCalledWith([file], { codec: 'vp9', quality: 2, resolution: '480' })
      )
    })

    test('見本から長さがわかったら、大きさ・長さを出す', async () => {
      thumbnailDurations.set('a.mp4', 42)
      result = renderWithProviders(<VideoConvertPanel />)
      pickFiles([createFile('a.mp4')])

      await waitFor(() => expect(result.getByText('1920×1080 · 00:42 · 1B')).not.toBe(null))
    })

    test('2 分を超えるとわかった動画はエラーにし、変換させない', async () => {
      thumbnailDurations.set('long.mp4', 130)
      result = renderWithProviders(<VideoConvertPanel />)
      pickFiles([createFile('long.mp4')])

      await waitFor(() => expect(result.getByText('長さ 2分 までです。')).not.toBe(null))
      fireEvent.click(result.getByRole('button', { name: /変換する/ }))
      await waitFor(() => expect(result.getByText('長さ 2分 までです。')).not.toBe(null))
      expect(hookState.convert).not.toHaveBeenCalled()
    })

    test('MP4・MOV 以外のファイルは読み込まない', () => {
      result = renderWithProviders(<VideoConvertPanel />)
      pickFiles([createFile('a.avi', 'video/x-msvideo')])

      expect(result.getByText('対応していない形式のファイルは読み込みませんでした（a.avi）')).not.toBe(null)
      expect(result.getByRole('button', { name: /変換する/ })).toBeDisabled()
    })
  })

  describe('変換中', () => {
    test('進み具合と中止ボタンを出し、入力を押せなくする', () => {
      hookState.status = 'converting'
      hookState.progress = 42
      result = renderWithProviders(<VideoConvertPanel />)

      expect(result.getByRole('progressbar', { name: '変換しています' }).getAttribute('value')).toBe('42')
      // 手順 3 は aria-live なので、% の文字は読み上げさせない
      expect(result.getByText('42%')).toHaveAttribute('aria-hidden', 'true')
      expect(result.getByText(/端末内で処理するため時間がかかります。/)).not.toBe(null)
      expect(result.getByRole('combobox', { name: '解像度' })).toBeDisabled()

      fireEvent.click(result.getByRole('button', { name: '中止する' }))
      expect(hookState.cancel).toHaveBeenCalled()
    })
  })

  describe('変換結果', () => {
    test('設定・保存のリンク・音声を除いたことを出す', () => {
      hookState.status = 'done'
      hookState.groups = [createGroup()]
      result = renderWithProviders(<VideoConvertPanel />)

      expect(result.getByText('WebM · VP8 / 画質 高画質 / 720p')).not.toBe(null)
      const download = result.getByRole('link', { name: 'ダウンロード: a.webm' })
      expect(download.getAttribute('download')).toBe('a.webm')
      expect(result.getByText('このブラウザでは音声を書き出せないため、映像だけにしました')).not.toBe(null)
    })

    test('変換できなかったファイルを、わかる理由とともに知らせる', () => {
      hookState.groups = [createGroup()]
      result = renderWithProviders(<VideoConvertPanel />)

      expect(
        result.getByText(
          '変換できなかったファイル: long.mov（長さ 2分 を超えています）, h265.mp4（このブラウザでは VP8 で書き出せません）, crashed.mp4'
        )
      ).not.toBe(null)
    })
  })
})
