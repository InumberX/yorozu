import { keyframes, style } from '@vanilla-extract/css'

import { getLineColor } from '~/styles/mixins/color.css'
import { getCornerMark } from '~/styles/mixins/corner-mark.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
import { getClampPx, getClampRem } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクト「yorozu-cyber-net」（PC）/「yorozu-cyber-net-sp」（SP）のヒーロー。
// 下段（CTA と数値）は 4 列に並べると狭くなるため、lg 以上で横 1 列、lg 未満で縦に積む。

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export const mainVisual = style({
  '@layer': {
    [cssLayerComponentPage]: {
      paddingBlock: `${getClampPx(16, 32)} ${getClampPx(40, 64)}`,
    },
  },
})

/* 背景の幾何学模様 ========== */
// デザインの geo-twist-slow.svg を HTML と CSS で描く。800 四方の中に、23 ずつ小さくなる正方形を 16 枚重ね、
// それぞれを 0°→45° に 90 秒かけて往復させる。開始を 1 枚ごとにずらして、全体をねじれて見せる。

const GEOMETRY_SIZE = 800
const GEOMETRY_SQUARE_COUNT = 16
// 外から 6 枚目と 12 枚目だけを差し色にする
const GEOMETRY_ACCENT_INDEXES: number[] = [5, 11]

const geometryTwist = keyframes({
  from: { rotate: '0deg' },
  to: { rotate: '45deg' },
})

// 斜めの光の帯が、左から右へ横切る。12 秒のうち最初の 3.6 秒で通り過ぎ、残りは待つ。
const geometrySweep = keyframes({
  '0%': { maskPosition: '100% 0' },
  '30%, 100%': { maskPosition: '0 0' },
})

export const mainVisualGeometry = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      // 模様をパネルいっぱいに広げる（object-fit: cover 相当）ため、パネルの大きさを測る。
      containerType: 'size',
      // 帯の外は 0.6 × 37% ≒ 22%、帯の中は 60% の濃さで見せる。
      opacity: 0.6,
      maskImage: 'linear-gradient(105deg, rgb(0 0 0 / 37%) 42%, #000 50%, rgb(0 0 0 / 37%) 58%)',
      maskSize: '300% 100%',
      maskRepeat: 'no-repeat',
      maskPosition: '100% 0',
      animation: `${geometrySweep} 12s linear infinite`,

      '@media': {
        [REDUCED_MOTION]: {
          animation: 'none',
        },
      },
    },
  },
})

export const mainVisualGeometry_stage = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'absolute',
      insetBlockStart: '50%',
      insetInlineStart: '50%',
      inlineSize: 'max(100cqi, 100cqb)',
      aspectRatio: '1 / 1',
      translate: '-50% -50%',
    },
  },
})

const mainVisualGeometry_square = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'absolute',
      insetBlockStart: '50%',
      insetInlineStart: '50%',
      aspectRatio: '1 / 1',
      translate: '-50% -50%',
      border: `1px solid ${cssVariables.color.border.primary.hex}`,
      animation: `${geometryTwist} 90s ease-in-out infinite alternate`,

      '@media': {
        // 止めても、開始のずれでねじれた形は残す。
        [REDUCED_MOTION]: {
          animationPlayState: 'paused',
        },
      },
    },
  },
})

const mainVisualGeometry_square__accent = style({
  '@layer': {
    [cssLayerComponentPage]: {
      borderColor: cssVariables.color.border.accent.hex,
    },
  },
})

export const mainVisualGeometrySquares = Array.from({ length: GEOMETRY_SQUARE_COUNT }, (_, index) => {
  const size = GEOMETRY_SIZE - 40 - 46 * index
  const delay = 3600 * index

  return [
    mainVisualGeometry_square,
    GEOMETRY_ACCENT_INDEXES.includes(index) && mainVisualGeometry_square__accent,
    style({
      '@layer': {
        [cssLayerComponentPage]: {
          inlineSize: `calc(100% * ${size} / ${GEOMETRY_SIZE})`,
          animationDelay: `-${delay}ms`,
        },
      },
    }),
  ]
    .filter(Boolean)
    .join(' ')
})

/* 上端の帯 ========== */

export const mainVisualBand = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      blockSize: getClampPx(36, 40),
      paddingInline: getClampPx(16, 24),
      borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      color: cssVariables.color.font.subMedium.hex,
      whiteSpace: 'nowrap',
    },
  },
})

export const mainVisualBand_wide = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'none',

      '@media': {
        [getMediaQuery('md')]: {
          display: 'inline',
        },
      },
    },
  },
})

/* 見出し ========== */

// 見出しを左から現す
const headingWipe = keyframes({
  from: { clipPath: 'inset(-4px 100% -4px 0)' },
  to: { clipPath: 'inset(-4px 0 -4px 0)' },
})

export const mainVisualHeading = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
      paddingBlock: `${getClampPx(28, 36)} ${getClampPx(26, 32)}`,
      paddingInline: getClampPx(20, 32),
      borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
    },
  },
})

export const mainVisualHeading_title = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getClampRem(42, 112),
      fontWeight: cssVariables.font.weight.black,
      lineHeight: 1.2,
      color: cssVariables.color.font.white.hex,
      animation: `${headingWipe} 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both`,

      '@media': {
        [getMediaQuery('lg')]: {
          lineHeight: 1.16,
        },
        [REDUCED_MOTION]: {
          animation: 'none',
        },
      },
    },
  },
})

// 英語は語が長いため、日本語より小さくする。
export const mainVisualHeading_title__en = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getClampRem(30, 92),
    },
  },
})

export const mainVisualHeading_line = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'block',
    },
  },
})

// 2 行目は塗らずに縁取りだけにする。
// デザインの縁取りは PC 1.5px / SP 1px。CSS の数値を整数にするため、lg 以上は 2px にしている。
export const mainVisualHeading_line__outline = style({
  '@layer': {
    [cssLayerComponentPage]: {
      color: 'transparent',
      WebkitTextStroke: `1px ${cssVariables.color.font.primary.hex}`,

      '@media': {
        [getMediaQuery('lg')]: {
          WebkitTextStroke: `2px ${cssVariables.color.font.primary.hex}`,
        },
      },
    },
  },
})

export const mainVisualHeading_tagline = style({
  '@layer': {
    [cssLayerComponentPage]: {
      marginBlockStart: getClampPx(16, 22),
      minBlockSize: '18px',
      fontFamily: cssVariables.font.family.mono,
      fontSize: getClampRem(12, 13),
      lineHeight: 1.4,
      color: cssVariables.color.font.primary.hex,
      whiteSpace: 'pre',
    },
  },
})

// 読み上げ用。見た目からは外し、支援技術には全文を渡す。
export const visuallyHidden = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'absolute',
      inlineSize: '1px',
      blockSize: '1px',
      margin: '-1px',
      padding: 0,
      overflow: 'hidden',
      clipPath: 'inset(50%)',
      whiteSpace: 'nowrap',
      border: 0,
    },
  },
})

/* リード文 ========== */

export const mainVisualLead = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
      paddingBlock: getClampPx(18, 20),
      paddingInline: getClampPx(20, 32),
      borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
    },
  },
})

export const mainVisualLead_text = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getClampRem(14, 15),
      lineHeight: 1.9,
      color: cssVariables.color.font.pale.hex,

      '@media': {
        [getMediaQuery('lg')]: {
          lineHeight: 2,
        },
      },
    },
  },
})

/* 下段（CTA と数値） ========== */

export const mainVisualFooter = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',

      '@media': {
        [getMediaQuery('lg')]: {
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          blockSize: '88px',
        },
      },
    },
  },
})

export const mainVisualAction = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      borderBlockEnd: `1px solid ${getLineColor(0.3)}`,

      '@media': {
        [getMediaQuery('lg')]: {
          paddingBlock: 0,
          paddingInline: '32px',
          borderBlockEnd: 'none',
          borderInlineEnd: `1px solid ${getLineColor(0.3)}`,
        },
      },
    },
  },
})

export const mainVisualAction_button = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '14px',
      inlineSize: '100%',
      minBlockSize: '48px',
      paddingBlock: '11px',
      paddingInline: getClampPx(20, 23),
      border: `1px solid ${cssVariables.color.border.primary.hex}`,
      backgroundColor: cssVariables.color.background.primary.hex,
      color: cssVariables.color.font.dark.hex,
      fontSize: getFontSize(15),
      fontWeight: cssVariables.font.weight.bold,
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      transition: getTransition([{ property: 'color' }, { property: 'background-color' }]),

      '::before': getCornerMark({ shape: 'bracket', color: cssVariables.color.border.primary.hex }),

      '@media': {
        [getMediaQuery('lg')]: {
          display: 'inline-flex',
          inlineSize: 'auto',
          minBlockSize: 'auto',
          fontSize: getFontSize(14),
        },
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              backgroundColor: cssVariables.color.background.base.hex,
              color: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const mainVisualStats = style({
  '@layer': {
    [cssLayerComponentPage]: {
      '@media': {
        [getMediaQuery('lg')]: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        },
      },
    },
  },
})

export const mainVisualStat = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      blockSize: '56px',
      paddingInline: '20px',

      selectors: {
        '&:not(:last-child)': {
          borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
        },
      },

      '@media': {
        [getMediaQuery('lg')]: {
          blockSize: 'auto',
          paddingInline: '28px',
          '::before': getCornerMark({ shape: 'cross', corners: ['topLeft'] }),
          selectors: {
            '&:not(:last-child)': {
              borderBlockEnd: 'none',
              borderInlineEnd: `1px solid ${getLineColor(0.3)}`,
            },
          },
        },
      },
    },
  },
})

export const mainVisualStat_label = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getFontSize(13),
      color: cssVariables.color.font.subLight.hex,
    },
  },
})

export const mainVisualStat_value = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getFontSize(16),
      fontWeight: cssVariables.font.weight.bold,
      lineHeight: 1,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const mainVisualStat_value__number = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontFamily: cssVariables.font.family.mono,
      fontSize: getClampRem(24, 28),
      fontWeight: cssVariables.font.weight.regular,
    },
  },
})
