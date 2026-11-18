import type { Meta, StoryObj } from '@storybook/react-vite'

import { SectionTitle } from '~/components/pages/YZ10_100/SectionTitle'

const meta: Meta<typeof SectionTitle> = {
  title: 'components/pages/YZ10_100/SectionTitle',
  component: SectionTitle,
}
export default meta

type Story = StoryObj<typeof SectionTitle>

export const Default: Story = {
  args: {
    label: 'SEC.01',
    title: 'ツール一覧',
  },
}
