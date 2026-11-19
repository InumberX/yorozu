import { getCollectionProps, getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { InputCheckbox } from '~/components/ui/forms/InputCheckbox'
import { InputFileDrop } from '~/components/ui/forms/InputFileDrop'
import { InputRadioCard } from '~/components/ui/forms/InputRadioCard'
import { InputRange } from '~/components/ui/forms/InputRange'
import { BasePanel } from '~/components/ui/panels/BasePanel'
import { StepTitle } from '~/components/ui/typographies/StepTitle'
import { ImageConvertResults } from '~/features/image-convert/components/ImageConvertResults'
import { ImageFileList } from '~/features/image-convert/components/ImageFileList'
import { useImageConvert } from '~/features/image-convert/hooks/use-image-convert'
import {
  createImageConvertSchema,
  DEFAULT_QUALITY,
  IMAGE_ACCEPT,
  MAX_FILE_SIZE_LABEL,
} from '~/features/image-convert/schema'
import { IMAGE_OUTPUT_FORMATS, type ImageOutputFormat } from '~/features/image-convert/types'
import { toSettingLabel } from '~/features/image-convert/utils/image-label'

const FORM_ID = 'image-convert-form'

// 画像変換の操作。読み込む → 指定する → 変換する の 3 つの手順と、変換結果。
export const ImageConvertPanel = () => {
  const { t } = useTranslation('pages/YZ20_100')
  const { status, progress, groups, convert, cancel, clearDone, removeGroup } = useImageConvert()
  const [files, setFiles] = useState<File[]>([])

  // 言語が変わったら、エラーの文言もその言語で作り直す
  const schema = useMemo(() => createImageConvertSchema(t), [t])

  const [form, fields] = useForm({
    id: FORM_ID,
    defaultValue: {
      format: 'webp',
      quality: String(DEFAULT_QUALITY),
    },
    constraint: getZodConstraint(schema),
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    onSubmit: (event, { submission }) => {
      // 変換はブラウザの中で行う。フォームは送らない
      event.preventDefault()
      if (submission?.status !== 'success') {
        return
      }
      // 検証したものと同じファイルを変換する（一覧の state ではなく、フォームの値を使う）
      const { files: validatedFiles, format, quality, lossless } = submission.value
      void convert(validatedFiles, { format, quality: quality ?? DEFAULT_QUALITY, lossless: !!lossless })
    },
  })

  const isConverting = status === 'converting'
  const hasFiles = files.length > 0
  const isLossless = fields.lossless.value === 'on'
  const format = (IMAGE_OUTPUT_FORMATS as readonly string[]).includes(String(fields.format.value))
    ? (fields.format.value as ImageOutputFormat)
    : 'webp'
  const quality = Number(fields.quality.value ?? DEFAULT_QUALITY)

  // ファイルごとのエラー（files[0] など）を、一覧の並びにそろえる
  const fileErrors = files.map((_, index) => fields.files.allErrors[`${fields.files.name}[${index}]`])

  const handleChangeFiles = (next: File[]) => {
    setFiles(next)
    clearDone()
  }

  return (
    <>
      <form {...getFormProps(form)} className={styles.imageConvertPanel}>
        <BasePanel className={styles.imageConvertPanel_panel}>
          <div className={styles.imageConvertPanel_steps}>
            <section className={styles.imageConvertPanel_step}>
              <StepTitle
                step={1}
                title={t('steps.load')}
                actionElm={
                  hasFiles && (
                    <button
                      type="button"
                      className={styles.imageConvertPanel_reset}
                      disabled={isConverting}
                      onClick={() => handleChangeFiles([])}
                    >
                      {t('form.reset')}
                    </button>
                  )
                }
              />
              <InputFileDrop
                inputProps={getInputProps(fields.files, { type: 'file' })}
                // ファイルがないときは「変換する」が押せないので、読み込むよう求めるエラーは出さない
                // （リセットや最後の 1 件の削除のあとに、エラーが出たままにならないように）
                errors={hasFiles ? fields.files.errors : undefined}
                files={files}
                onChangeFiles={handleChangeFiles}
                accept={IMAGE_ACCEPT}
                helperText={
                  <>
                    <span lang="en" className={styles.imageConvertPanel_accept}>
                      {t('form.files.accept')}
                    </span>
                    <br />
                    {t('form.files.limit', { size: MAX_FILE_SIZE_LABEL })}
                  </>
                }
                isDisabled={isConverting}
              >
                <ImageFileList
                  files={files}
                  errors={fileErrors}
                  isDisabled={isConverting}
                  onRemove={(index) => handleChangeFiles(files.filter((_, i) => i !== index))}
                />
              </InputFileDrop>
            </section>

            <section className={styles.imageConvertPanel_step}>
              <StepTitle step={2} title={t('steps.options')} />
              <div className={styles.imageConvertPanel_options}>
                <InputRadioCard
                  id={fields.format.id}
                  inputProps={getCollectionProps(fields.format, {
                    type: 'radio',
                    options: [...IMAGE_OUTPUT_FORMATS],
                  })}
                  options={[
                    { label: t('form.format.webp'), note: t('form.format.webpNote') },
                    { label: t('form.format.avif'), note: t('form.format.avifNote') },
                  ]}
                  legend={t('form.format.legend')}
                  errors={fields.format.errors}
                  isDisabled={isConverting}
                  onChange={clearDone}
                />
                <InputRange
                  inputProps={getInputProps(fields.quality, { type: 'range' })}
                  errors={fields.quality.errors}
                  label={t('form.quality.label')}
                  minLabel={t('form.quality.low')}
                  maxLabel={t('form.quality.high')}
                  isDisabled={isConverting || isLossless}
                  onChange={clearDone}
                />
                <InputCheckbox
                  inputProps={getInputProps(fields.lossless, { type: 'checkbox' })}
                  errors={fields.lossless.errors}
                  label={t('form.lossless')}
                  isDisabled={isConverting}
                  onChange={clearDone}
                />
              </div>
            </section>

            <section className={styles.imageConvertPanel_step} aria-live="polite">
              <StepTitle step={3} title={t('steps.convert')} />
              {isConverting ? (
                <div className={styles.imageConvertPanel_running}>
                  <div className={styles.imageConvertPanel_progressHeader}>
                    <span id={`${FORM_ID}-progress`} className={styles.imageConvertPanel_progressLabel}>
                      {t('convert.running')}
                    </span>
                    <span className={styles.imageConvertPanel_progressValue}>{progress}%</span>
                  </div>
                  <progress
                    className={styles.imageConvertPanel_progress}
                    aria-labelledby={`${FORM_ID}-progress`}
                    max={100}
                    value={progress}
                  />
                  <p className={styles.imageConvertPanel_note}>{t('convert.runNote')}</p>
                  <BaseButton
                    variant="outlined"
                    size="medium"
                    className={styles.imageConvertPanel_cancel}
                    onClick={cancel}
                  >
                    {t('convert.cancel')}
                  </BaseButton>
                </div>
              ) : (
                <div className={styles.imageConvertPanel_ready}>
                  {status === 'done' && <p className={styles.imageConvertPanel_done}>{t('convert.done')}</p>}
                  {hasFiles ? (
                    <p className={styles.imageConvertPanel_summary}>
                      {t('convert.count', { count: files.length })}
                      <br />
                      <span className={styles.imageConvertPanel_summaryOutput}>
                        → {toSettingLabel(t, { format, quality, lossless: isLossless })}
                      </span>
                    </p>
                  ) : (
                    <p className={styles.imageConvertPanel_summary}>{t('convert.needFile')}</p>
                  )}
                  <BaseButton
                    buttonType="submit"
                    size="large"
                    className={styles.imageConvertPanel_run}
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

      {groups.length > 0 && <ImageConvertResults groups={groups} onRemoveGroup={removeGroup} />}
    </>
  )
}
