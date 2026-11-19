import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'

import { InputCheckbox } from '~/components/ui/forms/InputCheckbox'

const schema = z.object({
  lossless: z.boolean({ error: 'チェックしてください。' }),
})

type Args = {
  label: string
  helperText?: string
  isDisabled?: boolean
  defaultChecked?: boolean
}

const InputCheckboxStory = ({ label, helperText, isDisabled, defaultChecked }: Args) => {
  const [form, fields] = useForm({
    id: 'story-input-checkbox',
    defaultValue: { lossless: defaultChecked ? 'on' : undefined },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    onSubmit: (event) => event.preventDefault(),
  })

  return (
    <form {...getFormProps(form)}>
      <InputCheckbox
        inputProps={getInputProps(fields.lossless, { type: 'checkbox' })}
        errors={fields.lossless.errors}
        label={label}
        helperText={helperText}
        isDisabled={isDisabled}
      />
      <button type="submit">送信して検証する</button>
    </form>
  )
}

const meta: Meta<typeof InputCheckboxStory> = {
  title: 'components/ui/forms/InputCheckbox',
  component: InputCheckboxStory,
  args: {
    label: 'ロスレスで書き出す',
  },
}
export default meta

type Story = StoryObj<typeof InputCheckboxStory>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const WithHelperText: Story = {
  args: {
    helperText: '画質を落とさずに書き出します。ファイルは大きくなります。',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
}
