import type { Meta, StoryObj } from '@storybook/react-vite'
import { createRoutesStub } from 'react-router'

import { MainVisual } from '~/components/pages/YZ10_100/MainVisual'

const meta: Meta<typeof MainVisual> = {
  title: 'components/pages/YZ10_100/MainVisual',
  component: MainVisual,
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

type Story = StoryObj<typeof MainVisual>

export const Default: Story = {
  args: {
    lang: 'ja',
    toolsId: 'tools',
  },
}

// 文言はツールバーの言語で切り替わる。リンク先だけが lang に従う。
export const English: Story = {
  args: {
    lang: 'en',
    toolsId: 'tools',
  },
}
