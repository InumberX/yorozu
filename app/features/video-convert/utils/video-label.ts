import { type TFunction } from 'i18next'

import type { VideoCodec, VideoConvertOptions, VideoResolution } from '~/features/video-convert/types'
import { formatFileSize } from '~/utils/file'

const pad = (value: number) => String(value).padStart(2, '0')

// 長さを「00:42」「01:15」の形で表す。1 時間を超えるときは「1:02:03」。
export const formatDuration = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${pad(minutes)}:${pad(rest)}`
}

// ファイルの情報を「1920×1080 · 00:42 · 86.4MB」の形で表す。大きさや長さがわからないうちは省く。
export const toVideoMetaLabel = ({
  width,
  height,
  duration,
  size,
}: {
  width?: number
  height?: number
  duration?: number
  size: number
}): string =>
  [
    width && height ? `${width}×${height}` : undefined,
    duration !== undefined && Number.isFinite(duration) ? formatDuration(duration) : undefined,
    formatFileSize(size),
  ]
    .filter(Boolean)
    .join(' · ')

export const CODEC_LABELS: Record<VideoCodec, string> = {
  vp9: 'VP9',
  vp8: 'VP8',
}

// 解像度を「1080p」「元の解像度」の形で表す
export const toResolutionLabel = (t: TFunction<'pages/YZ30_100'>, resolution: VideoResolution): string =>
  resolution === 'original' ? t('form.resolution.original') : `${resolution}p`

// 変換の設定を「WebM · VP9 / 画質 標準 / 720p」の形で表す。
export const toSettingLabel = (t: TFunction<'pages/YZ30_100'>, options: VideoConvertOptions): string =>
  t('convert.setting', {
    codec: CODEC_LABELS[options.codec],
    quality: t(`form.quality.levels.${options.quality}`),
    resolution: toResolutionLabel(t, options.resolution),
  })
