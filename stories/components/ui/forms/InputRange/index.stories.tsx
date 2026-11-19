import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'

import { InputRange } from '~/components/ui/forms/InputRange'

const schema = z.object({
  quality: z.number().int().min(1).max(100),
})

type Args = {
  label: string
  minLabel?: string
  maxLabel?: string
  helperText?: string
  isDisabled?: boolean
}

const InputRangeStory = ({ label, minLabel, maxLabel, helperText, isDisabled }: Args) => {
  const [form, fields] = useForm({
    id: 'story-input-range',
    defaultValue: { quality: '80' },
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    onSubmit: (event) => event.preventDefault(),
  })

  return (
    <form {...getFormProps(form)} style={{ maxInlineSize: 400 }}>
      <InputRange
        inputProps={getInputProps(fields.quality, { type: 'range' })}
        errors={fields.quality.errors}
        label={label}
        minLabel={minLabel}
        maxLabel={maxLabel}
        helperText={helperText}
        isDisabled={isDisabled}
      />
    </form>
  )
}

const meta: Meta<typeof InputRangeStory> = {
  title: 'components/ui/forms/InputRange',
  component: InputRangeStory,
  args: {
    label: '品質',
    minLabel: '小さく',
    maxLabel: 'きれいに',
  },
}
export default meta

type Story = StoryObj<typeof InputRangeStory>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
}
