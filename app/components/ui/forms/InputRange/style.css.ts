import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontCaption, fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const inputRange = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      selectors: {
        '&:has(input:disabled)': {
          opacity: cssVariables.opacity.disabled,
        },
      },
    },
  },
})

export const inputRange_header = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBlockEnd: 8,
    },
  },
})

export const inputRange_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontMediumBold,
      letterSpacing: '0.06em',
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const inputRange_value = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(20),
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const inputRange_input = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
      inlineSize: '100%',
      blockSize: 24,
      margin: 0,
      accentColor: cssVariables.color.font.primary.hex,

      selectors: {
        '&:focus-visible': {
          outline: `2px solid ${cssVariables.color.border.accent.hex}`,
          outlineOffset: 3,
        },

        '&:disabled': {
          cursor: 'not-allowed',
        },
      },
    },
  },
})

export const inputRange_scale = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaption,
      display: 'flex',
      justifyContent: 'space-between',
      marginBlockStart: 4,
      color: cssVariables.color.font.pale.hex,
    },
  },
})

export const inputRange_helperText = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaption,
      marginBlockStart: 8,
      color: cssVariables.color.font.pale.hex,
    },
  },
})
