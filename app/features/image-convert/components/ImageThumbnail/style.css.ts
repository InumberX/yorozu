import { style } from '@vanilla-extract/css'

import { getLineColor, getRgba } from '~/styles/mixins/color.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const imageThumbnail = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      border: `1px solid ${getLineColor(0.3)}`,
      backgroundColor: getRgba(cssVariables.color.background.primary.rgb, 0.06),
      color: cssVariables.color.font.primary.hex,
    },
  },
})

export const imageThumbnail__medium = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      inlineSize: 56,
      blockSize: 56,
    },
  },
})

export const imageThumbnail__small = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      inlineSize: 44,
      blockSize: 44,
    },
  },
})

export const imageThumbnail_icon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      inlineSize: '64%',
      blockSize: '64%',
    },
  },
})

export const imageThumbnail_image = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'absolute',
      inset: 0,
      inlineSize: '100%',
      blockSize: '100%',
      objectFit: 'cover',
      opacity: 0,
    },
  },
})

export const imageThumbnail_image__loaded = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      opacity: 1,
    },
  },
})
