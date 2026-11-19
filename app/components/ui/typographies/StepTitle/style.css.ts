import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getClampPx, getClampRem } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const stepTitle = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      minBlockSize: 28,
      marginBlockEnd: getClampPx(16, 20),
    },
  },
})

export const stepTitle_heading = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12,
    },
  },
})

export const stepTitle_step = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      flexShrink: 0,
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      color: cssVariables.color.font.accent.hex,
    },
  },
})

export const stepTitle_title = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      fontSize: getClampRem(19, 20),
      fontWeight: cssVariables.font.weight.bold,
      lineHeight: 1.4,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const stepTitle_action = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      flexShrink: 0,
    },
  },
})
