// 一覧の番号（01, 02, …）や件数を、2 桁にそろえて見せる。
export const toTwoDigits = (value: number) => {
  return String(value).padStart(2, '0')
}
