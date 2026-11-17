import { style } from '@vanilla-extract/css'

import { getLineColor, getRgba } from '~/styles/mixins/color.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクト「yorozu-cyber-net」（PC）/「yorozu-cyber-net-sp」（SP）のフッター。
// ヘッダーにそろえ、sm 未満を SP（ナビ 2 列）、sm 以上を PC（ロゴとナビ 3 列）として扱う。

export const layoutFooter = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      // LayoutWrapper（縦の flex）の末尾へ押し下げる。
      marginBlockStart: 'auto',
      backgroundColor: getRgba(cssVariables.color.background.base.rgb, 0.92),
      borderBlockStart: `1px solid ${getLineColor(0.3)}`,
    },
  },
})

export const layoutFooter_container = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'grid',
      gridTemplateAreas: '"brand brand" "tools links"',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      columnGap: '24px',
      rowGap: '28px',
      paddingBlock: '32px 28px',

      '@media': {
        [getMediaQuery('sm')]: {
          gridTemplateAreas: '"brand tools links"',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr)',
          paddingBlock: '40px',
        },
        [getMediaQuery('md')]: {
          columnGap: '40px',
        },
      },
    },
  },
})

export const layoutFooterBrand = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      gridArea: 'brand',
      display: 'grid',
      justifyItems: 'start',
      gap: '14px',

      '@media': {
        [getMediaQuery('sm')]: {
          alignContent: 'start',
          gap: '16px',
        },
      },
    },
  },
})

export const layoutFooterBrand_logo = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'block',
      blockSize: getClampPx(22, 24),
      inlineSize: 'auto',
    },
  },
})

export const layoutFooterBrand_tagline = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      lineHeight: 1.8,
      color: cssVariables.color.font.subMedium.hex,

      '@media': {
        [getMediaQuery('sm')]: {
          lineHeight: 2,
        },
      },
    },
  },
})

export const layoutFooterNav = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '4px',

      '@media': {
        [getMediaQuery('sm')]: {
          gap: '10px',
        },
      },
    },
  },
})

export const layoutFooterNav__tools = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      gridArea: 'tools',
    },
  },
})

export const layoutFooterNav__links = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      gridArea: 'links',
    },
  },
})

export const layoutFooterNav_title = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      fontSize: getFontSize(12),
      fontWeight: cssVariables.font.weight.bold,
      color: cssVariables.color.font.primary.hex,
    },
  },
})

export const layoutFooterNav_items = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',

      '@media': {
        [getMediaQuery('sm')]: {
          gap: '10px',
        },
      },
    },
  },
})

export const layoutFooterNav_link = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      alignItems: 'center',
      // SP はタップしやすいよう、1 項目の高さを 40px 確保する。
      minBlockSize: '40px',
      fontSize: getFontSize(14),
      color: cssVariables.color.font.pale.hex,
      transition: getTransition([{ property: 'color' }]),

      selectors: {
        // LINKS は英字の名前だけを並べるため、英数字用のフォントにする。
        [`${layoutFooterNav__links} &`]: {
          fontFamily: cssVariables.font.family.mono,
          fontSize: getFontSize(13),
        },
      },

      '@media': {
        [getMediaQuery('sm')]: {
          minBlockSize: 'auto',
          fontSize: getFontSize(13),
        },
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

export const layoutFooterCopy = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      borderBlockStart: `1px solid ${getLineColor(0.16)}`,
      paddingBlock: '14px',
    },
  },
})

export const layoutFooterCopy_text = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      color: cssVariables.color.font.subMedium.hex,
    },
  },
})
