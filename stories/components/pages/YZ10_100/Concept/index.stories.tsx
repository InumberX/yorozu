import type { Meta, StoryObj } from '@storybook/react-vite'
import { createRoutesStub } from 'react-router'

import { Concept } from '~/components/pages/YZ10_100/Concept'

const meta: Meta<typeof Concept> = {
  title: 'components/pages/YZ10_100/Concept',
  component: Concept,
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

type Story = StoryObj<typeof Concept>

export const Default: Story = {
  args: {},
}
