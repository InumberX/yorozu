import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontHeading2, fontLarge, fontMaximumBold, fontMedium } from '~/styles/variables/font.css'
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
      color: cssVariables.color.font.heading.hex,
      lineHeight: 1.2,
      textShadow: cssVariables.shadow.text,
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
      borderRadius: '4px',
      backgroundColor: cssVariables.color.surface.level2,
      border: `1px solid ${cssVariables.color.line.level2}`,
      transition: getTransition([
        {
          property: 'border-color',
        },
        {
          property: 'box-shadow',
        },
        {
          property: 'background-color',
        },
      ]),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              backgroundColor: cssVariables.color.surface.level4,
              borderColor: cssVariables.color.line.level4,
              boxShadow: cssVariables.shadow.glow,
            },
          },
        },
      },
    },
  },
})

export const homeToolCard_title = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontHeading2,
      color: cssVariables.color.font.heading.hex,
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
