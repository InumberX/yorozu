import { type ReactNode, type JSX } from 'react'

import * as styles from './style.css'

export type BasePanelProps = {
  children?: ReactNode
  tag?: keyof JSX.IntrinsicElements
  className?: string
  // dense: 下地をほぼ隠す（メインビジュアル）。default: 下地のグリッドを透かす。
  color?: 'default' | 'dense'
}

// 細い罫線の枠と、四隅の「＋」で囲んだ面。
export const BasePanel = ({ children, tag = 'div', className, color = 'default' }: BasePanelProps) => {
  const Tag = tag
  return (
    <Tag className={[styles.basePanel, styles[`basePanel__${color}`], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
