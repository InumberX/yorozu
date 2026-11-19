import { getCollectionProps, getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InputCheckbox } from '~/components/ui/forms/InputCheckbox'
import { InputRadioCard } from '~/components/ui/forms/InputRadioCard'
import { InputRange } from '~/components/ui/forms/InputRange'
import { ConvertFileList, ConvertFileListItem } from '~/features/file-convert/components/ConvertFileList'
import { ConvertPanel } from '~/features/file-convert/components/ConvertPanel'
import { ConvertResults } from '~/features/file-convert/components/ConvertResults'
import { FileThumbnail } from '~/features/file-convert/components/FileThumbnail'
import { useImageConvert } from '~/features/image-convert/hooks/use-image-convert'
import {
  createImageConvertSchema,
  DEFAULT_QUALITY,
  IMAGE_ACCEPT,
  MAX_FILE_SIZE_LABEL,
} from '~/features/image-convert/schema'
import { IMAGE_OUTPUT_FORMATS, type ImageOutputFormat } from '~/features/image-convert/types'
import { toImageMetaLabel, toSettingLabel } from '~/features/image-convert/utils/image-label'
import { type ImageThumbnailMeta, loadImageThumbnail } from '~/features/image-convert/utils/image-thumbnail'

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
  const isLossless = fields.lossless.value === 'on'
  const format = (IMAGE_OUTPUT_FORMATS as readonly string[]).includes(String(fields.format.value))
    ? (fields.format.value as ImageOutputFormat)
    : 'webp'
  const quality = Number(fields.quality.value ?? DEFAULT_QUALITY)

  const handleChangeFiles = (next: File[]) => {
    setFiles(next)
    clearDone()
  }

  return (
    <>
      <ConvertPanel
        formProps={getFormProps(form)}
        status={status}
        progress={progress}
        fileInputProps={getInputProps(fields.files, { type: 'file' })}
        fileErrors={fields.files.errors}
        files={files}
        onChangeFiles={handleChangeFiles}
        accept={IMAGE_ACCEPT}
        acceptLabel={t('form.files.accept')}
        limitLabel={t('form.files.limit', { size: MAX_FILE_SIZE_LABEL })}
        fileList={
          <ConvertFileList>
            {files.map((file, index) => (
              <ImageFileListItem
                key={`${file.name}-${file.size}-${file.lastModified}`}
                file={file}
                // ファイルごとのエラー（files[0] など）
                errors={fields.files.allErrors[`${fields.files.name}[${index}]`]}
                isDisabled={isConverting}
                onRemove={() => handleChangeFiles(files.filter((_, i) => i !== index))}
              />
            ))}
          </ConvertFileList>
        }
        options={
          <>
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
          </>
        }
        settingLabel={toSettingLabel(t, { format, quality, lossless: isLossless })}
        runNote={t('convert.runNote')}
        onCancel={cancel}
      />

      {groups.length > 0 && (
        <ConvertResults
          groups={groups}
          onRemoveGroup={removeGroup}
          getSettingLabel={(options) => toSettingLabel(t, options)}
          renderThumbnail={(item) => <FileThumbnail file={item.blob} load={loadImageThumbnail} icon="image" />}
          zipNamePrefix="yorozu-images"
          logLabel="image-convert"
        />
      )}
    </>
  )
}

type ImageFileListItemProps = {
  file: File
  errors?: string[]
  isDisabled?: boolean
  onRemove: () => void
}

// 読み込んだ画像の 1 件。見本を描けたら、大きさ（px）も出す。
const ImageFileListItem = ({ file, errors, isDisabled, onRemove }: ImageFileListItemProps) => {
  const [meta, setMeta] = useState<ImageThumbnailMeta | undefined>(undefined)

  return (
    <ConvertFileListItem
      name={file.name}
      meta={toImageMetaLabel({ width: meta?.width, height: meta?.height, size: file.size, type: file.type })}
      thumbnail={<FileThumbnail file={file} load={loadImageThumbnail} icon="image" onLoad={setMeta} />}
      errors={errors}
      isDisabled={isDisabled}
      onRemove={onRemove}
    />
  )
}
