import type { Meta, StoryObj } from '@storybook/react-vite'

import { SVG_ICON_VARIANT, SvgIcon } from '~/components/ui/icons/SvgIcon'

const meta: Meta<typeof SvgIcon> = {
  title: 'components/ui/icons/SvgIcon',
  component: SvgIcon,
}
export default meta

type Story = StoryObj<typeof SvgIcon>

export const AnimatedImages: Story = {
  args: {
    variant: SVG_ICON_VARIANT.ANIMATED_IMAGES,
  },
}

export const ArrowForward: Story = {
  args: {
    variant: SVG_ICON_VARIANT.ARROW_FORWARD,
  },
}

export const Check: Story = {
  args: {
    variant: SVG_ICON_VARIANT.CHECK,
  },
}

export const Filter: Story = {
  args: {
    variant: SVG_ICON_VARIANT.FILTER,
  },
}

export const Routine: Story = {
  args: {
    variant: SVG_ICON_VARIANT.ROUTINE,
  },
}
