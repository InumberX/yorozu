import { useBatchConvert } from '~/features/file-convert/hooks/use-batch-convert'
import type { VideoConvertOptions } from '~/features/video-convert/types'

const createWorker = () =>
  // Vite が Worker を解決できるよう、new URL には相対パスを渡す（エイリアスは使えない）。
  new Worker(new URL('../worker/video-convert.worker.ts', import.meta.url), {
    type: 'module',
  })

// 出力は WebM だけ（コーデックが VP9 でも VP8 でも同じ拡張子）
const getExtension = () => 'webm'

// 動画を 1 つずつ Worker で変換する（中身は useBatchConvert）。
export const useVideoConvert = () =>
  useBatchConvert<VideoConvertOptions>({ createWorker, getExtension, logLabel: 'video-convert' })
