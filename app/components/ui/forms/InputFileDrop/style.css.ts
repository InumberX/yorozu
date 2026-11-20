import { style } from '@vanilla-extract/css'

import { getLineColor, getRgba } from '~/styles/mixins/color.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getContainerQuery, getMediaQuery } from '~/styles/mixins/media-query.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { visuallyHidden } from '~/styles/mixins/visually-hidden.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontLargeBold, fontMediumBold, fontSmall } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

const DASHED_BORDER = `1px dashed ${getLineColor(0.55)}`

export const inputFileDrop = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
    },
  },
})

export const inputFileDrop_input = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...visuallyHidden,
    },
  },
})

export const inputFileDrop_area = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      transition: getTransition([{ property: 'background-color' }, { property: 'outline-color' }]),
      outline: '1px solid transparent',
      outlineOffset: 4,
    },
  },
})

export const inputFileDrop_area__empty = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      border: DASHED_BORDER,
    },
  },
})

export const inputFileDrop_area__filled = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

// ファイルを重ねている間の表示
export const inputFileDrop_area__dragOver = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      outlineColor: cssVariables.color.border.primary.hex,
      backgroundColor: getRgba(cssVariables.color.background.primary.rgb, 0.08),
    },
  },
})

export const inputFileDrop_area__disabled = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      opacity: cssVariables.opacity.disabled,
    },
  },
})

export const inputFileDrop_empty = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      paddingBlock: '26px 24px',
      paddingInline: 20,
      textAlign: 'center',

      '@container': {
        [getContainerQuery('sm')]: {
          gap: 14,
          paddingBlock: '34px 30px',
        },
      },
    },
  },
})

export const inputFileDrop_icon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      color: cssVariables.color.font.primary.hex,
    },
  },
})

// ドロップの案内は、ドラッグ＆ドロップを使う幅（sm 以上）でだけ出す。デザインの SP はボタンだけ。
const dropGuide = {
  display: 'none',

  '@container': {
    [getContainerQuery('sm')]: {
      display: 'block',
    },
  },
} as const

export const inputFileDrop_dropTitle = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontLargeBold,
      ...dropGuide,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const inputFileDrop_dropOr = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontSmall,
      ...dropGuide,
      color: cssVariables.color.font.pale.hex,
    },
  },
})

const buttonBase = {
  ...fontMediumBold,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: cssVariables.color.font.primary.hex,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: getTransition([{ property: 'background-color' }]),

  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },

  '@media': {
    [getMediaQuery('hover')]: {
      selectors: {
        '&:enabled:hover': {
          backgroundColor: getRgba(cssVariables.color.background.primary.rgb, 0.12),
        },
      },
    },
  },
} as const

export const inputFileDrop_pickButton = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...buttonBase,
      inlineSize: '100%',
      minBlockSize: 48,
      paddingBlock: 8,
      paddingInline: 18,
      border: `1px solid ${getLineColor(0.6)}`,

      '@container': {
        [getContainerQuery('sm')]: {
          inlineSize: 'auto',
          minBlockSize: 40,
        },
      },
    },
  },
})

export const inputFileDrop_addButton = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...buttonBase,
      gap: 10,
      inlineSize: '100%',
      minBlockSize: 48,
      paddingBlock: 8,
      paddingInline: 16,
      border: DASHED_BORDER,

      '@container': {
        [getContainerQuery('sm')]: {
          minBlockSize: 44,
        },
      },
    },
  },
})

export const inputFileDrop_addIcon = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(18),
      lineHeight: 1,
    },
  },
})

export const inputFileDrop_helperText = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontSmall,
      marginBlockStart: 16,
      lineHeight: 1.8,
      color: cssVariables.color.font.pale.hex,
    },
  },
})
