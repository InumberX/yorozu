import { style } from '@vanilla-extract/css'

import { layoutHeaderHeight } from '~/components/common/LayoutHeader/style.css'
import { getLineColor, getRgba } from '~/styles/mixins/color.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
import { getClampPx, getClampRem } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクト「yorozu-cyber-net」（PC）/「yorozu-cyber-net-sp」（SP）の SEC.01 ツール一覧。
// 6 列の表は lg 未満では狭くなるため、lg 以上で表、lg 未満で 1 ツールずつのカードにする。
// 表とカードは同じ要素を grid-template-areas で並べ替えて作る。

const TABLE_COLUMNS = '56px 52px minmax(0, 1fr) 150px 130px 120px'
const TABLE_AREAS = '"number icon body category state action"'

export const toolList = style({
  '@layer': {
    [cssLayerComponentPage]: {
      paddingBlockEnd: getClampPx(40, 64),
      // 固定ヘッダーの下に見出しが隠れないよう、ヘッダーの高さに少し余白を足した位置で止める。
      scrollMarginBlockStart: getClampPx(layoutHeaderHeight.minimum + 16, layoutHeaderHeight.maximum + 24),
    },
  },
})

export const toolListHead = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'none',

      '@media': {
        [getMediaQuery('lg')]: {
          display: 'grid',
          gridTemplateColumns: TABLE_COLUMNS,
          gridTemplateAreas: TABLE_AREAS,
          gap: '16px',
          alignItems: 'center',
          paddingBlock: '10px',
          paddingInline: '24px',
          borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
          fontFamily: cssVariables.font.family.mono,
          fontSize: getFontSize(12),
          color: cssVariables.color.font.subMedium.hex,
        },
      },
    },
  },
})

export const toolListHead_number = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'number',
    },
  },
})

export const toolListHead_body = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'body',
    },
  },
})

export const toolListHead_category = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'category',
    },
  },
})

export const toolListHead_state = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'state',
    },
  },
})

export const toolListItems = style({
  '@layer': {
    [cssLayerComponentPage]: {
      listStyle: 'none',
    },
  },
})

// 次のツールの行の目印。スタイルは持たず、toolListItem などのセレクタから参照する。
export const toolListItem__request = style({})

export const toolListItem = style({
  '@layer': {
    [cssLayerComponentPage]: {
      // SP: 1 行目に番号・カテゴリ・状態、2 行目にアイコンと名前・説明、3 行目に OPEN を置く。
      display: 'grid',
      gridTemplateColumns: '36px auto minmax(0, 1fr) auto',
      gridTemplateAreas: '"number category . state" "icon body body body" ". action action action"',
      columnGap: '14px',
      alignItems: 'center',
      inlineSize: '100%',
      paddingBlock: '18px',
      paddingInline: '17px 20px',
      borderInlineStart: `3px solid ${cssVariables.color.border.primary.hex}`,
      borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
      color: cssVariables.color.font.pale.hex,

      selectors: {
        [`&${toolListItem__request}`]: {
          borderInlineStartStyle: 'dashed',
          borderInlineStartColor: getRgba(cssVariables.color.border.accent.rgb, 0.8),
          borderBlockEnd: 'none',
        },
      },

      '@media': {
        [getMediaQuery('lg')]: {
          gridTemplateColumns: TABLE_COLUMNS,
          gridTemplateAreas: TABLE_AREAS,
          gap: '16px',
          paddingBlock: '22px',
          paddingInline: '21px 24px',
        },
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              backgroundColor: getRgba(cssVariables.color.border.primary.rgb, 0.07),
            },
            [`&${toolListItem__request}:hover`]: {
              backgroundColor: getRgba(cssVariables.color.border.accent.rgb, 0.07),
            },
          },
        },
      },
    },
  },
})

// 差し色にする要素（次のツールの行では、主色の代わりにアンバーにする）
const accentOnRequest = {
  [`${toolListItem__request} &`]: {
    color: cssVariables.color.font.accent.hex,
  },
}

export const toolListItem_number = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'number',
      marginBlockEnd: '14px',
      fontFamily: cssVariables.font.family.mono,
      fontSize: getClampRem(20, 22),
      lineHeight: 1,
      color: cssVariables.color.font.primary.hex,

      selectors: accentOnRequest,

      '@media': {
        [getMediaQuery('lg')]: {
          marginBlockEnd: 0,
        },
      },
    },
  },
})

export const toolListItem_icon = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'icon',
      alignSelf: 'start',
      // カードでは 1 列目の幅（36px）にそろえ、表では 40px にする。
      inlineSize: '36px',
      color: cssVariables.color.font.primary.hex,

      selectors: accentOnRequest,

      '@media': {
        [getMediaQuery('lg')]: {
          alignSelf: 'center',
          inlineSize: '40px',
        },
      },
    },
  },
})

export const toolListItem_body = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'body',
      display: 'grid',
      gap: '4px',
    },
  },
})

export const toolListItem_name = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getClampRem(18, 19),
      fontWeight: cssVariables.font.weight.bold,
      lineHeight: 1.4,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const toolListItem_description = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getFontSize(14),
      lineHeight: 1.8,
    },
  },
})

export const toolListItem_category = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'category',
      marginBlockEnd: '14px',
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      lineHeight: 1,
      color: cssVariables.color.font.subLight.hex,

      '@media': {
        [getMediaQuery('lg')]: {
          marginBlockEnd: 0,
        },
      },
    },
  },
})

// 次のツールにはカテゴリがない。表では「—」を置き、カードでは何も置かない。
export const toolListItem_category__empty = style({
  '@layer': {
    [cssLayerComponentPage]: {
      visibility: 'hidden',
      color: cssVariables.color.font.subMedium.hex,

      '@media': {
        [getMediaQuery('lg')]: {
          visibility: 'visible',
        },
      },
    },
  },
})

export const toolListItem_chip = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'inline-block',
      paddingBlock: '3px',
      paddingInline: '8px',
      border: `1px solid ${getLineColor(0.3)}`,

      '@media': {
        [getMediaQuery('lg')]: {
          paddingBlock: '4px',
        },
      },
    },
  },
})

export const toolListItem_state = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'state',
      marginBlockEnd: '14px',
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      lineHeight: 1,
      color: cssVariables.color.font.primary.hex,
      whiteSpace: 'pre',

      selectors: accentOnRequest,

      '@media': {
        [getMediaQuery('lg')]: {
          marginBlockEnd: 0,
        },
      },
    },
  },
})

// 状態の前の記号。英数字用フォントに ●○ がなく和文フォントで大きく出るため、デザインの大きさまで小さくする。
export const toolListItem_stateMark = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getFontSize(8),
      verticalAlign: 'middle',
    },
  },
})

export const toolListItem_action = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'action',
      marginBlockStart: '12px',
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(13),
      lineHeight: 1,
      color: cssVariables.color.font.primary.hex,
      whiteSpace: 'pre',

      selectors: accentOnRequest,

      '@media': {
        [getMediaQuery('lg')]: {
          justifySelf: 'end',
          marginBlockStart: 0,
        },
      },
    },
  },
})
