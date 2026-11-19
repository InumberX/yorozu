import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { ImageThumbnail } from '~/features/image-convert/components/ImageThumbnail'
import { toImageMetaLabel } from '~/features/image-convert/utils/image-label'

export type ImageFileListProps = {
  files: File[]
  // files と同じ並びの、ファイルごとのエラー
  errors?: (string[] | undefined)[]
  onRemove: (index: number) => void
  isDisabled?: boolean
}

// 読み込んだ画像の一覧。見本・ファイル名・大きさを並べ、1 件ずつ削除できる。
export const ImageFileList = ({ files, errors, onRemove, isDisabled }: ImageFileListProps) => {
  return (
    <ul className={styles.imageFileList}>
      {files.map((file, index) => (
        <ImageFileListItem
          key={`${file.name}-${file.size}-${file.lastModified}`}
          file={file}
          errors={errors?.[index]}
          isDisabled={isDisabled}
          onRemove={() => onRemove(index)}
        />
      ))}
    </ul>
  )
}

type ImageFileListItemProps = {
  file: File
  errors?: string[]
  isDisabled?: boolean
  onRemove: () => void
}

const ImageFileListItem = ({ file, errors, isDisabled, onRemove }: ImageFileListItemProps) => {
  const { t } = useTranslation('pages/YZ20_100')
  const [size, setSize] = useState<{ width: number; height: number } | undefined>(undefined)
  const hasErrors = !!errors?.length

  return (
    <li
      className={[styles.imageFileList_item, hasErrors && styles.imageFileList_item__error].filter(Boolean).join(' ')}
    >
      <ImageThumbnail file={file} onLoadSize={setSize} className={styles.imageFileList_thumbnail} />
      <span className={styles.imageFileList_body}>
        <span className={styles.imageFileList_name}>{file.name}</span>
        <span className={styles.imageFileList_meta}>
          {toImageMetaLabel({ width: size?.width, height: size?.height, size: file.size, type: file.type })}
        </span>
        {hasErrors && (
          <span className={styles.imageFileList_errors}>
            {errors.map((error) => (
              <span key={error} className={styles.imageFileList_error}>
                {error}
              </span>
            ))}
          </span>
        )}
      </span>
      <button
        type="button"
        className={styles.imageFileList_remove}
        aria-label={t('form.files.remove', { name: file.name })}
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
