import { style } from '@vanilla-extract/css'

import { buttonReset } from '~/styles/mixins/button-reset.css'
import { getLineColor } from '~/styles/mixins/color.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontCaption, fontMedium, fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const inputSelect = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      selectors: {
        '&:has(select:disabled)': {
          opacity: cssVariables.opacity.disabled,
        },
      },
    },
  },
})

export const inputSelect_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontMediumBold,
      display: 'block',
      marginBlockEnd: 8,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const inputSelect_field = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
      display: 'block',
    },
  },
})

// 出典: yorozu アーティファクトの解像度の選択（高さ 44px 以上・罫線・背景は地の色）
export const inputSelect_select = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...buttonReset,
      ...fontMedium,
      display: 'block',
      inlineSize: '100%',
      minBlockSize: 44,
      paddingBlock: 0,
      paddingInline: '12px 36px',
      border: `1px solid ${getLineColor(0.3)}`,
      backgroundColor: cssVariables.color.background.base.hex,
      color: cssVariables.color.font.white.hex,
      appearance: 'none',
      cursor: 'pointer',
      transition: getTransition([{ property: 'border-color' }]),

      selectors: {
        '&:focus-visible': {
          outline: `2px solid ${cssVariables.color.border.accent.hex}`,
          outlineOffset: 3,
        },

        '&[aria-invalid="true"]': {
          borderColor: cssVariables.color.border.error.hex,
        },

        '&:disabled': {
          cursor: 'not-allowed',
        },
      },
    },
  },
})

export const inputSelect_arrow = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'absolute',
      insetBlockStart: '50%',
      insetInlineEnd: 14,
      color: cssVariables.color.font.primary.hex,
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
  },
})

export const inputSelect_helperText = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaption,
      marginBlockStart: 8,
      color: cssVariables.color.font.pale.hex,
    },
  },
})
