import { style } from '@vanilla-extract/css'

import { getLineColor } from '~/styles/mixins/color.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
import { getClampPx, getClampRem } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const toolHeading = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const toolHeading_bar = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      minBlockSize: 40,
      paddingInline: getClampPx(16, 24),
      borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
    },
  },
})

export const toolHeading_breadcrumbs = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      listStyle: 'none',
      fontSize: getFontSize(13),
    },
  },
})

export const toolHeading_breadcrumb = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
})

export const toolHeading_breadcrumbLink = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'flex',
      alignItems: 'center',
      minBlockSize: 40,
      color: cssVariables.color.font.subLight.hex,
      textDecoration: 'underline',
      textUnderlineOffset: 3,
      transition: getTransition([{ property: 'color' }]),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.white.hex,
            },
          },
        },
      },
    },
  },
})

export const toolHeading_breadcrumbSeparator = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      paddingInline: getClampPx(8, 10),
      color: cssVariables.color.font.subMedium.hex,
    },
  },
})

export const toolHeading_breadcrumbCurrent = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const toolHeading_label = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      flexShrink: 0,
      paddingBlock: 3,
      paddingInline: 8,
      border: `1px solid ${getLineColor(0.3)}`,
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      color: cssVariables.color.font.subLight.hex,
    },
  },
})

export const toolHeading_body = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      paddingBlock: `${getClampPx(22, 30)} ${getClampPx(24, 32)}`,
      paddingInline: getClampPx(20, 32),
    },
  },
})

export const toolHeading_title = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      fontSize: getClampRem(28, 44),
      fontWeight: cssVariables.font.weight.black,
      lineHeight: 1.25,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const toolHeading_lead = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      marginBlockStart: getClampPx(8, 10),
      fontSize: getClampRem(14, 15),
      lineHeight: 1.9,
      color: cssVariables.color.font.pale.hex,
    },
  },
})
