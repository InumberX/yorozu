import { type StyleRule } from '@vanilla-extract/css'

// ブラウザの既定のボタンの見た目（灰色の面・枠・内側の余白）を消す。
// 素の <button> で文字やアイコンだけのボタンを作るときに使う。
export const buttonReset: StyleRule = {
  appearance: 'none',
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
}
