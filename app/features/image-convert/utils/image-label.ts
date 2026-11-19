import { type TFunction } from 'i18next'

import { toFileTypeLabel } from '~/features/file-convert/utils/convert-label'
import { type ImageOutputFormat } from '~/features/image-convert/types'
import { formatFileSize } from '~/utils/file'

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
  [width && height ? `${width}×${height}` : undefined, formatFileSize(size), toFileTypeLabel(type)]
    .filter(Boolean)
    .join(' · ')

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
