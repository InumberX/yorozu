import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { cleanup, fireEvent, type RenderResult, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { z } from 'zod'

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

// jsdom には DataTransfer がなく、input.files にも FileList しか入らない。
// ブラウザと同じく「DataTransfer で作った一覧を input.files に入れ、FormData がそれを読む」形を用意する。
class FakeDataTransfer {
  private list: File[] = []
  items = { add: (file: File) => this.list.push(file) }
  get files() {
    return this.list
  }
}

class FormDataWithFiles extends FormData {
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

const filesDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files')

const ValidatingHarness = () => {
  const schema = z.object({
    files: z.array(z.file().max(1, { error: '大きすぎます' })).min(1),
  })
  const [form, fields] = useForm({
    id: 'test-form',
    shouldValidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const [files, setFiles] = useState<File[]>([])

  return (
    <form {...getFormProps(form)}>
      <InputFileDrop
        inputProps={getInputProps(fields.files, { type: 'file' })}
        errors={Object.values(fields.files.allErrors).flat()}
        files={files}
        onChangeFiles={setFiles}
        accept="image/png"
      >
        <button type="button" onClick={() => setFiles([])}>
          リセット
        </button>
      </InputFileDrop>
    </form>
  )
}

describe('InputFileDrop と Conform', () => {
  let result: RenderResult

  const getInput = () => result.container.querySelector('input[type="file"]') as HTMLInputElement
  const getDropArea = () => getInput().nextElementSibling as HTMLElement

  beforeEach(() => {
    vi.stubGlobal('DataTransfer', FakeDataTransfer)
    vi.stubGlobal('FormData', FormDataWithFiles)
    Object.defineProperty(HTMLInputElement.prototype, 'files', {
      configurable: true,
      get(this: HTMLInputElement & { storedFiles?: File[] }) {
        return this.storedFiles ?? []
      },
      set(this: HTMLInputElement & { storedFiles?: File[] }, value: File[]) {
        this.storedFiles = value
      },
    })
    result = renderWithProviders(<ValidatingHarness />)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    if (filesDescriptor) {
      Object.defineProperty(HTMLInputElement.prototype, 'files', filesDescriptor)
    }
  })

  test('足したファイルを input に書き戻し、その一覧で Conform が検証し直す', async () => {
    fireEvent.drop(getDropArea(), { dataTransfer: { files: [new File([''], 'a.png', { type: 'image/png' })] } })
    await waitFor(() => expect(Array.from(getInput().files ?? []).map((file) => file.name)).toEqual(['a.png']))

    fireEvent.drop(getDropArea(), { dataTransfer: { files: [new File(['xx'], 'b.png', { type: 'image/png' })] } })
    await waitFor(() => expect(Array.from(getInput().files ?? []).map((file) => file.name)).toEqual(['a.png', 'b.png']))
    await waitFor(() => expect(result.getByText('大きすぎます')).not.toBe(null))
  })

  test('呼び出し元が一覧を空にすると、input も空にして、対応していない形式の知らせも消す', async () => {
    fireEvent.drop(getDropArea(), {
      dataTransfer: {
        files: [new File([''], 'a.png', { type: 'image/png' }), new File([''], 'memo.txt', { type: 'text/plain' })],
      },
    })
    expect(result.getByText('対応していない形式のファイルは読み込みませんでした（memo.txt）')).not.toBe(null)

    fireEvent.click(result.getByRole('button', { name: 'リセット' }))

    await waitFor(() => expect(getInput().files).toHaveLength(0))
    expect(result.queryByText(/対応していない形式/)).toBe(null)
  })

  test('値を持つ input にフォーカスが移ったら、見えているボタンへ渡す', () => {
    getInput().focus()
    expect(document.activeElement).toBe(result.getByRole('button', { name: 'ファイルを選択' }))
  })
})
