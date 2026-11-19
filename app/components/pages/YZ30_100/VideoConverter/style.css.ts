import { style } from '@vanilla-extract/css'

import { getClampPx } from '~/styles/mixins/size.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

// 出典: yorozu アーティファクトのパネルの間隔（PC 40px / SP 24px）と、上下の余白（PC 32px・72px / SP 16px・48px）。
export const videoConverter = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: getClampPx(24, 40),
      paddingBlock: `${getClampPx(16, 32)} ${getClampPx(48, 72)}`,
    },
  },
})
