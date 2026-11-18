import { style } from '@vanilla-extract/css'

import { getLineColor, getRgba } from '~/styles/mixins/color.css'
import { getCornerMark } from '~/styles/mixins/corner-mark.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentUiMiddle } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクト「yorozu-cyber-net」ほか、各ページのセクションの枠。

export const basePanel = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      position: 'relative',
      border: `1px solid ${getLineColor(0.3)}`,

      '::after': getCornerMark({ shape: 'cross' }),
    },
  },
})

export const basePanel__default = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      backgroundColor: getRgba(cssVariables.color.background.base.rgb, 0.16),
    },
  },
})

export const basePanel__dense = style({
  '@layer': {
    [cssLayerComponentUiMiddle]: {
      backgroundColor: getRgba(cssVariables.color.background.base.rgb, 0.86),
    },
  },
})
