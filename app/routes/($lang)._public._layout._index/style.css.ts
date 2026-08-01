import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontLarge, fontMaximumBold, fontMedium, fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const home = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const homeHero = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: '16px',
      paddingBlock: '24px',
    },
  },
})

export const homeHero_title = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMaximumBold,
      color: cssVariables.color.font.base.hex,
      letterSpacing: '0.04em',
    },
  },
})

export const homeHero_lead = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontLarge,
      color: cssVariables.color.font.sub.hex,
    },
  },
})

export const homeTools = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: '20px',
      marginBlockStart: '24px',
      gridTemplateColumns: '1fr',

      '@media': {
        [getMediaQuery('md')]: {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
      },
    },
  },
})

export const homeTools_item = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const homeToolCard = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: '12px',
      blockSize: '100%',
      padding: '24px',
      borderRadius: '16px',
      backgroundColor: cssVariables.color.background.light.hex,
      border: `1px solid ${cssVariables.color.border.sub.hex}`,
    },
  },
})

export const homeToolCard_title = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
      fontSize: '20px',
      color: cssVariables.color.font.base.hex,
    },
  },
})

export const homeToolCard_description = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMedium,
      color: cssVariables.color.font.sub.hex,
    },
  },
})

export const homeToolCard_action = style({
  '@layer': {
    [cssLayerComponentPage]: {
      marginBlockStart: 'auto',
    },
  },
})
