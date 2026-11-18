import { type StyleRule } from '@vanilla-extract/css'

// 見た目からは外し、支援技術（読み上げソフト）には内容を渡す。
export const visuallyHidden: StyleRule = {
  position: 'absolute',
  inlineSize: '1px',
  blockSize: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
}
