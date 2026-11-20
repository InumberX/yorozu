import { style } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { visuallyHidden } from '~/styles/mixins/visually-hidden.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentCommon } from '~/styles/variables/layers.css'

// 本文へのスキップリンク。ふだんは隠し、フォーカスが乗ったときだけヘッダーの上に出す。
export const skipLink = style({
  '@layer': {
    [cssLayerComponentCommon]: {
      ...visuallyHidden,
      // reset の a の transition で面が透けたままフェードしないよう、すぐに出し入れする。
      transition: 'none',

      selectors: {
        '&:focus': {
          position: 'fixed',
          insetBlockStart: 8,
          insetInlineStart: 8,
          zIndex: cssVariables.zIndex.skipLink,
          inlineSize: 'auto',
          blockSize: 'auto',
          margin: 0,
          paddingBlock: 8,
          paddingInline: 16,
          overflow: 'visible',
          clipPath: 'none',
          backgroundColor: cssVariables.color.background.base.hex,
          border: `1px solid ${cssVariables.color.border.primary.hex}`,
          color: cssVariables.color.font.white.hex,
          fontSize: getFontSize(14),
          fontWeight: cssVariables.font.weight.bold,
          textDecoration: 'none',
        },
      },
    },
  },
})
