import type { Meta, StoryObj } from '@storybook/react-vite'

import { StepTitle } from '~/components/ui/typographies/StepTitle'

const meta: Meta<typeof StepTitle> = {
  title: 'components/ui/typographies/StepTitle',
  component: StepTitle,
  args: {
    step: 1,
    title: '読み込む',
  },
}
export default meta

type Story = StoryObj<typeof StepTitle>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    action: <button type="button">リセット</button>,
  },
}
