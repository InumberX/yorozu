import { useBatchConvert } from '~/features/file-convert/hooks/use-batch-convert'
import type { ImageConvertOptions } from '~/features/image-convert/types'

const createWorker = () =>
  // Vite が Worker を解決できるよう、new URL には相対パスを渡す（エイリアスは使えない）。
  new Worker(new URL('../worker/image-convert.worker.ts', import.meta.url), {
    type: 'module',
  })

// 拡張子は出力形式の名前と同じ（webp / avif）
const getExtension = (options: ImageConvertOptions) => options.format

// 画像を 1 つずつ Worker で変換する（中身は useBatchConvert）。
export const useImageConvert = () =>
  useBatchConvert<ImageConvertOptions>({ createWorker, getExtension, logLabel: 'image-convert' })
