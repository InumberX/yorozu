import type { FileThumbnailLoadResult } from '~/features/file-convert/components/FileThumbnail'

export type VideoThumbnailMeta = {
  width: number
  height: number
  // 秒
  duration: number
}

// 見本にする場面（秒）。最初のコマは黒いことが多いため、少し進めたところを使う。
const FRAME_TIME = 1

const waitFor = (video: HTMLVideoElement, eventName: 'loadedmetadata' | 'seeked') =>
  new Promise<void>((resolve, reject) => {
    const handleDone = () => {
      cleanup()
      resolve()
    }
    const handleError = () => {
      cleanup()
      reject(video.error ?? new Error(`failed to ${eventName}`))
    }
    const cleanup = () => {
      video.removeEventListener(eventName, handleDone)
      video.removeEventListener('error', handleError)
    }
    video.addEventListener(eventName, handleDone)
    video.addEventListener('error', handleError)
  })

// 動画の見本を作る。<video> で長さと大きさを読み、1 秒あたり（短い動画は真ん中）の場面を、
// 短い辺を side に縮めた bitmap にする。終わったら <video> と URL をすぐに手放す。
// このブラウザで再生できない動画（例: 対応していないコーデック）は reject する。
export const loadVideoThumbnail = async (
  file: Blob,
  side: number
): Promise<FileThumbnailLoadResult<VideoThumbnailMeta>> => {
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'

  try {
    const loaded = waitFor(video, 'loadedmetadata')
    video.src = url
    await loaded

    const { videoWidth: width, videoHeight: height, duration } = video
    const seeked = waitFor(video, 'seeked')
    video.currentTime = Number.isFinite(duration) ? Math.min(FRAME_TIME, duration / 2) : 0
    await seeked

    const bitmap = await createImageBitmap(
      video,
      width < height ? { resizeWidth: side, resizeQuality: 'medium' } : { resizeHeight: side, resizeQuality: 'medium' }
    )
    return { bitmap, meta: { width, height, duration } }
  } finally {
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(url)
  }
}
