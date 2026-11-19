import { getCollectionProps, getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { cleanup, fireEvent, type RenderResult, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { z } from 'zod'

import { renderWithProviders } from '../../../../test-utils'

import { InputRadioCard } from '~/components/ui/forms/InputRadioCard'

const FORMATS = ['webp', 'avif'] as const

const schema = z.object({
  format: z.enum(FORMATS, { error: '選んでください' }),
})

const Harness = ({
  defaultFormat,
  isDisabled,
  onChange,
}: {
  defaultFormat?: (typeof FORMATS)[number]
  isDisabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
}) => {
  const [form, fields] = useForm({
    id: 'test-form',
    defaultValue: { format: defaultFormat },
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    onSubmit: (event) => event.preventDefault(),
  })

  return (
    <form {...getFormProps(form)}>
      <InputRadioCard
        id={fields.format.id}
        inputProps={getCollectionProps(fields.format, { type: 'radio', options: [...FORMATS] })}
        options={[
          { label: 'WebP', note: '幅広く対応' },
          { label: 'AVIF', note: '最も小さい' },
        ]}
        legend="出力形式"
        errors={fields.format.errors}
        isDisabled={isDisabled}
        onChange={onChange}
      />
      <button type="submit">送信</button>
    </form>
  )
}

describe('InputRadioCard', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('初期値あり', () => {
    const handleChange = vi.fn()

    beforeEach(() => {
      result = renderWithProviders(<Harness defaultFormat="webp" onChange={handleChange} />)
    })

    test('legend で名前の付いたグループに、選択肢が並ぶ', () => {
      const group = result.getByRole('group', { name: '出力形式' })
      expect(group.querySelectorAll('input[type="radio"]')).toHaveLength(2)
    })

    test('ラベルが名前、添え書きが説明になり、初期値が選ばれている', () => {
      expect(result.getByRole('radio', { name: 'WebP' })).toHaveAccessibleDescription('幅広く対応')
      expect(result.getByRole('radio', { name: 'WebP' })).toBeChecked()
      expect(result.getByRole('radio', { name: 'AVIF' })).not.toBeChecked()
    })

    test('選ぶと onChange に値が渡る', () => {
      fireEvent.click(result.getByRole('radio', { name: 'AVIF' }))
      expect(handleChange).toHaveBeenCalledWith(expect.anything(), 'avif')
    })
  })

  describe('初期値なし', () => {
    beforeEach(() => {
      result = renderWithProviders(<Harness />)
    })

    test('検証に失敗すると、グループにエラーが結び付く', async () => {
      fireEvent.click(result.getByRole('button', { name: '送信' }))

      const group = result.getByRole('group', { name: '出力形式' })
      await waitFor(() => expect(group).toHaveAccessibleDescription('選んでください'))
      expect(result.getByRole('radio', { name: 'WebP' }).getAttribute('aria-invalid')).toBe('true')
    })
  })

  describe('無効', () => {
    beforeEach(() => {
      result = renderWithProviders(<Harness defaultFormat="webp" isDisabled />)
    })

    test('すべての選択肢が無効になる', () => {
      expect(result.getByRole('radio', { name: 'WebP' })).toBeDisabled()
      expect(result.getByRole('radio', { name: 'AVIF' })).toBeDisabled()
    })
  })
})
