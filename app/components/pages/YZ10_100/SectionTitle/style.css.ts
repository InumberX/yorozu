import { style } from '@vanilla-extract/css'

import { getLineColor } from '~/styles/mixins/color.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getClampPx, getClampRem } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクト「yorozu-cyber-net」（PC）/「yorozu-cyber-net-sp」（SP）の SEC.01・SEC.02 の見出し。

export const sectionTitle = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      alignItems: 'baseline',
      gap: getClampPx(12, 16),
      paddingBlock: `${getClampPx(16, 20)} ${getClampPx(14, 18)}`,
      paddingInline: getClampPx(20, 24),
      borderBlockEnd: `1px solid ${getLineColor(0.3)}`,
    },
  },
})

export const sectionTitle_label = style({
  '@layer': {
    [cssLayerComponentPage]: {
      flexShrink: 0,
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      color: cssVariables.color.font.accent.hex,
    },
  },
})

export const sectionTitle_title = style({
  '@layer': {
    [cssLayerComponentPage]: {
      fontSize: getClampRem(22, 28),
      fontWeight: cssVariables.font.weight.bold,
      lineHeight: 1.3,
      color: cssVariables.color.font.white.hex,
    },
  },
})
