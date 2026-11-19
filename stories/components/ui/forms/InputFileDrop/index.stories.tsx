import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { z } from 'zod'

import { InputFileDrop } from '~/components/ui/forms/InputFileDrop'

const MAX_FILE_SIZE = 50 * 1024 * 1024

const schema = z.object({
  files: z.array(z.file().mime(['image/png', 'image/jpeg']).max(MAX_FILE_SIZE)).min(1),
})

type Args = {
  helperText?: string
  isDisabled?: boolean
}

const InputFileDropStory = ({ helperText, isDisabled }: Args) => {
  const [files, setFiles] = useState<File[]>([])
  const [form, fields] = useForm({
    id: 'story-input-file-drop',
    shouldValidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    onSubmit: (event) => event.preventDefault(),
  })

  return (
    <form {...getFormProps(form)} style={{ maxInlineSize: 400 }}>
      <InputFileDrop
        inputProps={getInputProps(fields.files, { type: 'file' })}
        errors={Object.values(fields.files.allErrors).flat()}
        files={files}
        onChangeFiles={setFiles}
        accept="image/png,image/jpeg"
        helperText={helperText}
        isDisabled={isDisabled}
      >
        <ul style={{ marginBlockEnd: 10 }}>
          {files.map((file) => (
            <li key={`${file.name}-${file.lastModified}`}>
              {file.name}{' '}
              <button type="button" onClick={() => setFiles(files.filter((item) => item !== file))}>
                削除
              </button>
            </li>
          ))}
        </ul>
      </InputFileDrop>
      <button type="submit">送信して検証する</button>
    </form>
  )
}

const meta: Meta<typeof InputFileDropStory> = {
  title: 'components/ui/forms/InputFileDrop',
  component: InputFileDropStory,
  args: {
    helperText: 'PNG / JPEG ・ 1ファイル 50MB まで',
  },
}
export default meta

type Story = StoryObj<typeof InputFileDropStory>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
}
