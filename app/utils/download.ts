import { zip } from 'fflate'

// Blob をファイルとして保存させる。
export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  // クリックした直後に解放すると、ブラウザによっては保存が始まらないため少し待つ
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export type ZipEntry = {
  name: string
  blob: Blob
}

// ファイルを ZIP にまとめる。画像はすでに圧縮されているので、まとめるだけにして（level 0）速くする。
export const createZip = async (entries: ZipEntry[]): Promise<Blob> => {
  const files: Record<string, [Uint8Array, { level: 0 }]> = {}

  for (const entry of entries) {
    files[entry.name] = [new Uint8Array(await entry.blob.arrayBuffer()), { level: 0 }]
  }

  const data = await new Promise<Uint8Array>((resolve, reject) => {
    zip(files, (error, result) => {
      if (error) {
        reject(error)
        return
      }
      resolve(result)
    })
  })

  return new Blob([data as BlobPart], { type: 'application/zip' })
}
