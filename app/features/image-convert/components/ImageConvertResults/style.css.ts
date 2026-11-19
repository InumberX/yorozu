import { style } from '@vanilla-extract/css'

import { buttonReset } from '~/styles/mixins/button-reset.css'
import { getLineColor, getRgba } from '~/styles/mixins/color.css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getContainerQuery, getMediaQuery } from '~/styles/mixins/media-query.css'
import { getClampPx, getClampRem } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { visuallyHidden } from '~/styles/mixins/visually-hidden.css'
import { cssVariables } from '~/styles/variables/css-variables.css'
import { fontMediumBold, fontSmall } from '~/styles/variables/font.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

const LINE = `1px solid ${getLineColor(0.3)}`

export const imageConvertResults = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const imageConvertResults_title = style({
  '@layer': {
    [cssLayerComponentPage]: {
      paddingBlock: `${getClampPx(16, 18)} ${getClampPx(14, 16)}`,
      paddingInline: getClampPx(20, 28),
      fontSize: getClampRem(19, 20),
      fontWeight: cssVariables.font.weight.bold,
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const resultGroup = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const resultGroup_header = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      minBlockSize: 48,
      paddingBlock: 4,
      paddingInline: `${getClampPx(20, 28)} 4px`,
      borderBlockStart: LINE,
      backgroundColor: getRgba(cssVariables.color.background.primary.rgb, 0.06),
    },
  },
})

export const resultGroup_info = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: 2,

      '@container': {
        [getContainerQuery('md')]: {
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: '6px 14px',
        },
      },
    },
  },
})

export const resultGroup_label = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontSmall,
      color: cssVariables.color.font.pale.hex,
    },
  },
})

export const resultGroup_at = style({
  '@layer': {
    [cssLayerComponentPage]: {
      marginInlineStart: 8,
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(14),
      color: cssVariables.color.font.white.hex,
    },
  },
})

export const resultGroup_setting = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontSmall,
      color: cssVariables.color.font.subLight.hex,
    },
  },
})

const iconButton = {
  ...buttonReset,
  display: 'flex',
  flexShrink: 0,
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
  },
} as const

export const resultGroup_remove = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...iconButton,

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.accent.hex,
            },
          },
        },
      },
    },
  },
})

export const resultGroup_failed = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontSmall,
      paddingBlock: 10,
      paddingInline: getClampPx(20, 28),
      borderBlockStart: LINE,
      color: cssVariables.color.font.error.hex,
    },
  },
})

export const resultGroup_items = style({
  '@layer': {
    [cssLayerComponentPage]: {
      listStyle: 'none',
    },
  },
})

// 1 件の行。md 未満は「見本・名前と大きさ・保存アイコン」、md 以上は表のように列をそろえる。
export const resultItem = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateAreas: '"thumbnail name download" "thumbnail sizes download"',
      gridTemplateColumns: '44px minmax(0, 1fr) 44px',
      alignItems: 'center',
      columnGap: 12,
      rowGap: 4,
      paddingBlock: 10,
      paddingInline: `${getClampPx(20, 28)} 4px`,
      borderBlockStart: LINE,

      '@container': {
        [getContainerQuery('md')]: {
          gridTemplateAreas: '"thumbnail name sizes reduction download"',
          gridTemplateColumns: '56px minmax(0, 1fr) 180px 70px auto',
          columnGap: 16,
          paddingBlock: 14,
          paddingInline: getClampPx(20, 28),
        },

        [getContainerQuery('lg')]: {
          gridTemplateColumns: '56px minmax(0, 1fr) 220px 90px 170px',
          columnGap: 20,
        },
      },
    },
  },
})

export const resultItem_thumbnail = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'thumbnail',
      inlineSize: 44,
      blockSize: 44,

      '@container': {
        [getContainerQuery('md')]: {
          inlineSize: 56,
          blockSize: 56,
        },
      },
    },
  },
})

export const resultItem_name = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
      gridArea: 'name',
      color: cssVariables.color.font.white.hex,
      wordBreak: 'break-all',
    },
  },
})

// md 未満では、大きさと削減率を名前の下に 1 行で並べる
export const resultItem_sizes = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'sizes',
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(12),
      color: cssVariables.color.font.pale.hex,

      '@container': {
        [getContainerQuery('md')]: {
          fontSize: getFontSize(13),
        },
      },
    },
  },
})

export const resultItem_reduction = style({
  '@layer': {
    [cssLayerComponentPage]: {
      gridArea: 'sizes',
      justifySelf: 'end',
      fontFamily: cssVariables.font.family.mono,
      fontSize: getFontSize(15),
      lineHeight: 1,
      color: cssVariables.color.font.primary.hex,

      '@container': {
        [getContainerQuery('md')]: {
          gridArea: 'reduction',
          justifySelf: 'start',
          fontSize: getFontSize(22),
        },
      },
    },
  },
})

export const resultItem_reductionLabel = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...visuallyHidden,
    },
  },
})

export const resultItem_download = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...iconButton,
      gridArea: 'download',
      color: cssVariables.color.font.primary.hex,
      textDecoration: 'none',

      '@container': {
        [getContainerQuery('md')]: {
          justifySelf: 'end',
          gap: 8,
          inlineSize: 'auto',
          blockSize: 'auto',
          minBlockSize: 40,
          paddingBlock: 8,
          paddingInline: 16,
          border: `1px solid ${getLineColor(0.6)}`,
          transition: getTransition([{ property: 'background-color' }]),
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              backgroundColor: getRgba(cssVariables.color.background.primary.rgb, 0.12),
            },
          },
        },
      },
    },
  },
})

export const resultItem_downloadText = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
      display: 'none',

      '@container': {
        [getContainerQuery('md')]: {
          display: 'inline',
        },
      },
    },
  },
})

export const resultGroup_footer = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingBlock: `${getClampPx(14, 16)} ${getClampPx(16, 18)}`,
      paddingInline: getClampPx(20, 28),
      borderBlockStart: LINE,
    },
  },
})

export const resultGroup_downloadAll = style({
  '@layer': {
    [cssLayerComponentPage]: {
      inlineSize: '100%',

      '@container': {
        [getContainerQuery('md')]: {
          inlineSize: 'auto',
        },
      },
    },
  },
})
