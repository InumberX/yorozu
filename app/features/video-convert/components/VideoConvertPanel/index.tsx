import { useMemo, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { useVideoConvert } from '~/features/video-convert/hooks/useVideoConvert'
import { type VideoCodec } from '~/features/video-convert/types'

export const VideoConvertPanel = () => {
  const { t } = useTranslation('pages/YZ30_100')
  const { status, progress, error, convert } = useVideoConvert()

  const [file, setFile] = useState<File | null>(null)
  const [codec, setCodec] = useState<VideoCodec>('vp9')
  const [crf, setCrf] = useState(31)

  const isConverting = status === 'converting'

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null)
  }

  const onSubmit = () => {
    if (!file) {
      return
    }
    convert(file, { codec, crf })
  }

  const codecs: VideoCodec[] = useMemo(() => ['vp9', 'vp8'], [])

  return (
    <div className={styles.panel}>
      <label className={styles.dropzone}>
        <input type="file" accept="video/*" className={styles.dropzone_input} onChange={onFileChange} />
        <span className={styles.dropzone_label}>{file ? file.name : t('form.dropzone.label')}</span>
        <span className={styles.dropzone_hint}>{t('form.dropzone.hint')}</span>
      </label>

      <div className={styles.options}>
        <div className={styles.field}>
          <span className={styles.field_label}>{t('form.codec.label')}</span>
          <div className={styles.codecList}>
            {codecs.map((value) => (
              <label key={value} className={styles.codecItem}>
                <input
                  type="radio"
                  name="codec"
                  value={value}
                  checked={codec === value}
                  onChange={() => setCodec(value)}
                />
                <span>{t(`form.codec.${value}`)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.field_label}>
            {t('form.quality.label')}（{crf}）
          </span>
          <input
            type="range"
            min={0}
            max={63}
            value={crf}
            onChange={(event) => setCrf(Number(event.target.value))}
            className={styles.range}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <BaseButton buttonType="button" isDisabled={!file || isConverting} onClick={onSubmit} size="large">
          {isConverting ? t('form.converting') : t('form.submit')}
        </BaseButton>
      </div>

      {isConverting && (
        <p className={styles.progress} role="status">
          {progress}%
        </p>
      )}
      {status === 'error' && error && <p className={styles.error}>{error}</p>}

      <p className={styles.note}>{t('note')}</p>
    </div>
  )
}
