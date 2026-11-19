import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

export type ConvertFileListProps = {
  // ConvertFileListItem を並べる
  children: ReactNode
}

// 読み込んだファイルの一覧
export const ConvertFileList = ({ children }: ConvertFileListProps) => (
  <ul className={styles.convertFileList}>{children}</ul>
)

export type ConvertFileListItemProps = {
  name: string
  // 「3024×2016 · 4.2MB · PNG」などの情報
  meta: string
  // 見本（FileThumbnail）
  thumbnail: ReactNode
  errors?: string[]
  isDisabled?: boolean
  onRemove: () => void
}

// 一覧の 1 件。見本・ファイル名・情報を並べ、削除のボタンを右上に置く。
export const ConvertFileListItem = ({
  name,
  meta,
  thumbnail,
  errors,
  isDisabled,
  onRemove,
}: ConvertFileListItemProps) => {
  const { t } = useTranslation('common')
  const hasErrors = !!errors?.length

  return (
    <li
      className={[styles.convertFileList_item, hasErrors && styles.convertFileList_item__error]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.convertFileList_thumbnail}>{thumbnail}</span>
      <span className={styles.convertFileList_body}>
        <span className={styles.convertFileList_name}>{name}</span>
        <span className={styles.convertFileList_meta}>{meta}</span>
        {hasErrors && (
          <span className={styles.convertFileList_errors}>
            {errors.map((error) => (
              <span key={error} className={styles.convertFileList_error}>
                {error}
              </span>
            ))}
          </span>
        )}
      </span>
      <button
        type="button"
        className={styles.convertFileList_remove}
        aria-label={t('convert.files.remove', { name })}
        disabled={isDisabled}
        onClick={onRemove}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 5.5 H17 M8 5.5 V3 H12 V5.5 M5 5.5 L5.8 17 H14.2 L15 5.5 M8.3 8.5 V14 M11.7 8.5 V14" />
        </svg>
      </button>
    </li>
  )
}
