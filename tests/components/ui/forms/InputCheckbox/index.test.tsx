import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { cleanup, fireEvent, type RenderResult, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { z } from 'zod'

import { renderWithProviders } from '../../../../test-utils'

import { InputCheckbox } from '~/components/ui/forms/InputCheckbox'

const schema = z.object({
  agree: z.boolean({ error: 'チェックしてください' }),
})

const Harness = ({
  helperText,
  isDisabled,
  onChange,
}: {
  helperText?: string
  isDisabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => void
}) => {
  const [form, fields] = useForm({
    id: 'test-form',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    onSubmit: (event) => event.preventDefault(),
  })

  return (
    <form {...getFormProps(form)}>
      <InputCheckbox
        inputProps={getInputProps(fields.agree, { type: 'checkbox' })}
        errors={fields.agree.errors}
        label="同意する"
        helperText={helperText}
        isDisabled={isDisabled}
        onChange={onChange}
      />
      <button type="submit">送信</button>
    </form>
  )
}

describe('InputCheckbox', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('通常', () => {
    const handleChange = vi.fn()

    beforeEach(() => {
      result = renderWithProviders(<Harness helperText="説明" onChange={handleChange} />)
    })

    test('ラベルで名前の付いたチェックボックスが出力されている', () => {
      const checkbox = result.getByRole('checkbox', { name: '同意する' })
      expect(checkbox.getAttribute('name')).toBe('agree')
    })

    test('説明が aria-describedby で結び付いている', () => {
      const checkbox = result.getByRole('checkbox', { name: '同意する' })
      expect(checkbox).toHaveAccessibleDescription('説明')
    })

    test('チェックすると onChange に状態が渡る', () => {
      fireEvent.click(result.getByRole('checkbox', { name: '同意する' }))
      expect(handleChange).toHaveBeenCalledWith(expect.anything(), true)
    })

    test('検証に失敗すると、エラーが出て入力に結び付く', async () => {
      fireEvent.click(result.getByRole('button', { name: '送信' }))

      const checkbox = result.getByRole('checkbox', { name: '同意する' })
      await waitFor(() => expect(checkbox.getAttribute('aria-invalid')).toBe('true'))
      expect(checkbox).toHaveAccessibleDescription('チェックしてください 説明')
    })
  })

  describe('無効', () => {
    beforeEach(() => {
      result = renderWithProviders(<Harness isDisabled />)
    })

    test('チェックボックスが無効になっている', () => {
      expect(result.getByRole('checkbox', { name: '同意する' })).toBeDisabled()
    })
  })
})
