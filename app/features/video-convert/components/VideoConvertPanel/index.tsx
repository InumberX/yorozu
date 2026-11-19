import { getCollectionProps, getFormProps, getInputProps, getSelectProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

import { InputRadioCard } from '~/components/ui/forms/InputRadioCard'
import { InputRange } from '~/components/ui/forms/InputRange'
import { InputSelect } from '~/components/ui/forms/InputSelect'
import { ConvertFileList, ConvertFileListItem } from '~/features/file-convert/components/ConvertFileList'
import { ConvertPanel } from '~/features/file-convert/components/ConvertPanel'
import { ConvertResults } from '~/features/file-convert/components/ConvertResults'
import { FileThumbnail } from '~/features/file-convert/components/FileThumbnail'
import { useVideoConvert } from '~/features/video-convert/hooks/use-video-convert'
import { MAX_DURATION_MINUTES, MAX_FILE_SIZE_LABEL } from '~/features/video-convert/limits'
import { createVideoConvertSchema, DEFAULT_QUALITY, VIDEO_ACCEPT } from '~/features/video-convert/schema'
import {
  VIDEO_CODECS,
  VIDEO_QUALITY_LEVELS,
  VIDEO_RESOLUTIONS,
  type VideoCodec,
  type VideoConvertOptions,
  type VideoQualityLevel,
  type VideoResolution,
} from '~/features/video-convert/types'
import { CODEC_LABELS, toSettingLabel, toVideoMetaLabel } from '~/features/video-convert/utils/video-label'
import { loadVideoThumbnail, type VideoThumbnailMeta } from '~/features/video-convert/utils/video-thumbnail'

const FORM_ID = 'video-convert-form'

// 解像度の選択肢に出す大きさ（横長のときの幅 × 高さ）
const RESOLUTION_SIZES: Record<Exclude<VideoResolution, 'original'>, string> = {
  1080: '1920 × 1080',
  720: '1280 × 720',
  480: '854 × 480',
}

// 変換には WebCodecs の VideoEncoder を使う。prerender の描画中は、対応しているものとして描く。
const subscribeNothing = () => () => undefined
const getIsSupported = () => typeof VideoEncoder !== 'undefined' && typeof VideoDecoder !== 'undefined'
const getIsSupportedOnServer = () => true

const pick = <T extends string | number>(values: readonly T[], value: unknown, fallback: T): T =>
  values.find((candidate) => String(candidate) === String(value)) ?? fallback

// 動画変換の操作。読み込む → 指定する → 変換する の 3 つの手順と、変換結果。
export const VideoConvertPanel = () => {
  const { t } = useTranslation('pages/YZ30_100')
  const { status, progress, groups, convert, cancel, clearDone, removeGroup } = useVideoConvert()
  const [files, setFiles] = useState<File[]>([])
  const isSupported = useSyncExternalStore(subscribeNothing, getIsSupported, getIsSupportedOnServer)

  // 読み込んだ動画の長さ（秒）。見本を作ったときにわかる。
  // 検証のときにだけ読み、描画には使わないので、変えても描き直さない入れ物（同じ WeakMap）に入れておく
  const [durations] = useState(() => new WeakMap<File, number>())

  // 言語が変わったら、エラーの文言もその言語で作り直す
  const schema = useMemo(() => createVideoConvertSchema(t, (file) => durations.get(file)), [t, durations])

  const [form, fields] = useForm({
    id: FORM_ID,
    defaultValue: {
      codec: 'vp9',
      quality: String(DEFAULT_QUALITY),
      resolution: 'original',
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
      const { files: validatedFiles, codec, quality, resolution } = submission.value
      void convert(validatedFiles, { codec, quality: quality as VideoQualityLevel, resolution })
    },
  })

  const isConverting = status === 'converting'
  const options: VideoConvertOptions = {
    codec: pick<VideoCodec>(VIDEO_CODECS, fields.codec.value, 'vp9'),
    quality: pick<VideoQualityLevel>(VIDEO_QUALITY_LEVELS, fields.quality.value, DEFAULT_QUALITY),
    resolution: pick<VideoResolution>(VIDEO_RESOLUTIONS, fields.resolution.value, 'original'),
  }

  const handleChangeFiles = (next: File[]) => {
    setFiles(next)
    clearDone()
  }

  // 長さがわかったら、ファイルをもう一度検証する（上限を超えていれば、一覧にエラーが出て変換できなくなる）。
  // 長さがわからないとき（NaN・Infinity）は入れず、Worker で確かめる。
  // 変換中は検証しない。変換中は入力が disabled になり FormData にファイルが入らないため、
  // 検証すると「ファイルを読み込んでください。」になってしまう。変換が終わってから検証する。
  const isRevalidatePendingRef = useRef(false)
  const handleLoadMeta = (file: File, meta: VideoThumbnailMeta) => {
    if (!Number.isFinite(meta.duration)) {
      return
    }
    durations.set(file, meta.duration)
    if (isConverting) {
      isRevalidatePendingRef.current = true
      return
    }
    form.validate({ name: fields.files.name })
  }

  useEffect(() => {
    if (isConverting || !isRevalidatePendingRef.current) {
      return
    }
    isRevalidatePendingRef.current = false
    form.validate({ name: fields.files.name })
  }, [isConverting, form, fields.files.name])

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
        accept={VIDEO_ACCEPT}
        acceptLabel={t('form.files.accept')}
        limitLabel={t('form.files.limit', { minutes: MAX_DURATION_MINUTES, size: MAX_FILE_SIZE_LABEL })}
        fileListElm={
          <ConvertFileList>
            {files.map((file, index) => (
              <VideoFileListItem
                key={`${file.name}-${file.size}-${file.lastModified}`}
                file={file}
                // ファイルごとのエラー（files[0] など）
                errors={fields.files.allErrors[`${fields.files.name}[${index}]`]}
                isDisabled={isConverting}
                onLoadMeta={(meta) => handleLoadMeta(file, meta)}
                onRemove={() => handleChangeFiles(files.filter((_, i) => i !== index))}
              />
            ))}
          </ConvertFileList>
        }
        optionsElm={
          <>
            <InputRadioCard
              id={fields.codec.id}
              inputProps={getCollectionProps(fields.codec, {
                type: 'radio',
                options: [...VIDEO_CODECS],
              })}
              options={[
                { label: t('form.codec.vp9'), note: t('form.codec.vp9Note') },
                { label: t('form.codec.vp8'), note: t('form.codec.vp8Note') },
              ]}
              legend={t('form.codec.legend')}
              errors={fields.codec.errors}
              isDisabled={isConverting}
              onChange={clearDone}
            />
            <InputRange
              inputProps={getInputProps(fields.quality, { type: 'range' })}
              errors={fields.quality.errors}
              label={t('form.quality.label')}
              minLabel={t('form.quality.low')}
              maxLabel={t('form.quality.high')}
              formatValue={(value) => t(`form.quality.levels.${value}`)}
              isDisabled={isConverting}
              onChange={clearDone}
            />
            <InputSelect
              selectProps={getSelectProps(fields.resolution)}
              errors={fields.resolution.errors}
              label={t('form.resolution.label')}
              options={VIDEO_RESOLUTIONS.map((resolution) => ({
                value: resolution,
                label: resolution === 'original' ? t('form.resolution.original') : RESOLUTION_SIZES[resolution],
              }))}
              helperText={t('form.resolution.helper')}
              isDisabled={isConverting}
              onChange={clearDone}
            />
          </>
        }
        settingLabel={toSettingLabel(t, options)}
        runNote={t('convert.runNote')}
        unavailableMessage={isSupported ? undefined : t('form.unsupported')}
        onCancel={cancel}
      />

      {groups.length > 0 && (
        <ConvertResults
          groups={groups}
          onRemoveGroup={removeGroup}
          getSettingLabel={(groupOptions) => toSettingLabel(t, groupOptions)}
          renderThumbnail={(item) => <FileThumbnail file={item.blob} load={loadVideoThumbnail} icon="video" />}
          getFailureReason={(code, groupOptions) =>
            t(`results.errors.${code}`, {
              defaultValue: '',
              minutes: MAX_DURATION_MINUTES,
              codec: CODEC_LABELS[groupOptions.codec],
            }) || undefined
          }
          getWarningLabel={(code) => t(`results.warnings.${code}`, { defaultValue: '' }) || undefined}
          zipNamePrefix="yorozu-videos"
          logLabel="video-convert"
        />
      )}
    </>
  )
}

type VideoFileListItemProps = {
  file: File
  errors?: string[]
  isDisabled?: boolean
  onLoadMeta: (meta: VideoThumbnailMeta) => void
  onRemove: () => void
}

// 読み込んだ動画の 1 件。見本を描けたら、大きさ（px）と長さも出す。
const VideoFileListItem = ({ file, errors, isDisabled, onLoadMeta, onRemove }: VideoFileListItemProps) => {
  const [meta, setMeta] = useState<VideoThumbnailMeta | undefined>(undefined)

  const handleLoad = (loaded: VideoThumbnailMeta) => {
    setMeta(loaded)
    onLoadMeta(loaded)
  }

  return (
    <ConvertFileListItem
      name={file.name}
      meta={toVideoMetaLabel({ width: meta?.width, height: meta?.height, duration: meta?.duration, size: file.size })}
      thumbnailElm={<FileThumbnail file={file} load={loadVideoThumbnail} icon="video" onLoad={handleLoad} />}
      errors={errors}
      isDisabled={isDisabled}
      onRemove={onRemove}
    />
  )
}
