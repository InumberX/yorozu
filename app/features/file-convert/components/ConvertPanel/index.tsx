import { type getFormProps, type getInputProps } from '@conform-to/react'
import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { InputFileDrop } from '~/components/ui/forms/InputFileDrop'
import { BasePanel } from '~/components/ui/panels/BasePanel'
import { StepTitle } from '~/components/ui/typographies/StepTitle'
import type { ConvertStatus } from '~/features/file-convert/types'

export type ConvertPanelProps = {
  // `getFormProps(form)` の戻り値
  formProps: ReturnType<typeof getFormProps>
  status: ConvertStatus
  progress: number

  // 1. 読み込む
  // `getInputProps(fields.files, { type: 'file' })` の戻り値
  fileInputProps: ReturnType<typeof getInputProps>
  fileErrors?: string[]
  files: File[]
  onChangeFiles: (files: File[]) => void
  // input の accept（例: image/png,image/jpeg）
  accept: string
  // 読み込める形式の表示（例: PNG / JPEG）
  acceptLabel: string
  // 上限の表示（例: 1ファイル 20MB まで）
  limitLabel: string
  // 読み込んだファイルの一覧（ConvertFileList）
  fileList: ReactNode

  // 2. 指定する
  options: ReactNode

  // 3. 変換する
  // 変換の設定を 1 行で表す（例: WebP / 品質 80）
  settingLabel: string
  // 変換しているあいだに出す注意
  runNote: string
  onCancel: () => void
}

// 変換の操作。読み込む → 指定する → 変換する の 3 つの手順を、画像・動画で同じ形に並べる。
export const ConvertPanel = ({
  formProps,
  status,
  progress,
  fileInputProps,
  fileErrors,
  files,
  onChangeFiles,
  accept,
  acceptLabel,
  limitLabel,
  fileList,
  options,
  settingLabel,
  runNote,
  onCancel,
}: ConvertPanelProps) => {
  const { t } = useTranslation('common')
  const isConverting = status === 'converting'
  const hasFiles = files.length > 0
  const progressLabelId = `${formProps.id}-progress`

  return (
    <form {...formProps} className={styles.convertPanel}>
      <BasePanel className={styles.convertPanel_panel}>
        <div className={styles.convertPanel_steps}>
          <section className={styles.convertPanel_step}>
            <StepTitle
              step={1}
              title={t('convert.steps.load')}
              actionElm={
                hasFiles && (
                  <button
                    type="button"
                    className={styles.convertPanel_reset}
                    disabled={isConverting}
                    onClick={() => onChangeFiles([])}
                  >
                    {t('convert.reset')}
                  </button>
                )
              }
            />
            <InputFileDrop
              inputProps={fileInputProps}
              // ファイルがないときは「変換する」が押せないので、読み込むよう求めるエラーは出さない
              // （リセットや最後の 1 件の削除のあとに、エラーが出たままにならないように）
              errors={hasFiles ? fileErrors : undefined}
              files={files}
              onChangeFiles={onChangeFiles}
              accept={accept}
              helperText={
                <>
                  <span lang="en" className={styles.convertPanel_accept}>
                    {acceptLabel}
                  </span>
                  <br />
                  {limitLabel}
                </>
              }
              isDisabled={isConverting}
            >
              {fileList}
            </InputFileDrop>
          </section>

          <section className={styles.convertPanel_step}>
            <StepTitle step={2} title={t('convert.steps.options')} />
            <div className={styles.convertPanel_options}>{options}</div>
          </section>

          <section className={styles.convertPanel_step} aria-live="polite">
            <StepTitle step={3} title={t('convert.steps.convert')} />
            {isConverting ? (
              <div className={styles.convertPanel_running}>
                <div className={styles.convertPanel_progressHeader}>
                  <span id={progressLabelId} className={styles.convertPanel_progressLabel}>
                    {t('convert.running')}
                  </span>
                  <span className={styles.convertPanel_progressValue}>{progress}%</span>
                </div>
                <progress
                  className={styles.convertPanel_progress}
                  aria-labelledby={progressLabelId}
                  max={100}
                  value={progress}
                />
                <p className={styles.convertPanel_note}>{runNote}</p>
                <BaseButton variant="outlined" size="medium" className={styles.convertPanel_cancel} onClick={onCancel}>
                  {t('convert.cancel')}
                </BaseButton>
              </div>
            ) : (
              <div className={styles.convertPanel_ready}>
                {status === 'done' && <p className={styles.convertPanel_done}>{t('convert.done')}</p>}
                {hasFiles ? (
                  <p className={styles.convertPanel_summary}>
                    {t('convert.count', { count: files.length })}
                    <br />
                    <span className={styles.convertPanel_summaryOutput}>→ {settingLabel}</span>
                  </p>
                ) : (
                  <p className={styles.convertPanel_summary}>{t('convert.needFile')}</p>
                )}
                <BaseButton
                  buttonType="submit"
                  size="large"
                  className={styles.convertPanel_run}
                  isDisabled={!hasFiles}
                  rightElm={<span aria-hidden="true">→</span>}
                >
                  {t('convert.run')}
                </BaseButton>
              </div>
            )}
          </section>
        </div>
      </BasePanel>
    </form>
  )
}
