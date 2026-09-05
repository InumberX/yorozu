import type { Meta, StoryObj } from '@storybook/react-vite'

import { SvgIconButton } from '~/components/ui/buttons/SvgIconButton'
import { SVG_ICON_VARIANT } from '~/components/ui/icons/SvgIcon'

const meta: Meta<typeof SvgIconButton> = {
  title: 'components/ui/buttons/SvgIconButton',
  component: SvgIconButton,
}
export default meta

type Story = StoryObj<typeof SvgIconButton>

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
