import type { Meta, StoryObj } from '@storybook/react-vite'
import { createRoutesStub } from 'react-router'

import { ToolHeading } from '~/components/ui/headings/ToolHeading'

const meta: Meta<typeof ToolHeading> = {
  title: 'components/ui/headings/ToolHeading',
  component: ToolHeading,
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
  args: {
    breadcrumbs: [{ name: 'ホーム', url: '/' }],
    breadcrumbLabel: 'パンくずリスト',
    label: 'IMAGE',
    title: '画像を変換する',
    lead: 'PNG・JPEG の画像を、WebP または AVIF に変換します。',
  },
}
export default meta

type Story = StoryObj<typeof ToolHeading>

export const Default: Story = {}
