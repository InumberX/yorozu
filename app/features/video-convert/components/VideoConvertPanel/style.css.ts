import { style } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontCaption, fontMedium, fontMediumBold } from '~/styles/variables/font.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const panel = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: '24px',
      marginBlockStart: '24px',
      padding: '24px',
      borderRadius: '16px',
      backgroundColor: cssVariables.color.background.light.hex,
      border: `1px solid ${cssVariables.color.border.sub.hex}`,
    },
  },
})

export const dropzone = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: '8px',
      justifyItems: 'center',
      paddingBlock: '40px',
      paddingInline: '24px',
      borderRadius: '12px',
      border: `2px dashed ${cssVariables.color.border.subDark.hex}`,
      backgroundColor: cssVariables.color.background.subLight.hex,
      textAlign: 'center',

      selectors: {
        // input を視覚的に隠しつつフォーカス可能にしているため、フォーカス時は
        // ドロップゾーン自体にフォーカスリングを出す。
        '&:focus-within': {
          borderColor: cssVariables.color.border.secondary.hex,
          outline: `2px solid ${cssVariables.color.border.secondary.hex}`,
          outlineOffset: '2px',
        },
      },
    },
  },
})

// `display: none` にするとキーボードでフォーカスできずファイル選択ができないため、
// 視覚的に隠しつつフォーカス可能（タブ順に残る）なスタイルにする。
export const dropzone_input = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'absolute',
      inlineSize: '1px',
      blockSize: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: 0,
    },
  },
})

export const dropzone_label = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
      color: cssVariables.color.font.base.hex,
    },
  },
})

export const dropzone_hint = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontCaption,
      color: cssVariables.color.font.sub.hex,
    },
  },
})

export const options = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: '20px',
    },
  },
})

export const field = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gap: '8px',
    },
  },
})

export const field_label = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
      color: cssVariables.color.font.base.hex,
    },
  },
})

export const codecList = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      gap: '20px',
    },
  },
})

export const codecItem = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMedium,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
  },
})

export const range = style({
  '@layer': {
    [cssLayerComponentPage]: {
      inlineSize: '100%',
      maxInlineSize: '320px',
      accentColor: cssVariables.color.background.primary.hex,
    },
  },
})

export const actions = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
    },
  },
})

export const progress = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMediumBold,
      color: cssVariables.color.font.primary.hex,
    },
  },
})

export const error = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMedium,
      color: cssVariables.color.font.error.hex,
    },
  },
})

export const note = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontCaption,
      color: cssVariables.color.font.sub.hex,
    },
  },
})
