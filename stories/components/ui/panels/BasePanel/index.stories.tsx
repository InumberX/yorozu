import type { Meta, StoryObj } from '@storybook/react-vite'

import { BasePanel } from '~/components/ui/panels/BasePanel'

const meta: Meta<typeof BasePanel> = {
  title: 'components/ui/panels/BasePanel',
  component: BasePanel,
  decorators: [
    (Story) => {
      return (
        <div style={{ padding: 24 }}>
          <Story />
        </div>
      )
    },
  ],
}
export default meta

type Story = StoryObj<typeof BasePanel>

const children = <p style={{ padding: 24 }}>コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。</p>

export const Default: Story = {
  args: {
    children,
  },
}

export const Dense: Story = {
  args: {
    color: 'dense',
    children,
  },
}
