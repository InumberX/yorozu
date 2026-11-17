import { type StyleRule } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/css-variables.css'

export const getRgba = (color: string, alpha: number) => {
  return `rgba(${color}, ${alpha})`
}

// 主色（発光グリーン）の透明度違い。ヘッダー・フッターの罫線やホバー時の下線に使う。
export const getLineColor = (alpha: number) => {
  return getRgba(cssVariables.color.border.primary.rgb, alpha)
}

export const getTextGradation = (color: string): StyleRule => {
  return {
    background: color,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }
}
