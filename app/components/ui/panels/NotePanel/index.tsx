import { type ReactNode } from 'react'

import * as styles from './style.css'

import { BasePanel } from '~/components/ui/panels/BasePanel'

export type NotePanelItem = {
  title: string
  text: ReactNode
}

export type NotePanelProps = {
  items: NotePanelItem[]
  className?: string
}

// ページの下に置く注記。md 以上で横に並べ、それより狭いときは縦に積む。
export const NotePanel = ({ items, className }: NotePanelProps) => {
  return (
    <BasePanel className={[styles.notePanel, className].filter(Boolean).join(' ')}>
      <div className={styles.notePanel_items}>
        {items.map((item) => (
          <section key={item.title} className={styles.notePanel_item}>
            <h2 className={styles.notePanel_title}>{item.title}</h2>
            <p className={styles.notePanel_text}>{item.text}</p>
          </section>
        ))}
      </div>
    </BasePanel>
  )
}
