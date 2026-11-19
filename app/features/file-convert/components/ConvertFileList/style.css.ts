import { style } from '@vanilla-extract/css'

import { buttonReset } from '~/styles/mixins/button-reset.css'
import { getLineColor } from '~/styles/mixins/color.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getContainerQuery, getMediaQuery } from '~/styles/mixins/media-query.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontCaption, fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const convertFileList = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: 10,
      marginBlockEnd: 10,
      listStyle: 'none',
    },
  },
})

export const convertFileList_item = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '48px minmax(0, 1fr)',
      alignItems: 'center',
      gap: 12,
      paddingBlock: 10,
      paddingInline: '10px 48px',
      border: `1px solid ${getLineColor(0.3)}`,

      '@container': {
        [getContainerQuery('sm')]: {
          gridTemplateColumns: '56px minmax(0, 1fr)',
          gap: 14,
          paddingBlock: 12,
          paddingInline: '12px 52px',
        },
      },
    },
  },
})

export const convertFileList_item__error = style({
  '@layer': {
    [cssLayerComponentPage]: {
      borderColor: cssVariables.color.border.error.hex,
    },
  },
})

export const convertFileList_thumbnail = style({
  '@layer': {
    [cssLayerComponentPage]: {
      inlineSize: 48,
      blockSize: 48,

      '@container': {
        [getContainerQuery('sm')]: {
          inlineSize: 56,
          blockSize: 56,
        },
      },
    },
  },
})

export const convertFileList_body = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: 4,
      minInlineSize: 0,
    },
  },
})

export const convertFileList_name = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
      color: cssVariables.color.font.white.hex,
      wordBreak: 'break-all',
    },
  },
})

export const convertFileList_meta = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      color: cssVariables.color.font.subLight.hex,
    },
  },
})

export const convertFileList_errors = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontCaption,
      display: 'grid',
      color: cssVariables.color.font.error.hex,
    },
  },
})

export const convertFileList_error = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'block',
    },
  },
})

export const convertFileList_remove = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...buttonReset,
      position: 'absolute',
      insetBlockStart: 0,
      insetInlineEnd: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      inlineSize: 44,
      blockSize: 44,
      color: cssVariables.color.font.subLight.hex,
      cursor: 'pointer',
      transition: getTransition([{ property: 'color' }]),

      selectors: {
        '&:focus-visible': {
          outline: `2px solid ${cssVariables.color.border.accent.hex}`,
          outlineOffset: -2,
        },

        '&:disabled': {
          cursor: 'not-allowed',
          opacity: cssVariables.opacity.disabled,
        },
      },

      '@container': {
        [getContainerQuery('sm')]: {
          insetBlockStart: 4,
          insetInlineEnd: 4,
          inlineSize: 40,
          blockSize: 40,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:enabled:hover': {
              color: cssVariables.color.font.accent.hex,
            },
          },
        },
      },
    },
  },
})
