import { type StyleRule } from '@vanilla-extract/css'

import { cssVariables } from '~/styles/variables/css-variables.css'

// 枠の角に置く飾り。デザインの正（yorozu アーティファクト）の 2 種類を、
// 疑似要素 1 つの背景（線ごとの linear-gradient）で描く。
// - cross: パネルの角の「＋」。11px の十字の中心を枠線に重ねる。
// - bracket: 塗りボタンの角の「┌」。11px の L 字を枠の外へ 5px はみ出させる。

export type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

export const ALL_CORNERS: Corner[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']

const CORNER_SIDES: Record<Corner, [x: 'left' | 'right', y: 'top' | 'bottom']> = {
  topLeft: ['left', 'top'],
  topRight: ['right', 'top'],
  bottomLeft: ['left', 'bottom'],
  bottomRight: ['right', 'bottom'],
}

const CORNER_MARK_SHAPE = {
  cross: {
    size: 11,
    thickness: 1,
    // 線を十字の中央に置く位置
    offset: 5,
    // 枠の外へはみ出す量。十字の中心が、要素の外側 1px（枠線）に重なる。
    inset: 6,
  },
  bracket: {
    size: 11,
    thickness: 2,
    offset: 0,
    inset: 5,
  },
} as const

type CornerMarkOptions = {
  shape: keyof typeof CORNER_MARK_SHAPE
  color?: string
  corners?: Corner[]
}

// 疑似要素（::before / ::after）に当てるスタイル。親は position を持つこと。
export const getCornerMark = ({
  shape,
  color = cssVariables.color.font.primaryLight.hex,
  corners = ALL_CORNERS,
}: CornerMarkOptions): StyleRule => {
  const { size, thickness, offset, inset } = CORNER_MARK_SHAPE[shape]
  const line = `linear-gradient(${color}, ${color})`

  return {
    content: '""',
    position: 'absolute',
    inset: `-${inset}px`,
    zIndex: 1,
    pointerEvents: 'none',
    background: corners
      .flatMap((corner) => {
        const [x, y] = CORNER_SIDES[corner]
        return [
          `${line} ${x} 0 ${y} ${offset}px / ${size}px ${thickness}px no-repeat`,
          `${line} ${x} ${offset}px ${y} 0 / ${thickness}px ${size}px no-repeat`,
        ]
      })
      .join(', '),
  }
}
