import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { cleanup, fireEvent, type RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { z } from 'zod'

import { renderWithProviders } from '../../../../test-utils'

import { InputRange } from '~/components/ui/forms/InputRange'

const schema = z.object({
  quality: z.number().int().min(1).max(100),
})

const Harness = ({
  defaultQuality,
  isDisabled,
  onChange,
}: {
  defaultQuality?: string
  isDisabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: number) => void
}) => {
  const [form, fields] = useForm({
    id: 'test-form',
    defaultValue: { quality: defaultQuality },
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <form {...getFormProps(form)}>
      <InputRange
        inputProps={getInputProps(fields.quality, { type: 'range' })}
        errors={fields.quality.errors}
        label="品質"
        minLabel="小さく"
        maxLabel="きれいに"
        isDisabled={isDisabled}
        onChange={onChange}
      />
    </form>
  )
}

describe('InputRange', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('初期値あり', () => {
    const handleChange = vi.fn()

    beforeEach(() => {
      result = renderWithProviders(<Harness defaultQuality="80" onChange={handleChange} />)
    })

    test('スキーマの範囲と初期値が入っている', () => {
      const slider = result.getByRole('slider', { name: '品質' })
      expect(slider.getAttribute('min')).toBe('1')
      expect(slider.getAttribute('max')).toBe('100')
      expect((slider as HTMLInputElement).value).toBe('80')
    })

    test('選んでいる値を表示する', () => {
      expect(result.container.querySelector('output')?.textContent).toBe('80')
    })

    test('動かすと表示と onChange が変わる', () => {
      fireEvent.change(result.getByRole('slider', { name: '品質' }), { target: { value: '42' } })
      expect(result.container.querySelector('output')?.textContent).toBe('42')
      expect(handleChange).toHaveBeenCalledWith(expect.anything(), 42)
    })

    test('両端の言葉を出す', () => {
      expect(result.getByText('小さく')).not.toBe(null)
      expect(result.getByText('きれいに')).not.toBe(null)
    })
  })

  describe('初期値なし', () => {
    beforeEach(() => {
      result = renderWithProviders(<Harness />)
    })

    test('ブラウザの既定と同じく、範囲の中間を表示する', () => {
      expect(result.container.querySelector('output')?.textContent).toBe('50.5')
    })
  })

  describe('無効', () => {
    beforeEach(() => {
      result = renderWithProviders(<Harness defaultQuality="80" isDisabled />)
    })

    test('スライダーが無効になる', () => {
      expect(result.getByRole('slider', { name: '品質' })).toBeDisabled()
    })
  })
})
