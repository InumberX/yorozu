import type { FileThumbnailLoadResult } from '~/features/file-convert/components/FileThumbnail'

export type ImageThumbnailMeta = {
  width: number
  height: number
}

// 画像の見本を作る。元の大きさを知るために一度展開し、短い辺を side に縮めた bitmap を作ったら、すぐに閉じる。
// はみ出た分は FileThumbnail が切り落とす（object-fit: cover と同じ）。
export const loadImageThumbnail = async (
  file: Blob,
  side: number
): Promise<FileThumbnailLoadResult<ImageThumbnailMeta>> => {
  const original = await createImageBitmap(file)
  const { width, height } = original
  const bitmap = await createImageBitmap(
    original,
    width < height ? { resizeWidth: side, resizeQuality: 'medium' } : { resizeHeight: side, resizeQuality: 'medium' }
  ).finally(() => original.close())

  return { bitmap, meta: { width, height } }
}
