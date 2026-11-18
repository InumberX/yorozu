import * as styles from './style.css'

type Props = {
  // 見出しの前に置く英字の番号（SEC.01 など）
  label: string
  title: string
}

// パネルの上端に置く見出し帯。番号と h2 を並べる。
export const SectionTitle = ({ label, title }: Props) => {
  return (
    <div className={styles.sectionTitle}>
      <span lang="en" translate="no" aria-hidden="true" className={styles.sectionTitle_label}>
        {label}
      </span>
      <h2 className={styles.sectionTitle_title}>{title}</h2>
    </div>
  )
}
