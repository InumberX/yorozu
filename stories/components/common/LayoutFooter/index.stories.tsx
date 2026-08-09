import type { Meta, StoryObj } from '@storybook/react-vite'

import { LayoutFooter } from '~/components/common/LayoutFooter'

const meta: Meta<typeof LayoutFooter> = {
  title: 'components/common/LayoutFooter',
  component: LayoutFooter,
}
export default meta

type Story = StoryObj<typeof LayoutFooter>

export const Default: Story = {}
