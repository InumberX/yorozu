import { type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { BasePanel } from '~/components/ui/panels/BasePanel'
import type { ConvertFailure, ConvertResultGroup, ConvertResultItem } from '~/features/file-convert/types'
import { toReductionLabel } from '~/features/file-convert/utils/convert-label'
import { formatDateTime, formatDateTimeForFileName } from '~/utils/date'
import { createZip, downloadBlob } from '~/utils/download'
import { formatFileSize } from '~/utils/file'

export type ConvertResultsProps<O> = {
  groups: ConvertResultGroup<O>[]
  onRemoveGroup: (groupId: string) => void
  // 変換の設定を 1 行で表す（例: WebP / 品質 80）
  getSettingLabel: (options: O) => string
  // 変換したファイルの見本（FileThumbnail）
  renderThumbnail: (item: ConvertResultItem) => ReactNode
  // 変換できなかった理由。わからないとき（undefined）は名前だけを出す
  getFailureReason?: (code: string, options: O) => string | undefined
  // 変換はできたが知らせておきたいこと（例: 音声を書き出せなかった）
  getWarningLabel?: (code: string) => string | undefined
  // まとめて保存する ZIP の名前の頭（例: yorozu-images）
  zipNamePrefix: string
  // console に出すときの見出し（例: image-convert）
  logLabel: string
}

// 変換結果。変換した回ごとにまとめ、新しい回を上に出す。
export const ConvertResults = <O,>({ groups, onRemoveGroup, ...props }: ConvertResultsProps<O>) => {
  const { t } = useTranslation('common')

  return (
    <BasePanel tag="section" className={styles.convertResults}>
      <h2 className={styles.convertResults_title}>{t('convert.results.title')}</h2>
      {groups.map((group) => (
        <ConvertResultsGroup key={group.id} group={group} onRemove={() => onRemoveGroup(group.id)} {...props} />
      ))}
    </BasePanel>
  )
}

type ConvertResultsGroupProps<O> = Omit<ConvertResultsProps<O>, 'groups' | 'onRemoveGroup'> & {
  group: ConvertResultGroup<O>
  onRemove: () => void
}

// 1 回の変換でできたもの。見出しの行（日時・設定・削除）と、ファイルの行と、まとめて保存するボタン。
const ConvertResultsGroup = <O,>({
  group,
  onRemove,
  getSettingLabel,
  renderThumbnail,
  getFailureReason,
  getWarningLabel,
  zipNamePrefix,
  logLabel,
}: ConvertResultsGroupProps<O>) => {
  const { t } = useTranslation('common')
  const [isZipping, setIsZipping] = useState(false)
  const [isZipFailed, setIsZipFailed] = useState(false)
  const at = formatDateTime(group.convertedAt)

  const handleClickDownloadAll = async () => {
    setIsZipping(true)
    setIsZipFailed(false)
    try {
      const zip = await createZip(group.items.map((item) => ({ name: item.fileName, blob: item.blob })))
      downloadBlob(zip, `${zipNamePrefix}-${formatDateTimeForFileName(group.convertedAt)}.zip`)
    } catch (error) {
      console.error(`[${logLabel}] failed to create zip`, error)
      setIsZipFailed(true)
    } finally {
      setIsZipping(false)
    }
  }

  const toFailureLabel = (failure: ConvertFailure) => {
    const reason = failure.code === null ? undefined : getFailureReason?.(failure.code, group.options)
    return reason ? t('convert.results.failedReason', { name: failure.name, reason }) : failure.name
  }

  return (
    <div className={styles.resultGroup}>
      <div className={styles.resultGroup_header}>
        <span className={styles.resultGroup_info}>
          <span className={styles.resultGroup_label}>
            {t('convert.results.convertedAt')}{' '}
            <time dateTime={group.convertedAt.toISOString()} className={styles.resultGroup_at}>
              {at}
            </time>
          </span>
          <span className={styles.resultGroup_setting}>{getSettingLabel(group.options)}</span>
        </span>
        <button
          type="button"
          className={styles.resultGroup_remove}
          aria-label={t('convert.results.remove', { at })}
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

      {group.failures.length > 0 && (
        <p role="alert" className={styles.resultGroup_failed}>
          {t('convert.results.failed', { names: group.failures.map(toFailureLabel).join(', ') })}
        </p>
      )}

      <ul className={styles.resultGroup_items}>
        {group.items.map((item) => {
          const warnings = item.warnings
            .map((code) => getWarningLabel?.(code))
            .filter((label): label is string => !!label)

          return (
            <li key={item.id} className={styles.resultItem}>
              <span className={styles.resultItem_thumbnail}>{renderThumbnail(item)}</span>
              <span className={styles.resultItem_name}>
                {item.fileName}
                {warnings.map((warning) => (
                  <span key={warning} className={styles.resultItem_warning}>
                    {warning}
                  </span>
                ))}
              </span>
              <span className={styles.resultItem_sizes}>
                {formatFileSize(item.beforeSize)} → {formatFileSize(item.afterSize)}
              </span>
              <span className={styles.resultItem_reduction}>
                <span className={styles.resultItem_reductionLabel}>{t('convert.results.reduction')}</span>
                {toReductionLabel(item.beforeSize, item.afterSize)}
              </span>
              <a
                href={item.url}
                download={item.fileName}
                className={styles.resultItem_download}
                aria-label={t('convert.results.downloadLabel', { name: item.fileName })}
              >
                <span className={styles.resultItem_downloadText}>{t('convert.results.download')}</span>
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
          )
        })}
      </ul>

      {group.items.length > 1 && (
        <div className={styles.resultGroup_footer}>
          <BaseButton
            size="large"
            className={styles.resultGroup_downloadAll}
            ariaLabel={t('convert.results.downloadAllLabel', { at })}
            isDisabled={isZipping}
            onClick={() => {
              void handleClickDownloadAll()
            }}
            rightElm={<span aria-hidden="true">↓</span>}
          >
            {t('convert.results.downloadAll')}
          </BaseButton>
          {isZipFailed && (
            <p role="alert" className={styles.resultGroup_zipFailed}>
              {t('convert.results.zipFailed')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
