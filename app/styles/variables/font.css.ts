import { type StyleRule } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getClampRem } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'

// デザイン案A のタイポグラフィスケール
// h1 52px（下層 32px）/ 見出し 20px / 本文 12.5〜14px / ラベル 10〜11.5px
// 出典: docs/design-guideline.md「デザイン案（検討中）> 案A」

export const fontHeading1: StyleRule = {
  fontSize: getClampRem(24, 32),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontHeading2: StyleRule = {
  fontSize: getClampRem(18, 20),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontHeading3: StyleRule = {
  fontSize: getClampRem(16, 18),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontHeading4: StyleRule = {
  fontSize: getClampRem(14, 16),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontMaximumBold: StyleRule = {
  fontSize: getClampRem(32, 52),
  fontWeight: cssVariables.font.weight.black,
}

export const fontLarge: StyleRule = {
  fontSize: getClampRem(14, 16),
  fontWeight: cssVariables.font.weight.regular,
}

export const fontLargeBold: StyleRule = {
  fontSize: getClampRem(14, 16),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontMedium: StyleRule = {
  fontSize: getClampRem(12.5, 14),
  fontWeight: cssVariables.font.weight.regular,
}

export const fontMediumBold: StyleRule = {
  fontSize: getClampRem(12.5, 14),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontSmall: StyleRule = {
  fontSize: getClampRem(11.5, 12.5),
  fontWeight: cssVariables.font.weight.regular,
}

export const fontSmallBold: StyleRule = {
  fontSize: getClampRem(11.5, 12.5),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontCaption: StyleRule = {
  fontSize: getFontSize(11.5),
  fontWeight: cssVariables.font.weight.regular,
}

export const fontCaptionBold: StyleRule = {
  fontSize: getFontSize(11.5),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontMinimum: StyleRule = {
  fontSize: getFontSize(10),
  fontWeight: cssVariables.font.weight.regular,
}

export const fontMinimumBold: StyleRule = {
  fontSize: getFontSize(10),
  fontWeight: cssVariables.font.weight.bold,
}

// 英数字ラベル（メニュー・キャプション・ステータス表記など）
export const fontLabel: StyleRule = {
  fontFamily: cssVariables.font.family.mono,
  fontSize: getClampRem(10, 12),
  fontWeight: cssVariables.font.weight.regular,
}

// 大きめのラベル（ブランド表記・セクション見出しの添え字など）
export const fontLabelLarge: StyleRule = {
  fontFamily: cssVariables.font.family.mono,
  fontSize: getClampRem(12, 14),
  fontWeight: cssVariables.font.weight.regular,
}

// 数値表記（進捗・サイズ・ID など）
export const fontMono: StyleRule = {
  fontFamily: cssVariables.font.family.mono,
  fontSize: getClampRem(12, 14),
  fontWeight: cssVariables.font.weight.regular,
}
