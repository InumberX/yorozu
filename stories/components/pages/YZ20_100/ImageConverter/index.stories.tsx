import type { Meta, StoryObj } from '@storybook/react-vite'

import { ImageConverter } from '~/components/pages/YZ20_100/ImageConverter'

const meta: Meta<typeof ImageConverter> = {
  title: 'components/pages/YZ20_100/ImageConverter',
  component: ImageConverter,
}
export default meta

type Story = StoryObj<typeof ImageConverter>

export const Default: Story = {}
