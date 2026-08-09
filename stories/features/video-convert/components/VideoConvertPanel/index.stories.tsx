import type { Meta, StoryObj } from '@storybook/react-vite'

import { VideoConvertPanel } from '~/features/video-convert/components/VideoConvertPanel'

const meta: Meta<typeof VideoConvertPanel> = {
  title: 'features/video-convert/VideoConvertPanel',
  component: VideoConvertPanel,
}
export default meta

type Story = StoryObj<typeof VideoConvertPanel>

export const Default: Story = {}
