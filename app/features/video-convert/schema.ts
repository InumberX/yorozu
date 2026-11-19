import { type TFunction } from 'i18next'
import { z } from 'zod'

import {
  MAX_DURATION_MINUTES,
  MAX_DURATION_SECONDS,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
} from '~/features/video-convert/limits'
import { VIDEO_CODECS, VIDEO_QUALITY_LEVELS, VIDEO_RESOLUTIONS } from '~/features/video-convert/types'

// 読み込める動画の種類（MP4 / MOV）
export const VIDEO_ACCEPT_TYPES = ['video/mp4', 'video/quicktime'] as const
export const VIDEO_ACCEPT = VIDEO_ACCEPT_TYPES.join(',')

export const DEFAULT_QUALITY = 3

// getDuration は、読み込んだ動画の長さ（秒）を返す。長さは見本を作るときにわかるため、わかるまでは undefined。
// わかっていて上限を超えるものは、形式や大きさと同じく、エラーにして変換させない。
// わからないもの（このブラウザで再生できず、見本を作れなかったもの）は、Worker で確かめる。
export const createVideoConvertSchema = (
  t: TFunction<'pages/YZ30_100'>,
  getDuration: (file: File) => number | undefined = () => undefined
) =>
  z.object({
    files: z
      .array(
        z
          .file()
          .mime([...VIDEO_ACCEPT_TYPES], { error: t('form.files.errors.type') })
          .max(MAX_FILE_SIZE, { error: t('form.files.errors.size', { size: MAX_FILE_SIZE_LABEL }) })
          .refine((file) => (getDuration(file) ?? 0) <= MAX_DURATION_SECONDS, {
            error: t('form.files.errors.duration', { minutes: MAX_DURATION_MINUTES }),
          })
      )
      .min(1, { error: t('form.files.errors.required') }),
    codec: z.enum(VIDEO_CODECS),
    quality: z
      .number()
      .int()
      .min(VIDEO_QUALITY_LEVELS[0])
      .max(VIDEO_QUALITY_LEVELS[VIDEO_QUALITY_LEVELS.length - 1]),
    resolution: z.enum(VIDEO_RESOLUTIONS),
  })

export type VideoConvertSchema = z.infer<ReturnType<typeof createVideoConvertSchema>>
