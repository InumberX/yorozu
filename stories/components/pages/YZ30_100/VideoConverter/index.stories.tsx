import type { Meta, StoryObj } from '@storybook/react-vite'

import { VideoConverter } from '~/components/pages/YZ30_100/VideoConverter'

const meta: Meta<typeof VideoConverter> = {
  title: 'components/pages/YZ30_100/VideoConverter',
  component: VideoConverter,
}
export default meta

type Story = StoryObj<typeof VideoConverter>

export const Default: Story = {}
