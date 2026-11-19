import { type TFunction } from 'i18next'

import { type ImageOutputFormat } from '~/features/image-convert/types'
import { formatFileSize } from '~/utils/file'

// 画像の種類を、表示用の短い名前にする（image/png → PNG）。
export const toImageTypeLabel = (mimeType: string): string => {
  const subtype = mimeType.split('/')[1] ?? ''
  return subtype === '' ? '' : subtype.toUpperCase()
}

// ファイルの情報を「3024×2016 · 4.2MB · PNG」の形で表す。大きさ（px）がわからないうちは省く。
export const toImageMetaLabel = ({
  width,
  height,
  size,
  type,
}: {
  width?: number
  height?: number
  size: number
  type: string
}): string =>
  [width && height ? `${width}×${height}` : undefined, formatFileSize(size), toImageTypeLabel(type)]
    .filter(Boolean)
    .join(' · ')

// 変換でどれだけ小さくなったか（例: -88%）。大きくなったときは「+」を付ける。
export const toReductionLabel = (beforeSize: number, afterSize: number): string => {
  if (beforeSize <= 0) {
    return ''
  }
  const rate = Math.round((afterSize / beforeSize - 1) * 100)
  return rate > 0 ? `+${rate}%` : `${rate === 0 ? '±' : ''}${rate}%`
}

const FORMAT_LABELS: Record<ImageOutputFormat, string> = {
  webp: 'WebP',
  avif: 'AVIF',
}

// 変換の設定を「WebP / 品質 80」「AVIF / ロスレスで書き出す」の形で表す。
export const toSettingLabel = (
  t: TFunction<'pages/YZ20_100'>,
  options: { format: ImageOutputFormat; quality?: number; lossless?: boolean }
): string =>
  t('convert.setting', {
    format: FORMAT_LABELS[options.format],
    detail: options.lossless ? t('form.lossless') : t('convert.qualityDetail', { quality: options.quality }),
  })
