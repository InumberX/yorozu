import { style } from '@vanilla-extract/css'

import { buttonReset } from '~/styles/mixins/button-reset.css'
import { getLineColor, getRgba } from '~/styles/mixins/color.css'
import { getCornerMark } from '~/styles/mixins/corner-mark.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getContainerQuery, getMediaQuery } from '~/styles/mixins/media-query.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontMedium, fontMediumBold, fontSmall } from '~/styles/variables/font.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

const LINE = `1px solid ${getLineColor(0.3)}`

export const convertPanel = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const convertPanel_panel = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

// 手順の並べ方
// - md 未満: 3 つを縦に積む
// - md 以上: 「読み込む」を上に置き、その下に「指定する」「変換する」を 2 列で並べる
// - lg 以上: 3 列（デザインの PC）
export const convertPanel_steps = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',

      '@container': {
        [getContainerQuery('md')]: {
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        },

        [getContainerQuery('lg')]: {
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        },
      },
    },
  },
})

export const convertPanel_step = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
      minInlineSize: 0,
      paddingBlock: `${getClampPx(22, 26)} ${getClampPx(24, 30)}`,
      paddingInline: getClampPx(20, 28),

      selectors: {
        '& + &': {
          borderBlockStart: LINE,
        },
      },

      '@container': {
        [getContainerQuery('md')]: {
          selectors: {
            '&:first-child': {
              gridColumn: '1 / -1',
            },

            '&:last-child': {
              borderInlineStart: LINE,
            },

            // 列の境目と上の罫線が交わるところに「＋」を置く
            '&:last-child::before': getCornerMark({ shape: 'cross', corners: ['topLeft'] }),
          },
        },

        [getContainerQuery('lg')]: {
          selectors: {
            '&:first-child': {
              gridColumn: 'auto',
            },

            '& + &': {
              borderBlockStart: 'none',
              borderInlineStart: LINE,
            },

            '& + &::before': getCornerMark({ shape: 'cross', corners: ['topLeft'] }),
          },
        },
      },
    },
  },
})

export const convertPanel_reset = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...buttonReset,
      ...fontSmall,
      minBlockSize: 44,
      marginBlock: -8,
      paddingBlock: 4,
      color: cssVariables.color.font.primary.hex,
      textDecoration: 'underline',
      textUnderlineOffset: 3,
      cursor: 'pointer',
      transition: getTransition([{ property: 'color' }]),

      selectors: {
        '&:disabled': {
          cursor: 'not-allowed',
          opacity: cssVariables.opacity.disabled,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:enabled:hover': {
              color: cssVariables.color.font.primaryLight.hex,
            },
          },
        },
      },
    },
  },
})

export const convertPanel_accept = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      color: cssVariables.color.font.subLight.hex,
    },
  },
})

export const convertPanel_options = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: 22,
    },
  },
})

export const convertPanel_ready = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const convertPanel_done = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBlockEnd: 10,
      color: cssVariables.color.font.white.hex,

      selectors: {
        '&::before': {
          content: '""',
          inlineSize: 8,
          blockSize: 8,
          backgroundColor: cssVariables.color.background.primary.hex,
        },
      },
    },
  },
})

export const convertPanel_unavailable = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontSmall,
      marginBlockEnd: 12,
      paddingBlock: 10,
      paddingInline: 12,
      border: `1px solid ${cssVariables.color.border.error.hex}`,
      lineHeight: 1.8,
      color: cssVariables.color.font.error.hex,
    },
  },
})

export const convertPanel_summary = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMedium,
      marginBlockEnd: getClampPx(16, 20),
      lineHeight: 1.9,
      color: cssVariables.color.font.pale.hex,
    },
  },
})

export const convertPanel_summaryOutput = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontWeight: cssVariables.font.weight.bold,
      color: cssVariables.color.font.white.hex,
    },
  },
})

// 変換するボタン。md 未満は幅いっぱいにする（デザインの SP）
export const convertPanel_run = style({
  '@layer': {
    [cssLayerComponentPage]: {
      inlineSize: '100%',

      '@container': {
        [getContainerQuery('md')]: {
          inlineSize: 'auto',
        },
      },
    },
  },
})

export const convertPanel_running = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const convertPanel_progressHeader = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBlockEnd: 10,
    },
  },
})

export const convertPanel_progressLabel = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const convertPanel_progressValue = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(28),
      lineHeight: 1,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const convertPanel_progress = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'block',
      inlineSize: '100%',
      blockSize: 6,
      border: 'none',
      appearance: 'none',
      backgroundColor: getRgba(cssVariables.color.background.primary.rgb, 0.16),
      color: cssVariables.color.background.primary.hex,

      selectors: {
        '&::-webkit-progress-bar': {
          backgroundColor: getRgba(cssVariables.color.background.primary.rgb, 0.16),
        },

        '&::-webkit-progress-value': {
          backgroundColor: cssVariables.color.background.primary.hex,
          transition: getTransition([{ property: 'inline-size', speed: 0.2 }]),
        },

        '&::-moz-progress-bar': {
          backgroundColor: cssVariables.color.background.primary.hex,
        },
      },
    },
  },
})

export const convertPanel_note = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontSmall,
      marginBlock: `12px ${getClampPx(16, 18)}`,
      lineHeight: 1.8,
      color: cssVariables.color.font.pale.hex,
    },
  },
})

export const convertPanel_cancel = style({
  '@layer': {
    [cssLayerComponentPage]: {
      inlineSize: '100%',

      '@container': {
        [getContainerQuery('md')]: {
          inlineSize: 'auto',
        },
      },
    },
  },
})
