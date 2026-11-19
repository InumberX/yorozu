import { style } from '@vanilla-extract/css'

import { getLineColor, getRgba } from '~/styles/mixins/color.css'
import { getCornerMark } from '~/styles/mixins/corner-mark.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクト「yorozu-cyber-net-image(-sp)」のボタン。
// - contained: 発光グリーンで塗った四角。角に「┌」の飾り。ホバーで塗りと文字の色を入れ替える。
// - outlined: 主色の細い枠。ホバーで面をうっすら塗る。

export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      inlineSize: 'auto',
      blockSize: 'auto',
      border: '1px solid transparent',
      fontWeight: cssVariables.font.weight.bold,
      lineHeight: 1.4,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      transition: getTransition([
        { property: 'color' },
        { property: 'background-color' },
        { property: 'border-color' },
        { property: 'opacity' },
      ]),

      selectors: {
        '&:focus-visible': {
          outline: `2px solid ${cssVariables.color.border.accent.hex}`,
          outlineOffset: 3,
        },
      },
    },
  },
})

export const baseButton__disabled = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const baseButton__large = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      minBlockSize: 48,
      paddingBlock: 11,
      paddingInline: 26,
      fontSize: getFontSize(15),
    },
  },
})

export const baseButton__medium = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      minBlockSize: 40,
      paddingBlock: 8,
      paddingInline: 18,
      fontSize: getFontSize(14),
    },
  },
})

export const baseButton__small = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      minBlockSize: 36,
      paddingBlock: 6,
      paddingInline: 14,
      fontSize: getFontSize(13),
    },
  },
})

export const baseButton__contained = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const baseButton__outlined = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const baseButton__primary = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        [`&${baseButton__contained}`]: {
          borderColor: cssVariables.color.border.primary.hex,
          backgroundColor: cssVariables.color.background.primary.hex,
          // 発光グリーンの面に載せるため、文字は背景色まで落とす。
          color: cssVariables.color.font.dark.hex,
        },

        // 押せない塗りのボタンは、塗らずに枠と文字を沈ませる（デザインの「変換する」の押せない状態）
        [`&${baseButton__contained}${baseButton__disabled}`]: {
          borderColor: getLineColor(0.3),
          backgroundColor: 'transparent',
          color: cssVariables.color.font.subMedium.hex,
          opacity: 1,
        },

        [`&${baseButton__outlined}`]: {
          borderColor: getLineColor(0.6),
          backgroundColor: 'transparent',
          color: cssVariables.color.font.primary.hex,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&${baseButton__contained}:hover`]: {
              backgroundColor: cssVariables.color.background.base.hex,
              color: cssVariables.color.font.primary.hex,
            },

            [`&${baseButton__outlined}:hover`]: {
              backgroundColor: getRgba(cssVariables.color.background.primary.rgb, 0.12),
            },
          },
        },
      },
    },
  },
})

// 塗りのボタンの角の飾り（primary の contained だけ）
export const baseButton_corner = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        [`${baseButton__contained}${baseButton__primary}:not(${baseButton__disabled}) &`]: {
          ...getCornerMark({ shape: 'bracket', color: cssVariables.color.border.primary.hex }),
        },
      },
    },
  },
})

export const baseButton_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
  },
})

export const baseButton_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'block',
    },
  },
})
