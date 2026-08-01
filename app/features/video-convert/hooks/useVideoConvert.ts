import { useCallback, useEffect, useRef, useState } from 'react'

import type { VideoConvertOptions, VideoConvertResponse } from '~/features/video-convert/types'

export type VideoConvertStatus = 'idle' | 'converting' | 'done' | 'error'

export type VideoConvertResult = {
  blob: Blob
  fileName: string
}

// Worker はブラウザ実行時のみ生成する（prerender / SSR 描画中は生成しない）。
export const useVideoConvert = () => {
  const workerRef = useRef<Worker | null>(null)
  const [status, setStatus] = useState<VideoConvertStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VideoConvertResult | null>(null)

  useEffect(() => {
    // Vite の Worker 解決のため、new URL には相対パスを渡す（エイリアス不可）。
    const worker = new Worker(new URL('../worker/videoConvert.worker.ts', import.meta.url), {
      type: 'module',
    })

    worker.onmessage = (event: MessageEvent<VideoConvertResponse>) => {
      const data = event.data

      switch (data.type) {
        case 'progress':
          setProgress(data.progress)
          break
        case 'done':
          setProgress(100)
          setStatus('done')
          setResult({ blob: data.blob, fileName: data.fileName })
          break
        case 'error':
          setStatus('error')
          setError(data.message)
          break
      }
    }

    workerRef.current = worker

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const convert = useCallback((file: File, options: VideoConvertOptions) => {
    if (!workerRef.current) {
      return
    }

    setStatus('converting')
    setProgress(0)
    setError(null)
    setResult(null)

    workerRef.current.postMessage({
      type: 'convert',
      id: `${Date.now()}`,
      file,
      options,
    })
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setProgress(0)
    setError(null)
    setResult(null)
  }, [])

  return {
    status,
    progress,
    error,
    result,
    convert,
    reset,
  }
}
