import { style } from '@vanilla-extract/css'

import { getRgba } from '~/styles/mixins/color.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { visuallyHidden } from '~/styles/mixins/visually-hidden.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontCaption, fontMedium } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const inputCheckbox = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const inputCheckbox_input = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...visuallyHidden,
    },
  },
})

export const inputCheckbox_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      minBlockSize: 40,
      cursor: 'pointer',
      transition: getTransition([{ property: 'opacity' }]),

      selectors: {
        [`&:has(${inputCheckbox_input}:disabled)`]: {
          cursor: 'not-allowed',
          opacity: cssVariables.opacity.disabled,
        },
      },
    },
  },
})

// 22px の枠。チェックすると、中に 12px の四角が現れる。
export const inputCheckbox_box = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      flex: 'none',
      display: 'inline-grid',
      placeContent: 'center',
      inlineSize: 22,
      blockSize: 22,
      border: `1px solid ${cssVariables.color.border.primary.hex}`,
      backgroundColor: 'transparent',
      transition: getTransition([{ property: 'background-color' }, { property: 'border-color' }]),

      selectors: {
        '&::after': {
          content: '""',
          inlineSize: 12,
          blockSize: 12,
          backgroundColor: cssVariables.color.background.primary.hex,
          transform: 'scale(0)',
          transition: getTransition([{ property: 'transform', speed: 0.12 }]),
        },

        [`${inputCheckbox_input}:checked + &`]: {
          backgroundColor: getRgba(cssVariables.color.background.primary.rgb, 0.12),
        },

        [`${inputCheckbox_input}:checked + &::after`]: {
          transform: 'scale(1)',
        },

        [`${inputCheckbox_input}:focus-visible + &`]: {
          outline: `2px solid ${cssVariables.color.border.accent.hex}`,
          outlineOffset: 3,
        },

        [`${inputCheckbox_input}[aria-invalid] + &`]: {
          borderColor: cssVariables.color.border.error.hex,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`${inputCheckbox_label}:hover ${inputCheckbox_input}:enabled + &`]: {
              borderColor: cssVariables.color.border.primaryLight.hex,
            },
          },
        },

        [getMediaQuery('reduced-motion')]: {
          selectors: {
            '&::after': {
              transition: 'none',
            },
          },
        },
      },
    },
  },
})

export const inputCheckbox_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontMedium,
      color: cssVariables.color.font.pale.hex,
    },
  },
})

export const inputCheckbox_helperText = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaption,
      marginBlockStart: 4,
      color: cssVariables.color.font.pale.hex,
    },
  },
})
