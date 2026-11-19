import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { BasePanel } from '~/components/ui/panels/BasePanel'
import { ImageThumbnail } from '~/features/image-convert/components/ImageThumbnail'
import { type ImageConvertResultGroup } from '~/features/image-convert/hooks/use-image-convert'
import { toReductionLabel, toSettingLabel } from '~/features/image-convert/utils/image-label'
import { formatDateTime, formatDateTimeForFileName } from '~/utils/date'
import { createZip, downloadBlob } from '~/utils/download'
import { formatFileSize } from '~/utils/file'

export type ImageConvertResultsProps = {
  groups: ImageConvertResultGroup[]
  onRemoveGroup: (groupId: string) => void
}

// 変換結果。変換した回ごとにまとめ、新しい回を上に出す。
export const ImageConvertResults = ({ groups, onRemoveGroup }: ImageConvertResultsProps) => {
  const { t } = useTranslation('pages/YZ20_100')

  return (
    <BasePanel tag="section" className={styles.imageConvertResults}>
      <h2 className={styles.imageConvertResults_title}>{t('results.title')}</h2>
      {groups.map((group) => (
        <ResultGroup key={group.id} group={group} onRemove={() => onRemoveGroup(group.id)} />
      ))}
    </BasePanel>
  )
}

const ResultGroup = ({ group, onRemove }: { group: ImageConvertResultGroup; onRemove: () => void }) => {
  const { t } = useTranslation('pages/YZ20_100')
  const [isZipping, setIsZipping] = useState(false)
  const at = formatDateTime(group.convertedAt)

  const downloadAll = async () => {
    setIsZipping(true)
    try {
      const zip = await createZip(group.items.map((item) => ({ name: item.fileName, blob: item.blob })))
      downloadBlob(zip, `yorozu-images-${formatDateTimeForFileName(group.convertedAt)}.zip`)
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <div className={styles.resultGroup}>
      <div className={styles.resultGroup_header}>
        <span className={styles.resultGroup_info}>
          <span className={styles.resultGroup_label}>
            {t('results.convertedAt')}{' '}
            <time dateTime={group.convertedAt.toISOString()} className={styles.resultGroup_at}>
              {at}
            </time>
          </span>
          <span className={styles.resultGroup_setting}>{toSettingLabel(t, group.options)}</span>
        </span>
        <button
          type="button"
          className={styles.resultGroup_remove}
          aria-label={t('results.remove', { at })}
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
      </div>

      {group.failedNames.length > 0 && (
        <p role="alert" className={styles.resultGroup_failed}>
          {t('results.failed', { names: group.failedNames.join(', ') })}
        </p>
      )}

      <ul className={styles.resultGroup_items}>
        {group.items.map((item) => (
          <li key={item.id} className={styles.resultItem}>
            <ImageThumbnail file={item.blob} className={styles.resultItem_thumbnail} />
            <span className={styles.resultItem_name}>{item.fileName}</span>
            <span className={styles.resultItem_sizes}>
              {formatFileSize(item.beforeSize)} → {formatFileSize(item.afterSize)}
            </span>
            <span className={styles.resultItem_reduction}>
              <span className={styles.resultItem_reductionLabel}>{t('results.reduction')}</span>
              {toReductionLabel(item.beforeSize, item.afterSize)}
            </span>
            <a
              href={item.url}
              download={item.fileName}
              className={styles.resultItem_download}
              aria-label={t('results.downloadLabel', { name: item.fileName })}
            >
              <span className={styles.resultItem_downloadText}>{t('results.download')}</span>
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M10 3 V13 M5.5 8.5 L10 13 L14.5 8.5 M3.5 16.5 H16.5" />
              </svg>
            </a>
          </li>
        ))}
      </ul>

      {group.items.length > 1 && (
        <div className={styles.resultGroup_footer}>
          <BaseButton
            size="large"
            className={styles.resultGroup_downloadAll}
            ariaLabel={t('results.downloadAllLabel', { at })}
            isDisabled={isZipping}
            onClick={() => {
              void downloadAll()
            }}
            rightElm={<span aria-hidden="true">↓</span>}
          >
            {t('results.downloadAll')}
          </BaseButton>
        </div>
      )}
    </div>
  )
}
