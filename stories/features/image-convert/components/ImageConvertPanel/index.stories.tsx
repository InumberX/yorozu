import type { Meta, StoryObj } from '@storybook/react-vite'

import { ImageConvertPanel } from '~/features/image-convert/components/ImageConvertPanel'

const meta: Meta<typeof ImageConvertPanel> = {
  title: 'features/image-convert/ImageConvertPanel',
  component: ImageConvertPanel,
}
export default meta

type Story = StoryObj<typeof ImageConvertPanel>

export const Default: Story = {}
