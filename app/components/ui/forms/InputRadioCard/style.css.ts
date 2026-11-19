import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { visuallyHidden } from '~/styles/mixins/visually-hidden.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontCaption, fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const inputRadioCard = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      minInlineSize: 0,
      marginInline: 0,
      paddingBlock: 0,
      paddingInline: 0,
      border: 'none',

      selectors: {
        '&:disabled': {
          opacity: cssVariables.opacity.disabled,
        },
      },
    },
  },
})

export const inputRadioCard_legend = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontMediumBold,
      marginBlockEnd: 8,
      paddingInline: 0,
      letterSpacing: '0.06em',
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const inputRadioCard_items = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: 10,
    },
  },
})

export const inputRadioCard_input = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...visuallyHidden,
    },
  },
})

export const inputRadioCard_item = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
      display: 'block',
      paddingBlock: 12,
      paddingInline: 14,
      border: `1px solid ${cssVariables.color.line.level3}`,
      backgroundColor: 'transparent',
      color: cssVariables.color.font.white.hex,
      cursor: 'pointer',
      transition: getTransition([{ property: 'border-color' }, { property: 'background-color' }]),

      selectors: {
        [`&:has(${inputRadioCard_input}:checked)`]: {
          borderColor: cssVariables.color.border.primary.hex,
          backgroundColor: `rgba(${cssVariables.color.background.primary.rgb}, 0.12)`,
        },

        [`&:has(${inputRadioCard_input}:focus-visible)`]: {
          outline: `2px solid ${cssVariables.color.border.accent.hex}`,
          outlineOffset: 3,
        },

        [`&:has(${inputRadioCard_input}[aria-invalid])`]: {
          borderColor: cssVariables.color.border.error.hex,
        },

        [`&:has(${inputRadioCard_input}:disabled)`]: {
          cursor: 'not-allowed',
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&:hover:has(${inputRadioCard_input}:enabled:not(:checked))`]: {
              borderColor: cssVariables.color.line.level5,
              backgroundColor: `rgba(${cssVariables.color.background.primary.rgb}, 0.06)`,
            },
          },
        },
      },
    },
  },
})

export const inputRadioCard_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'block',
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(16),
      letterSpacing: '0.06em',
    },
  },
})

export const inputRadioCard_note = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaption,
      display: 'block',
      marginBlockStart: 4,
      color: cssVariables.color.font.pale.hex,
    },
  },
})

export const inputRadioCard_helperText = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontCaption,
      marginBlockStart: 8,
      color: cssVariables.color.font.pale.hex,
    },
  },
})
