import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import * as zod from 'zod'

import { createZodCustomErrorMap } from '~/libs/zod/zod-custom-error-map'

// zod のエラーメッセージを、画面の言語にそろえる。
// 言語が変わると t が変わり、描画のたびに設定し直すので、検証はいつも今の言語の文言を返す。
export const ZodProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('common')

  zod.config({ customError: createZodCustomErrorMap(t) })

  return children
}
