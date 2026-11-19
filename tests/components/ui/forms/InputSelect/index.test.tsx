import { getFormProps, getSelectProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { cleanup, fireEvent, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { z } from 'zod'

import { renderWithProviders } from '../../../../test-utils'

import { InputSelect } from '~/components/ui/forms/InputSelect'

const schema = z.object({
  resolution: z.enum(['original', '720']),
})

const OPTIONS = [
  { value: 'original', label: '元のまま' },
  { value: '720', label: '1280 × 720' },
]

const Harness = ({
  helperText,
  isDisabled,
  onChange,
}: {
  helperText?: string
  isDisabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}) => {
  const [form, fields] = useForm({
    id: 'test-form',
    defaultValue: { resolution: 'original' },
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <form {...getFormProps(form)}>
      <InputSelect
        selectProps={getSelectProps(fields.resolution)}
        errors={fields.resolution.errors}
        label="解像度"
        options={OPTIONS}
        helperText={helperText}
        isDisabled={isDisabled}
        onChange={onChange}
      />
    </form>
  )
}

describe('InputSelect', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('ふつうのとき', () => {
    const handleChange = vi.fn()

    beforeEach(() => {
      result = renderWithProviders(<Harness helperText="元より大きくはしません。" onChange={handleChange} />)
    })

    test('見出しで選択肢を探せて、初期値が選ばれている', () => {
      const select = result.getByRole('combobox', { name: '解像度' })
      expect(select).toHaveValue('original')
      expect(result.getAllByRole('option').map((option) => option.textContent)).toEqual(['元のまま', '1280 × 720'])
    })

    test('補足の文を説明として結びつける', () => {
      const select = result.getByRole('combobox', { name: '解像度' })
      expect(select).toHaveAccessibleDescription('元より大きくはしません。')
    })

    test('選び直すと onChange を呼ぶ', () => {
      fireEvent.change(result.getByRole('combobox', { name: '解像度' }), { target: { value: '720' } })
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  test('isDisabled のときは選べない', () => {
    result = renderWithProviders(<Harness isDisabled />)
    expect(result.getByRole('combobox', { name: '解像度' })).toBeDisabled()
  })
})
