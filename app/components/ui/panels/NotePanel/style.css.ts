import { style } from '@vanilla-extract/css'

import { getLineColor } from '~/styles/mixins/color.css'
import { getCornerMark } from '~/styles/mixins/corner-mark.css'
import { getContainerQuery } from '~/styles/mixins/media-query.css'
import { getClampPx, getClampRem } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontMedium } from '~/styles/variables/font.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

export const notePanel = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {},
  },
})

export const notePanel_items = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      display: 'grid',

      '@container': {
        [getContainerQuery('md')]: {
          gridAutoColumns: 'minmax(0, 1fr)',
          gridAutoFlow: 'column',
        },
      },
    },
  },
})

export const notePanel_item = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
      paddingBlock: `${getClampPx(18, 24)} ${getClampPx(20, 26)}`,
      paddingInline: getClampPx(20, 28),

      selectors: {
        '& + &': {
          borderBlockStart: `1px solid ${getLineColor(0.3)}`,
        },
      },

      '@container': {
        [getContainerQuery('md')]: {
          selectors: {
            '& + &': {
              borderBlockStart: 'none',
              borderInlineStart: `1px solid ${getLineColor(0.3)}`,
            },

            // 列の境目と上の枠が交わるところに「＋」を置く
            '& + &::before': getCornerMark({ shape: 'cross', corners: ['topLeft'] }),
          },
        },
      },
    },
  },
})

export const notePanel_title = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      marginBlockEnd: getClampPx(6, 8),
      fontSize: getClampRem(15, 16),
      fontWeight: cssVariables.font.weight.bold,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const notePanel_text = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      ...fontMedium,
      lineHeight: 1.9,
      color: cssVariables.color.font.pale.hex,
    },
  },
})
