import { Zip, ZipPassThrough } from 'fflate'

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

// 1 回に読む大きさ。動画は 1 件で数十 MB になるため、ファイルを丸ごと読まずに区切って流し込む。
const CHUNK_SIZE = 8 * 1024 * 1024

// ファイルを ZIP にまとめる。画像や動画はすでに圧縮されているので、まとめるだけにする（圧縮しない）。
// 元の Blob のほかに、ZIP の中身として全ファイル 1 つ分がメモリに載る（できあがった ZIP の Blob になる）。
// 全ファイルを先に読み込むと、さらにもう 1 つ分載るため、1 ファイルずつ CHUNK_SIZE ごとに読んで流し込む。
export const createZip = (entries: ZipEntry[]): Promise<Blob> =>
  new Promise<Blob>((resolve, reject) => {
    const parts: Uint8Array[] = []
    const zip = new Zip((error, data, isFinal) => {
      if (error) {
        reject(error)
        return
      }
      parts.push(data)
      if (isFinal) {
        resolve(new Blob(parts as BlobPart[], { type: 'application/zip' }))
      }
    })

    const write = async () => {
      for (const entry of entries) {
        const file = new ZipPassThrough(entry.name)
        zip.add(file)
        for (let start = 0; start < entry.blob.size; start = start + CHUNK_SIZE) {
          const chunk = new Uint8Array(await entry.blob.slice(start, start + CHUNK_SIZE).arrayBuffer())
          file.push(chunk)
        }
        file.push(new Uint8Array(0), true)
      }
      zip.end()
    }

    write().catch(reject)
  })
