import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const svgIconCircleButton__disabled = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const svgIconCircleButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      alignItems: 'center',
      aspectRatio: '1 / 1',
      blockSize: 'auto',
      borderBlock: 'none',
      borderInline: 'none',
      borderRadius: 'calc(infinity * 1px)',
      display: 'inline-flex',
      inlineSize: 'auto',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      textAlign: 'start',
    },
  },
})

export const svgIconCircleButton_icon = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})
