import { style } from '@vanilla-extract/css'

import { layoutHeaderHeight } from '~/components/common/LayoutHeader/style.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const layoutPageWrapper__topNoSpace = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const layoutPageWrapper__bottomNoSpace = style({
  '@layer': {
    [cssLayerComponentUiLow]: {},
  },
})

export const layoutPageWrapper = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      // 背景（body）側のグローとグリッドを透過させるため、面は敷かない。
      backgroundColor: 'transparent',
      paddingBlock: getClampPx(layoutHeaderHeight.minimum + 16, layoutHeaderHeight.maximum + 16),

      selectors: {
        [`&${layoutPageWrapper__topNoSpace}`]: {
          paddingBlockStart: 0,
        },

        [`&${layoutPageWrapper__bottomNoSpace}`]: {
          paddingBlockEnd: 0,
        },
      },
    },
  },
})
