// 拡張子を出力形式のものに変える。同じ回の中で名前がぶつかるときは「-2」などを付ける。
export const toOutputFileName = (sourceName: string, extension: string, usedNames: Set<string>) => {
  const dotIndex = sourceName.lastIndexOf('.')
  const base = dotIndex > 0 ? sourceName.slice(0, dotIndex) : sourceName

  let name = `${base}.${extension}`
  for (let i = 2; usedNames.has(name); i = i + 1) {
    name = `${base}-${i}.${extension}`
  }
  usedNames.add(name)

  return name
}

// 変換でどれだけ小さくなったか（例: -88%）。大きくなったときは「+」を付ける。
export const toReductionLabel = (beforeSize: number, afterSize: number): string => {
  if (beforeSize <= 0) {
    return ''
  }
  const rate = Math.round((afterSize / beforeSize - 1) * 100)
  return rate > 0 ? `+${rate}%` : `${rate === 0 ? '±' : ''}${rate}%`
}

// ファイルの種類を、表示用の短い名前にする（image/png → PNG、video/quicktime → MOV）。
export const toFileTypeLabel = (mimeType: string): string => {
  const subtype = mimeType.split('/')[1] ?? ''
  if (subtype === 'quicktime') {
    return 'MOV'
  }
  return subtype.toUpperCase()
}
