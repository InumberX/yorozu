// フォームの入力の部品が共通で使う処理。

// Conform が付ける ID の決まり（`field.errorId` / `field.descriptionId`）。
// 部品は入力の props（`getInputProps` の戻り値）しか受け取らないため、入力の id から求める。
export const getErrorId = (id: string) => `${id}-error`
export const getDescriptionId = (id: string) => `${id}-description`

// aria-describedby に並べる ID をまとめる。空のものは落とす。
export const joinIds = (...ids: (string | undefined | false)[]): string | undefined => {
  const value = ids.filter(Boolean).join(' ').trim()
  return value === '' ? undefined : value
}
