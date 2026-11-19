import type { Meta, StoryObj } from '@storybook/react-vite'
import { createRoutesStub } from 'react-router'

import { ToolList } from '~/components/pages/YZ10_100/ToolList'

const meta: Meta<typeof ToolList> = {
  title: 'components/pages/YZ10_100/ToolList',
  component: ToolList,
  decorators: [
    (Story) => {
      const RemixStub = createRoutesStub([
        {
          path: '/*',
          Component() {
            return <Story />
          },
        },
      ])

      return <RemixStub />
    },
  ],
}
export default meta

type Story = StoryObj<typeof ToolList>

export const Default: Story = {
  args: {
    lang: 'ja',
    id: 'tools',
  },
}

// 文言はツールバーの言語で切り替わる。リンク先だけが lang に従う。
export const English: Story = {
  args: {
    lang: 'en',
    id: 'tools',
  },
}
