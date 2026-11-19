// ファイルの入力で共通に使う処理。

// `accept` 属性（`image/png,.jpg,image/*` など）にファイルが合うかを判定する。
// `accept` は「ファイルを選択」のダイアログにしか効かないため、ドロップされたファイルはこれで確かめる。
export const isAcceptedFile = (file: File, accept?: string): boolean => {
  const patterns = (accept ?? '')
    .split(',')
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean)

  if (patterns.length === 0) {
    return true
  }

  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) {
      return fileName.endsWith(pattern)
    }

    if (pattern.endsWith('/*')) {
      return fileType !== '' && fileType.startsWith(pattern.slice(0, -1))
    }

    return fileType === pattern
  })
}

// 同じファイルを二重に読み込まないための判定。名前・大きさ・更新日時がそろえば同じものと見なす。
export const isSameFile = (a: File, b: File): boolean =>
  a.name === b.name && a.size === b.size && a.lastModified === b.lastModified

// 今のファイルの一覧に、新しく選んだファイルを足す。すでにあるものは足さない。
export const mergeFiles = (current: File[], added: File[]): File[] => {
  const result = [...current]

  for (const file of added) {
    if (!result.some((item) => isSameFile(item, file))) {
      result.push(file)
    }
  }

  return result
}

// ファイルの入力（input[type="file"]）の中身を、渡したファイルの一覧に置き換える。
// 入力の FileList は直接作れないため DataTransfer を経由する（Conform も内部で同じ方法を使う）。
// 置き換えられなかったとき（DataTransfer のない環境）は false を返す。
export const setInputFiles = (input: HTMLInputElement, files: File[]): boolean => {
  if (typeof DataTransfer === 'undefined') {
    return false
  }

  try {
    const dataTransfer = new DataTransfer()
    for (const file of files) {
      dataTransfer.items.add(file)
    }
    input.files = dataTransfer.files
    return true
  } catch {
    return false
  }
}

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const

// ファイルの大きさを、読みやすい単位で表す（例: 4.2MB）。
export const formatFileSize = (bytes: number): string => {
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < FILE_SIZE_UNITS.length - 1) {
    size = size / 1024
    unitIndex = unitIndex + 1
  }

  const rounded = unitIndex === 0 || size >= 100 ? Math.round(size) : Math.round(size * 10) / 10

  return `${rounded}${FILE_SIZE_UNITS[unitIndex]}`
}
