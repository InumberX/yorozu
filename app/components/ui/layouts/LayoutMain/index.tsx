import { type ReactNode, type JSX } from 'react'

import * as styles from './style.css'

type Props = { children?: ReactNode; id?: string; tag?: keyof JSX.IntrinsicElements }

export const LayoutMain = ({ children, id, tag }: Props) => {
  const Tag = tag ?? 'main'
  return (
    <Tag id={id} className={styles.layoutMain}>
      <div className={styles.layoutMain_container}>{children}</div>
    </Tag>
  )
}
