import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontLabel, fontLabelLarge } from '~/styles/variables/font.css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

// ヘッダーの高さ（px）。LayoutPageWrapper が本文の上下余白計算に参照する。
export const layoutHeaderHeight = {
  minimum: 56,
  maximum: 64,
}

export const layoutHeader = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      position: 'sticky',
      insetBlockStart: 0,
      zIndex: Number(cssVariables.zIndex.header.wrapper),
      backgroundColor: cssVariables.color.background.darkest.hex,
      borderBlockEnd: `1px solid ${cssVariables.color.line.level2}`,
    },
  },
})

export const layoutHeader_container = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      inlineSize: '100%',
      maxInlineSize: cssVariables.layout.inner.width.large,
      marginInline: 'auto',
      paddingBlock: '12px',
      paddingInline: cssVariables.layout.inner.padding.xs,

      '@media': {
        [getMediaQuery('md')]: {
          paddingInline: cssVariables.layout.inner.padding.md,
        },
      },
    },
  },
})

export const layoutHeaderBrand = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      ...fontLabelLarge,
      fontSize: '20px',
      color: cssVariables.color.font.heading.hex,
      textShadow: cssVariables.shadow.text,
    },
  },
})

export const layoutHeaderNav = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      marginInlineStart: 'auto',
    },
  },
})

export const layoutHeaderNav_items = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
  },
})

export const layoutHeaderNav_item = style({
  '@layer': {
    [cssLayerComponentCommon]: {},
  },
})

export const layoutHeaderNavLink = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      ...fontLabel,
      color: cssVariables.color.font.sub.hex,

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const layoutHeaderLang = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
  },
})

export const layoutHeaderLang_link = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      ...fontLabel,
      color: cssVariables.color.font.subDark.hex,

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const layoutHeaderLang_link__current = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      color: cssVariables.color.font.primary.hex,
      textShadow: cssVariables.shadow.text,
    },
  },
})

export const layoutHeaderLang_separator = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      ...fontLabel,
      color: cssVariables.color.font.dim.hex,
    },
  },
})
