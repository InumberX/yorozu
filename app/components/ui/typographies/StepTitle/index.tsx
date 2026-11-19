import { type JSX, type ReactNode } from 'react'

import * as styles from './style.css'

export type StepTitleProps = {
  // 手順の番号。「STEP 01」の形で出す
  step: number
  title: ReactNode
  titleTag?: keyof JSX.IntrinsicElements
  // その手順の操作（リセットのボタンなど）。見出しの行の終わりに置く
  actionElm?: ReactNode
  className?: string
}

// 操作の手順の見出し。アンバーの「STEP 01」と見出しを並べる。
export const StepTitle = ({ step, title, titleTag = 'h2', actionElm, className }: StepTitleProps) => {
  const Title = titleTag

  return (
    <div className={[styles.stepTitle, className].filter(Boolean).join(' ')}>
      <div className={styles.stepTitle_heading}>
        <span lang="en" translate="no" aria-hidden="true" className={styles.stepTitle_step}>
          STEP {String(step).padStart(2, '0')}
        </span>
        <Title className={styles.stepTitle_title}>{title}</Title>
      </div>
      {actionElm && <div className={styles.stepTitle_action}>{actionElm}</div>}
    </div>
  )
}
