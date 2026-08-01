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
    },
  },
})

export const dropzone_input = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'none',
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
