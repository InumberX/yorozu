import { style } from '@vanilla-extract/css'

import { CACHE_BUSTER } from '~/config/env'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const svgIcon = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'inline-flex',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      inlineSize: 24,
      aspectRatio: '1 / 1',
      // mask で塗るため、置かれた文脈の文字色をそのまま引き継ぐ。
      backgroundColor: 'currentColor',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      transition: getTransition([
        {
          property: 'background-color',
        },
        {
          property: 'opacity',
        },
      ]),
    },
  },
})

export const svgIcon__animatedImages = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-animated-images.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-animated-images.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__chevronForward = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-chevron-forward.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-chevron-forward.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__check = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-check.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-check.svg?${CACHE_BUSTER})`,
    },
  },
})

export const svgIcon__filter = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      WebkitMaskImage: `url(/assets/img/icon-filter.svg?${CACHE_BUSTER})`,
      maskImage: `url(/assets/img/icon-filter.svg?${CACHE_BUSTER})`,
    },
  },
})
