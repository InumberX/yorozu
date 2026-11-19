import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { cleanup, fireEvent, type RenderResult } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { renderWithProviders } from '../../../../test-utils'

import { InputFileDrop } from '~/components/ui/forms/InputFileDrop'

const createFile = (name: string, type: string) => new File(['x'], name, { type, lastModified: 1 })

const Harness = ({ isDisabled, onChangeFiles }: { isDisabled?: boolean; onChangeFiles?: (files: File[]) => void }) => {
  const [form, fields] = useForm({ id: 'test-form' })
  const [files, setFiles] = useState<File[]>([])

  return (
    <form {...getFormProps(form)}>
      <InputFileDrop
        inputProps={getInputProps(fields.files, { type: 'file' })}
        files={files}
        onChangeFiles={(next) => {
          setFiles(next)
          onChangeFiles?.(next)
        }}
        accept="image/png,image/jpeg"
        helperText="PNG / JPEG"
        isDisabled={isDisabled}
      >
        <ul>
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </InputFileDrop>
    </form>
  )
}

describe('InputFileDrop', () => {
  let result: RenderResult
  const handleChangeFiles = vi.fn()

  const getInput = () => result.container.querySelector('input[type="file"]') as HTMLInputElement
  const getDropArea = () => getInput().nextElementSibling as HTMLElement

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('通常', () => {
    beforeEach(() => {
      result = renderWithProviders(<Harness onChangeFiles={handleChangeFiles} />)
    })

    test('ファイルがないときは、ドロップの案内と選択ボタンを出す', () => {
      expect(result.getByText('ここにファイルをドロップ')).not.toBe(null)
      expect(result.getByRole('button', { name: 'ファイルを選択' })).toHaveAccessibleDescription('PNG / JPEG')
      expect(result.queryByRole('button', { name: 'ファイルを追加する' })).toBe(null)
    })

    test('フォームの値を持つ input に、名前・形式・複数選択が付いている', () => {
      const input = getInput()
      expect(input.getAttribute('name')).toBe('files')
      expect(input.getAttribute('accept')).toBe('image/png,image/jpeg')
      expect(input.multiple).toBe(true)
    })

    test('ダイアログで選んだファイルを一覧に足し、一覧と追加ボタンに切り替わる', () => {
      fireEvent.change(getInput(), { target: { files: [createFile('a.png', 'image/png')] } })

      expect(handleChangeFiles).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'a.png' })])
      expect(result.getByText('a.png')).not.toBe(null)
      expect(result.getByRole('button', { name: 'ファイルを追加する' })).not.toBe(null)
    })

    test('ドロップしたファイルを、今の一覧の後ろに足す', () => {
      fireEvent.change(getInput(), { target: { files: [createFile('a.png', 'image/png')] } })
      fireEvent.drop(getDropArea(), { dataTransfer: { files: [createFile('b.jpg', 'image/jpeg')] } })

      expect(handleChangeFiles).toHaveBeenLastCalledWith([
        expect.objectContaining({ name: 'a.png' }),
        expect.objectContaining({ name: 'b.jpg' }),
      ])
    })

    test('同じファイルは二重に足さない', () => {
      fireEvent.change(getInput(), { target: { files: [createFile('a.png', 'image/png')] } })
      fireEvent.drop(getDropArea(), { dataTransfer: { files: [createFile('a.png', 'image/png')] } })

      expect(handleChangeFiles).toHaveBeenCalledTimes(1)
    })

    test('対応していない形式のファイルは足さず、ファイル名を添えて知らせる', () => {
      fireEvent.drop(getDropArea(), {
        dataTransfer: { files: [createFile('memo.txt', 'text/plain'), createFile('a.png', 'image/png')] },
      })

      expect(handleChangeFiles).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'a.png' })])
      expect(result.getByText('対応していない形式のファイルは読み込みませんでした（memo.txt）')).not.toBe(null)
      expect(getInput().getAttribute('aria-invalid')).toBe('true')
    })
  })

  describe('無効', () => {
    beforeEach(() => {
      result = renderWithProviders(<Harness isDisabled onChangeFiles={handleChangeFiles} />)
    })

    test('選択ボタンが無効になり、ドロップしても足さない', () => {
      expect(result.getByRole('button', { name: 'ファイルを選択' })).toBeDisabled()

      fireEvent.drop(getDropArea(), { dataTransfer: { files: [createFile('a.png', 'image/png')] } })
      expect(handleChangeFiles).not.toHaveBeenCalled()
    })
  })
})
