import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontMedium } from '~/styles/variables/font.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const lead = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMedium,
      marginBlockStart: '12px',
      color: cssVariables.color.font.sub.hex,
    },
  },
})
