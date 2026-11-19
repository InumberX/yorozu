import { getCollectionProps, getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'

import { InputRadioCard } from '~/components/ui/forms/InputRadioCard'

const FORMATS = ['webp', 'avif'] as const

const schema = z.object({
  format: z.enum(FORMATS, { error: '出力形式を選んでください。' }),
})

type Args = {
  legend: string
  helperText?: string
  isDisabled?: boolean
  defaultFormat?: (typeof FORMATS)[number]
}

const InputRadioCardStory = ({ legend, helperText, isDisabled, defaultFormat }: Args) => {
  const [form, fields] = useForm({
    id: 'story-input-radio-card',
    defaultValue: { format: defaultFormat },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    onSubmit: (event) => event.preventDefault(),
  })

  return (
    <form {...getFormProps(form)} style={{ maxInlineSize: 400 }}>
      <InputRadioCard
        id={fields.format.id}
        inputProps={getCollectionProps(fields.format, { type: 'radio', options: [...FORMATS] })}
        options={[
          { label: 'WebP', note: '幅広く対応' },
          { label: 'AVIF', note: '最も小さい' },
        ]}
        legend={legend}
        errors={fields.format.errors}
        helperText={helperText}
        isDisabled={isDisabled}
      />
      <button type="submit">送信して検証する</button>
    </form>
  )
}

const meta: Meta<typeof InputRadioCardStory> = {
  title: 'components/ui/forms/InputRadioCard',
  component: InputRadioCardStory,
  args: {
    legend: '出力形式',
    defaultFormat: 'webp',
  },
}
export default meta

type Story = StoryObj<typeof InputRadioCardStory>

export const Default: Story = {}

export const NoSelection: Story = {
  args: {
    defaultFormat: undefined,
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
}
