import { style } from '@vanilla-extract/css'

import { getLineColor } from '~/styles/mixins/color.css'
import { getCornerMark } from '~/styles/mixins/corner-mark.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
import { getClampPx, getClampRem } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクト「yorozu-cyber-net」（PC）/「yorozu-cyber-net-sp」（SP）の SEC.02 コンセプト。
// md 以上で 3 列、md 未満で縦に積む。

export const conceptItems = style({
  '@layer': {
    [cssLayerComponentPage]: {
      listStyle: 'none',

      '@media': {
        [getMediaQuery('md')]: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        },
      },
    },
  },
})

export const conceptItem = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
      paddingBlock: `${getClampPx(20, 28)} ${getClampPx(22, 30)}`,
      paddingInline: getClampPx(20, 28),

      selectors: {
        '&:not(:last-child)': {
          borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
        },
      },

      '@media': {
        [getMediaQuery('md')]: {
          selectors: {
            '&:not(:last-child)': {
              borderBlockEnd: 'none',
              borderInlineEnd: `1px solid ${getLineColor(0.3)}`,
            },
            // 2 列目以降は、区切り線と見出し帯の線が交わる角に「＋」を置く。
            '&:not(:first-child)::before': getCornerMark({ shape: 'cross', corners: ['topLeft'] }),
          },
        },
      },
    },
  },
})

export const conceptItem_title = style({
  '@layer': {
    [cssLayerComponentPage]: {
      marginBlockEnd: getClampPx(8, 10),
      fontSize: getClampRem(17, 18),
      fontWeight: cssVariables.font.weight.bold,
      lineHeight: 1.5,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const conceptItem_text = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getFontSize(14),
      lineHeight: 1.9,
      color: cssVariables.color.font.pale.hex,

      '@media': {
        [getMediaQuery('lg')]: {
          lineHeight: 1.95,
        },
      },
    },
  },
})

export const conceptItem_link = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'inline',
      font: 'inherit',
      color: cssVariables.color.font.primary.hex,
      textDecoration: 'underline',
      textUnderlineOffset: '3px',

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.primaryLight.hex,
            },
          },
        },
      },
    },
  },
})
