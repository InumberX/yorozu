import { style } from '@vanilla-extract/css'

import { layoutHeaderHeight } from '~/components/common/LayoutHeader/style.css'
import { getMediaQuery } from '~/styles/mixins/media-query.css'
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
      // 上は固定ヘッダーの高さと同じ（ヘッダーと同じく sm で切り替える）。下は画面幅に応じて 40〜80px。
      paddingBlock: `${layoutHeaderHeight.minimum}px ${getClampPx(40, 80)}`,

      '@media': {
        [getMediaQuery('sm')]: {
          paddingBlockStart: `${layoutHeaderHeight.maximum}px`,
        },
      },

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
