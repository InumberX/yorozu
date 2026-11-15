import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { BREAKPOINTS } from '~/styles/variables/breakpoints.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクト「yorozu-cyber-net」（PC）/「yorozu-cyber-net-sp」（SP）のヘッダー。
// md 未満を SP（ハンバーガーメニュー）、md 以上を PC（横並びナビ）として扱う。

// ヘッダーの高さ（px）。SP=56 / PC=60。LayoutPageWrapper が本文の上下余白計算に参照する。
export const layoutHeaderHeight = {
  minimum: 56,
  maximum: 60,
}

// 主色（発光グリーン）の透明度違い。罫線・ホバー時の下線に使う。
const getLineColor = (alpha: number) => {
  return `rgba(${cssVariables.color.border.primary.rgb}, ${alpha})`
}

const colorTransition = getTransition([{ property: 'color' }, { property: 'border-color' }])

export const layoutHeader = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      position: 'sticky',
      insetBlockStart: 0,
      zIndex: Number(cssVariables.zIndex.header.wrapper),
      backgroundColor: `rgba(${cssVariables.color.background.base.rgb}, 0.92)`,
      backdropFilter: 'blur(8px)',
      borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
    },
  },
})

export const layoutHeader_container = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'grid',
      gridTemplateAreas: '"brand lang menu" "nav nav nav"',
      gridTemplateColumns: '1fr auto auto',
      gridTemplateRows: `${layoutHeaderHeight.minimum}px auto`,
      alignItems: 'center',
      columnGap: '4px',
      inlineSize: '100%',

      '@media': {
        [getMediaQuery('md')]: {
          gridTemplateAreas: '"brand nav lang"',
          gridTemplateRows: `${layoutHeaderHeight.maximum}px`,
          columnGap: '28px',
          paddingInline: '22px',
        },
      },
    },
  },
})

export const layoutHeaderBrand = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      gridArea: 'brand',
      justifySelf: 'start',
      display: 'flex',
      alignItems: 'center',
      blockSize: '44px',
      marginInlineStart: '16px',

      '@media': {
        [getMediaQuery('md')]: {
          marginInlineStart: 0,
        },
      },
    },
  },
})

export const layoutHeaderBrand_logo = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'block',
      blockSize: '20px',
      inlineSize: 'auto',

      '@media': {
        [getMediaQuery('md')]: {
          blockSize: '24px',
        },
      },
    },
  },
})

// SP: バーの下に全幅で開くメニュー / PC: バー内の横並びナビ
export const layoutHeaderNav = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      gridArea: 'nav',
      display: 'none',
      backgroundColor: cssVariables.color.background.base.hex,
      borderBlockStart: `1px solid ${getLineColor(0.3)}`,

      '@media': {
        // JS が動かない環境ではメニューを開けないため、常に展開しておく。
        [getMediaQuery('not-scripting')]: {
          display: 'block',
        },
        [getMediaQuery('md')]: {
          display: 'block',
          alignSelf: 'stretch',
          backgroundColor: 'transparent',
          borderBlockStart: 'none',
        },
      },
    },
  },
})

export const layoutHeaderNav__open = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'block',
    },
  },
})

export const layoutHeaderNav_items = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      flexDirection: 'column',

      '@media': {
        [getMediaQuery('md')]: {
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: '28px',
          blockSize: '100%',
        },
      },
    },
  },
})

export const layoutHeaderNav_item = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      borderBlockEnd: `1px solid ${getLineColor(0.16)}`,

      selectors: {
        '&:last-child': {
          borderBlockEnd: 'none',
        },
      },

      '@media': {
        [getMediaQuery('md')]: {
          display: 'flex',
          borderBlockEnd: 'none',
        },
      },
    },
  },
})

export const layoutHeaderNavLink = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      blockSize: '52px',
      paddingInline: '16px',
      fontSize: getFontSize(15),
      fontWeight: cssVariables.font.weight.medium,
      letterSpacing: '0.06em',
      color: cssVariables.color.font.pale.hex,
      transition: colorTransition,

      selectors: {
        '&[aria-current="page"]': {
          color: cssVariables.color.font.white.hex,
          fontWeight: cssVariables.font.weight.bold,
        },
      },

      '@media': {
        [getMediaQuery('md')]: {
          blockSize: 'auto',
          paddingInline: 0,
          paddingBlock: '2px 0',
          fontSize: getFontSize(13),
          letterSpacing: '0.08em',
          color: cssVariables.color.font.subLight.hex,
          borderBlockEnd: '2px solid transparent',

          selectors: {
            '&[aria-current="page"]': {
              color: cssVariables.color.font.white.hex,
              fontWeight: cssVariables.font.weight.medium,
              borderBlockEndColor: cssVariables.color.border.primary.hex,
            },
          },
        },
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.white.hex,
            },
          },
        },
        // PC のみ、ホバーで下線を薄く出す（SP の項目には下線を出さない）。
        [`screen and (width >= ${BREAKPOINTS.md}px) and (any-hover: hover)`]: {
          selectors: {
            '&:not([aria-current="page"]):hover': {
              borderBlockEndColor: getLineColor(0.5),
            },
          },
        },
      },
    },
  },
})

export const layoutHeaderNavLink_marker = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      inlineSize: '6px',
      blockSize: '6px',
      backgroundColor: cssVariables.color.background.primary.hex,

      '@media': {
        [getMediaQuery('md')]: {
          display: 'none',
        },
      },
    },
  },
})

export const layoutHeaderLang = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      gridArea: 'lang',
      display: 'flex',
      alignItems: 'center',
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      letterSpacing: '0.16em',

      '@media': {
        [getMediaQuery('md')]: {
          gap: '8px',
          paddingInlineStart: '24px',
          borderInlineStart: `1px solid ${getLineColor(0.3)}`,
        },
      },
    },
  },
})

export const layoutHeaderLang_item = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      alignItems: 'center',

      '@media': {
        [getMediaQuery('md')]: {
          gap: '8px',
        },
      },
    },
  },
})

export const layoutHeaderLang_link = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      alignItems: 'center',
      blockSize: '44px',
      paddingInline: '8px',
      color: cssVariables.color.font.subLight.hex,
      transition: colorTransition,

      selectors: {
        '&[aria-current="true"]': {
          color: cssVariables.color.font.white.hex,
        },
      },

      '@media': {
        [getMediaQuery('md')]: {
          blockSize: 'auto',
          paddingInline: 0,
        },
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

export const layoutHeaderLang_label = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      paddingBlock: '4px 2px',
      borderBlockEnd: '2px solid transparent',

      selectors: {
        [`${layoutHeaderLang_link}[aria-current="true"] &`]: {
          borderBlockEndColor: cssVariables.color.border.primary.hex,
        },
      },

      '@media': {
        [getMediaQuery('md')]: {
          paddingBlock: '6px 4px',
          paddingInline: '2px',
        },
      },
    },
  },
})

export const layoutHeaderLang_separator = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      color: cssVariables.color.font.subMedium.hex,
    },
  },
})

export const layoutHeaderMenuButton = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      gridArea: 'menu',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      inlineSize: '44px',
      blockSize: '44px',
      marginInlineEnd: '4px',
      color: cssVariables.color.font.primary.hex,

      '@media': {
        [getMediaQuery('not-scripting')]: {
          display: 'none',
        },
        [getMediaQuery('md')]: {
          display: 'none',
        },
      },
    },
  },
})

export const layoutHeaderMenuButton_icon = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      inlineSize: '22px',
    },
  },
})
