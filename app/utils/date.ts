import { toTwoDigits } from '~/utils/to-two-digits'

// 日時を「2026/11/19 12:34」の形で表す（端末の時刻で）。
export const formatDateTime = (date: Date): string =>
  `${date.getFullYear()}/${toTwoDigits(date.getMonth() + 1)}/${toTwoDigits(date.getDate())} ${toTwoDigits(
    date.getHours()
  )}:${toTwoDigits(date.getMinutes())}`

// ファイル名に使える日時（例: 20261119-1234）
export const formatDateTimeForFileName = (date: Date): string =>
  `${date.getFullYear()}${toTwoDigits(date.getMonth() + 1)}${toTwoDigits(date.getDate())}-${toTwoDigits(
    date.getHours()
  )}${toTwoDigits(date.getMinutes())}`
