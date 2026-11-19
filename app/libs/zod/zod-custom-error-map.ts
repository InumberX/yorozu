import { type TFunction } from 'i18next'
import type * as zod from 'zod'

import { formatFileSize } from '~/utils/file'

// zod の既定のエラーメッセージ（英語）を、画面の言語の文言に置き換える。
// 文言は common.json の `validation` にある。スキーマ側で個別に `error` を書いたものは、そちらが優先される。
export const createZodCustomErrorMap =
  (t: TFunction<'common'>): zod.core.$ZodErrorMap =>
  (issue) => {
    switch (issue.code) {
      case 'invalid_type':
        if (issue.input === undefined || issue.input === null || issue.input === '') {
          return t('validation.required')
        }
        return t('validation.invalidType')

      case 'too_small':
        switch (issue.origin) {
          case 'array':
          case 'set':
            return t('validation.tooSmall.array', { count: Number(issue.minimum) })
          case 'string':
            return t('validation.tooSmall.string', { count: Number(issue.minimum) })
          case 'number':
          case 'int':
            return t('validation.tooSmall.number', { minimum: Number(issue.minimum) })
          case 'file':
            return t('validation.tooSmall.file', { size: formatFileSize(Number(issue.minimum)) })
          default:
            return t('validation.invalid')
        }

      case 'too_big':
        switch (issue.origin) {
          case 'array':
          case 'set':
            return t('validation.tooBig.array', { count: Number(issue.maximum) })
          case 'string':
            return t('validation.tooBig.string', { count: Number(issue.maximum) })
          case 'number':
          case 'int':
            return t('validation.tooBig.number', { maximum: Number(issue.maximum) })
          case 'file':
            return t('validation.tooBig.file', { size: formatFileSize(Number(issue.maximum)) })
          default:
            return t('validation.invalid')
        }

      case 'invalid_value':
        return t('validation.invalidValue')

      case 'not_multiple_of':
        return t('validation.notMultipleOf', { divisor: Number(issue.divisor) })

      default:
        return t('validation.invalid')
    }
  }
