import { type TFunction } from 'i18next'
import { z } from 'zod'

import { IMAGE_OUTPUT_FORMATS } from '~/features/image-convert/types'
import { formatFileSize } from '~/utils/file'

// 読み込める画像の種類。GIF / BMP は今は読み込まない。
export const IMAGE_ACCEPT_TYPES = ['image/png', 'image/jpeg'] as const
export const IMAGE_ACCEPT = IMAGE_ACCEPT_TYPES.join(',')

// 1 ファイルの上限。大きすぎる画像は、変換の途中でメモリが足りなくなるため。
export const MAX_FILE_SIZE = 50 * 1024 * 1024
export const MAX_FILE_SIZE_LABEL = formatFileSize(MAX_FILE_SIZE)

export const DEFAULT_QUALITY = 80

export const createImageConvertSchema = (t: TFunction<'pages/YZ20_100'>) =>
  z.object({
    files: z
      .array(
        z
          .file()
          .mime([...IMAGE_ACCEPT_TYPES], { error: t('form.files.errors.type') })
          .max(MAX_FILE_SIZE, { error: t('form.files.errors.size', { size: MAX_FILE_SIZE_LABEL }) })
      )
      .min(1, { error: t('form.files.errors.required') }),
    format: z.enum(IMAGE_OUTPUT_FORMATS),
    // ロスレスのときはスライダーが無効になり、値が送られない
    quality: z.number().int().min(1).max(100).optional(),
    lossless: z.boolean().optional(),
  })

export type ImageConvertSchema = z.infer<ReturnType<typeof createImageConvertSchema>>
