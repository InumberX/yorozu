import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery, getMediaQueryReverse } from '~/styles/mixins/media-query.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクト「yorozu-cyber-net」（PC）/「yorozu-cyber-net-sp」（SP）のヘッダー。
// sm 未満を SP（ハンバーガーメニュー）、sm 以上を PC（横並びナビ）として扱う。

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

// SP メニューの開閉とアイコンの変形にかける時間（秒）
const MENU_TRANSITION_SPEED = 0.3

// 動きを減らす設定の閲覧者には、開閉を即時に切り替える。
const reducedMotion = '(prefers-reduced-motion: reduce)'

export const layoutHeader = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      position: 'fixed',
      inlineSize: '100%',
      insetBlockStart: 0,
      insetInlineStart: 0,
      zIndex: cssVariables.zIndex.header.wrapper,
      backgroundColor: `rgba(${cssVariables.color.background.base.rgb}, 0.92)`,
      backdropFilter: 'blur(8px)',
      borderBlockEnd: `1px solid ${getLineColor(0.3)}`,

      '@media': {
        // JS が動かない SP ではメニューを常に展開するため、ヘッダーを固定せず本文の流れに置く。
        // 固定したままだと、展開したメニューがページの見出しに重なる。
        [`${getMediaQueryReverse('sm')} and ${getMediaQuery('not-scripting')}`]: {
          position: 'relative',
        },
      },
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
        [getMediaQuery('sm')]: {
          gridTemplateAreas: '"brand nav lang"',
          gridTemplateRows: `${layoutHeaderHeight.maximum}px`,
          columnGap: '16px',
        },
        [getMediaQuery('md')]: {
          columnGap: '28px',
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
      // 開閉を transition で見せるため、閉じている間も DOM と描画には残し、
      // visibility で操作と読み上げの対象から外す。
      visibility: 'hidden',
      opacity: 0,
      transform: 'translateY(-8px)',
      backgroundColor: cssVariables.color.background.base.hex,
      borderBlock: `1px solid ${getLineColor(0.3)}`,
      position: 'absolute',
      insetBlockStart: '100%',
      insetInlineStart: 0,
      zIndex: cssVariables.zIndex.header.nav,
      inlineSize: '100%',

      '@media': {
        // JS が動かない環境ではメニューを開けないため、常に展開しておく。
        [getMediaQuery('not-scripting')]: {
          visibility: 'visible',
          opacity: 1,
          transform: 'none',
          position: 'static',
        },
        // ヘッダーの流れに置くと LayoutInner の左右の余白の内側に収まるため、余白を打ち消して全幅に広げる。
        [`${getMediaQueryReverse('sm')} and ${getMediaQuery('not-scripting')}`]: {
          marginInline: `calc(-1 * ${cssVariables.layout.inner.padding.xs})`,
          inlineSize: 'auto',
        },
        [getMediaQuery('sm')]: {
          visibility: 'visible',
          opacity: 1,
          transform: 'none',
          alignSelf: 'stretch',
          backgroundColor: 'transparent',
          borderBlock: 'none',
          position: 'static',
        },
      },
    },
  },
})

// 閲覧者がメニューを開閉したときだけ付ける（PC / SP の切り替えでは付けない）。
export const layoutHeaderNav__animated = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      transition: getTransition([
        { property: 'opacity', speed: MENU_TRANSITION_SPEED },
        { property: 'transform', speed: MENU_TRANSITION_SPEED },
        { property: 'visibility', speed: MENU_TRANSITION_SPEED },
      ]),

      '@media': {
        [reducedMotion]: {
          transition: 'none',
        },
        [getMediaQuery('sm')]: {
          transition: 'none',
        },
      },
    },
  },
})

export const layoutHeaderNav__open = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      visibility: 'visible',
      opacity: 1,
      transform: 'none',
    },
  },
})

export const layoutHeaderNav_items = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      display: 'flex',
      flexDirection: 'column',

      '@media': {
        [getMediaQuery('sm')]: {
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: '16px',
          blockSize: '100%',
        },
        [getMediaQuery('md')]: {
          gap: '28px',
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
        [getMediaQuery('sm')]: {
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
      gap: '16px',
      justifyContent: 'space-between',
      blockSize: '52px',
      paddingInline: cssVariables.layout.inner.padding.xs,
      fontSize: getFontSize(14),
      fontWeight: cssVariables.font.weight.regular,
      color: cssVariables.color.font.subLight.hex,
      // SP では下線を出さないが、色だけ PC と同じ値にしておく。指定しないと文字色が使われ、
      // SP → PC へ幅が変わったときに、その色から透明・主色への transition で下線が一瞬見える。
      borderBlockEndColor: 'transparent',
      transition: colorTransition,

      selectors: {
        '&[aria-current="page"]': {
          color: cssVariables.color.font.white.hex,
          fontWeight: cssVariables.font.weight.bold,
          borderBlockEndColor: cssVariables.color.border.primary.hex,
        },
      },

      '@media': {
        [getMediaQuery('sm')]: {
          blockSize: 'auto',
          paddingInline: 0,
          paddingBlock: '2px 0',
          color: cssVariables.color.font.subLight.hex,
          borderBlockEnd: '2px solid transparent',
          fontSize: getFontSize(12),

          selectors: {
            '&[aria-current="page"]': {
              color: cssVariables.color.font.white.hex,
              fontWeight: cssVariables.font.weight.medium,
              borderBlockEndColor: cssVariables.color.border.primary.hex,
            },
          },
        },
        [getMediaQuery('md')]: {
          fontSize: getFontSize(14),
        },
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.white.hex,
            },
            // 現在のページの下線は、ホバーしても主色のまま残す。
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
        [getMediaQuery('sm')]: {
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

      '@media': {
        [getMediaQuery('sm')]: {
          gap: '8px',
          paddingInlineStart: '16px',
          borderInlineStart: `1px solid ${getLineColor(0.3)}`,
        },
        [getMediaQuery('md')]: {
          paddingInlineStart: '24px',
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
        [getMediaQuery('sm')]: {
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
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),

      selectors: {
        '&[aria-current="true"]': {
          color: cssVariables.color.font.white.hex,
        },
      },

      '@media': {
        [getMediaQuery('sm')]: {
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
        [getMediaQuery('sm')]: {
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
      // JA / EN（layoutHeaderLang_link）と同じフォントとサイズにそろえる。
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
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
      aspectRatio: '1 / 1',
      color: cssVariables.color.font.primary.hex,

      '@media': {
        [getMediaQuery('not-scripting')]: {
          display: 'none',
        },
        [getMediaQuery('sm')]: {
          display: 'none',
        },
      },
    },
  },
})

// ハンバーガー（三本線）を CSS で描き、開いている間は × へ変形させる。
// 中央の線を本体、上下の線を ::before / ::after で描く。線の間隔は 4px。
const menuIconBar = {
  inlineSize: '16px',
  blockSize: '2px',
  backgroundColor: 'currentColor',
} as const

const menuIconTransition = getTransition([
  { property: 'transform', speed: MENU_TRANSITION_SPEED },
  { property: 'background-color', speed: MENU_TRANSITION_SPEED },
])

export const layoutHeaderMenuButton_icon = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      ...menuIconBar,
      position: 'relative',
      display: 'block',
      transition: menuIconTransition,

      selectors: {
        '&::before, &::after': {
          ...menuIconBar,
          content: '""',
          position: 'absolute',
          insetInlineStart: 0,
          transition: menuIconTransition,
        },
        '&::before': {
          transform: 'translateY(-4px)',
        },
        '&::after': {
          transform: 'translateY(4px)',
        },
        [`${layoutHeaderMenuButton}[aria-expanded="true"] &`]: {
          backgroundColor: 'transparent',
        },
        [`${layoutHeaderMenuButton}[aria-expanded="true"] &::before`]: {
          transform: 'rotate(45deg)',
        },
        [`${layoutHeaderMenuButton}[aria-expanded="true"] &::after`]: {
          transform: 'rotate(-45deg)',
        },
      },

      '@media': {
        [reducedMotion]: {
          transition: 'none',

          selectors: {
            '&::before, &::after': {
              transition: 'none',
            },
          },
        },
      },
    },
  },
})
