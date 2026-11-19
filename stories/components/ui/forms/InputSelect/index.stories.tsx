import { getFormProps, getSelectProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'

import { InputSelect } from '~/components/ui/forms/InputSelect'

const schema = z.object({
  resolution: z.enum(['original', '1080', '720', '480']),
})

type Args = {
  label: string
  helperText?: string
  isDisabled?: boolean
}

const InputSelectStory = ({ label, helperText, isDisabled }: Args) => {
  const [form, fields] = useForm({
    id: 'story-input-select',
    defaultValue: { resolution: 'original' },
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    onSubmit: (event) => event.preventDefault(),
  })

  return (
    <form {...getFormProps(form)} style={{ maxInlineSize: 400 }}>
      <InputSelect
        selectProps={getSelectProps(fields.resolution)}
        errors={fields.resolution.errors}
        label={label}
        options={[
          { value: 'original', label: '元のまま' },
          { value: '1080', label: '1920 × 1080' },
          { value: '720', label: '1280 × 720' },
          { value: '480', label: '854 × 480' },
        ]}
        helperText={helperText}
        isDisabled={isDisabled}
      />
    </form>
  )
}

const meta: Meta<typeof InputSelectStory> = {
  title: 'components/ui/forms/InputSelect',
  component: InputSelectStory,
  args: {
    label: '解像度',
    helperText: '元より大きくはしません。',
  },
}
export default meta

type Story = StoryObj<typeof InputSelectStory>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
}
