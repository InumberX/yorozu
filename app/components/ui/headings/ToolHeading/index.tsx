import { type ReactNode } from 'react'
import { Link } from 'react-router'

import * as styles from './style.css'

import { BasePanel } from '~/components/ui/panels/BasePanel'

export type ToolHeadingBreadcrumb = {
  name: string
  url: string
}

export type ToolHeadingProps = {
  // 現在のページより上の階層。現在のページ（title）は自動で末尾に付く。
  breadcrumbs: ToolHeadingBreadcrumb[]
  breadcrumbLabel: string
  // 右上に置く英字のラベル（IMAGE など）
  label: string
  title: string
  lead?: ReactNode
  className?: string
}

// ツールのページの冒頭。パンくずリスト・ラベル・h1・リードを、下地を隠すパネルにまとめる。
// 出典: yorozu アーティファクト「yorozu-cyber-net-image(-sp)」の冒頭のパネル。
export const ToolHeading = ({ breadcrumbs, breadcrumbLabel, label, title, lead, className }: ToolHeadingProps) => {
  return (
    <BasePanel color="dense" className={[styles.toolHeading, className].filter(Boolean).join(' ')}>
      <div className={styles.toolHeading_bar}>
        <nav aria-label={breadcrumbLabel}>
          <ol className={styles.toolHeading_breadcrumbs}>
            {breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.url} className={styles.toolHeading_breadcrumb}>
                <Link to={breadcrumb.url} className={styles.toolHeading_breadcrumbLink}>
                  {breadcrumb.name}
                </Link>
                <span aria-hidden="true" className={styles.toolHeading_breadcrumbSeparator}>
                  /
                </span>
              </li>
            ))}
            <li className={styles.toolHeading_breadcrumb}>
              <span aria-current="page" className={styles.toolHeading_breadcrumbCurrent}>
                {title}
              </span>
            </li>
          </ol>
        </nav>
        <span lang="en" translate="no" className={styles.toolHeading_label}>
          {label}
        </span>
      </div>

      <div className={styles.toolHeading_body}>
        <h1 className={styles.toolHeading_title}>{title}</h1>
        {lead && <p className={styles.toolHeading_lead}>{lead}</p>}
      </div>
    </BasePanel>
  )
}
