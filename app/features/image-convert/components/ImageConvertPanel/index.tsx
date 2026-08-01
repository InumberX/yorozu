import { useMemo, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { useImageConvert } from '~/features/image-convert/hooks/useImageConvert'
import { type ImageOutputFormat } from '~/features/image-convert/types'

export const ImageConvertPanel = () => {
  const { t } = useTranslation('pages/YZ20_100')
  const { status, progress, error, convert } = useImageConvert()

  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<ImageOutputFormat>('webp')
  const [quality, setQuality] = useState(80)

  const isConverting = status === 'converting'

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null)
  }

  const onSubmit = () => {
    if (!file) {
      return
    }
    convert(file, { format, quality })
  }

  const formats: ImageOutputFormat[] = useMemo(() => ['webp', 'avif'], [])

  return (
    <div className={styles.panel}>
      <label className={styles.dropzone}>
        <input type="file" accept="image/*" className={styles.dropzone_input} onChange={onFileChange} />
        <span className={styles.dropzone_label}>{file ? file.name : t('form.dropzone.label')}</span>
        <span className={styles.dropzone_hint}>{t('form.dropzone.hint')}</span>
      </label>

      <div className={styles.options}>
        <div className={styles.field}>
          <span className={styles.field_label}>{t('form.format.label')}</span>
          <div className={styles.formatList}>
            {formats.map((value) => (
              <label key={value} className={styles.formatItem}>
                <input
                  type="radio"
                  name="format"
                  value={value}
                  checked={format === value}
                  onChange={() => setFormat(value)}
                />
                <span>{t(`form.format.${value}`)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.field_label}>
            {t('form.quality.label')}（{quality}）
          </span>
          <input
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
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
