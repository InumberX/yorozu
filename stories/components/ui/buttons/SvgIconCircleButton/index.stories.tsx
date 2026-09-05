import type { Meta, StoryObj } from '@storybook/react-vite'

import { SvgIconCircleButton } from '~/components/ui/buttons/SvgIconCircleButton'
import { SVG_ICON_VARIANT } from '~/components/ui/icons/SvgIcon'

const meta: Meta<typeof SvgIconCircleButton> = {
  title: 'components/ui/buttons/SvgIconCircleButton',
  component: SvgIconCircleButton,
}
export default meta

type Story = StoryObj<typeof SvgIconCircleButton>

export const Default: Story = {
  args: {
    icon: {
      variant: SVG_ICON_VARIANT.ARROW_FORWARD,
    },
    title: '次へ',
    onClick: () => {},
  },
}

export const Disabled: Story = {
  args: {
    icon: {
      variant: SVG_ICON_VARIANT.ARROW_FORWARD,
    },
    title: '次へ',
    isDisabled: true,
    onClick: () => {},
  },
}

export const Link: Story = {
  args: {
    icon: {
      variant: SVG_ICON_VARIANT.ARROW_FORWARD,
    },
    title: '外部サイトへ',
    url: 'https://example.com',
    target: '_blank',
    rel: 'noopener',
  },
}
