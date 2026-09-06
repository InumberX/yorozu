import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontLabel, fontSmall } from '~/styles/variables/font.css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

export const layoutFooter = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      backgroundColor: cssVariables.color.background.darkest.hex,
      borderBlockStart: `1px solid ${cssVariables.color.line.level1}`,
      color: cssVariables.color.font.sub.hex,
    },
  },
})

export const layoutFooter_container = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'grid',
      gap: '4px',
      inlineSize: '100%',
      maxInlineSize: cssVariables.layout.inner.width.large,
      marginInline: 'auto',
      paddingBlock: '32px',
      paddingInline: cssVariables.layout.inner.padding.xs,
    },
  },
})

export const layoutFooter_note = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      ...fontSmall,
      color: cssVariables.color.font.sub.hex,
    },
  },
})

export const layoutFooter_copyright = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      ...fontLabel,
      color: cssVariables.color.font.subDark.hex,
    },
  },
})
