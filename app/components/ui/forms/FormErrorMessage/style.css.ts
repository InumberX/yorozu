import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontSmall } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const formErrorMessage = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontSmall,
      lineHeight: 1.8,
      color: cssVariables.color.font.error.hex,
    },
  },
})

export const formErrorMessage_items = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      marginBlockStart: 8,
      listStyle: 'none',
    },
  },
})

export const formErrorMessage_item = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'block',
    },
  },
})
