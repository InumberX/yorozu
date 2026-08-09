import { cleanup, fireEvent, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

// Worker を生成する hook はテストではモックする（jsdom に Worker は無いため）。
const { convertSpy } = vi.hoisted(() => ({ convertSpy: vi.fn() }))
vi.mock('~/features/video-convert/hooks/useVideoConvert', () => ({
  useVideoConvert: () => ({
    status: 'idle',
    progress: 0,
    error: null,
    result: null,
    convert: convertSpy,
    reset: vi.fn(),
  }),
}))

import { VideoConvertPanel } from '~/features/video-convert/components/VideoConvertPanel'

describe('VideoConvertPanel', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  beforeEach(() => {
    result = renderWithProviders(<VideoConvertPanel />)
  })

  test('ドロップゾーンのラベルとコーデック（VP9 / VP8）が出力されている', () => {
    expect(result.getByText('動画ファイルをドラッグ＆ドロップ、またはクリックして選択')).not.toBe(null)
    expect(result.getByText('VP9')).not.toBe(null)
    expect(result.getByText('VP8')).not.toBe(null)
  })

  test('ファイル未選択では変換ボタンが無効', () => {
    const button = result.container.querySelector('button')
    expect(button?.disabled).toBe(true)
  })

  test('ファイルを選択すると変換ボタンが有効になり、convert が呼ばれる', () => {
    const input = result.container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['dummy'], 'sample.mp4', { type: 'video/mp4' })
    fireEvent.change(input, { target: { files: [file] } })

    const button = result.container.querySelector('button') as HTMLButtonElement
    expect(button.disabled).toBe(false)

    fireEvent.click(button)
    expect(convertSpy).toHaveBeenCalledTimes(1)
    expect(convertSpy).toHaveBeenCalledWith(expect.any(File), expect.objectContaining({ codec: 'vp9', crf: 31 }))
  })
})
