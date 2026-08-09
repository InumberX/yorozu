import { useCallback, useEffect, useRef, useState } from 'react'

import type { ImageConvertOptions, ImageConvertResponse } from '~/features/image-convert/types'

export type ImageConvertStatus = 'idle' | 'converting' | 'done' | 'error'

export type ImageConvertResult = {
  blob: Blob
  fileName: string
}

// Worker はブラウザ実行時のみ生成する（prerender / SSR 描画中は生成しない）。
export const useImageConvert = () => {
  const workerRef = useRef<Worker | null>(null)
  // 実行中リクエストの id。遅延・古いメッセージで状態が上書きされるのを防ぐため、
  // onmessage では現在の id と一致するレスポンスのみ反映する。
  const activeIdRef = useRef<string | null>(null)
  const [status, setStatus] = useState<ImageConvertStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ImageConvertResult | null>(null)

  useEffect(() => {
    // Vite の Worker 解決のため、new URL には相対パスを渡す（エイリアス不可）。
    const worker = new Worker(new URL('../worker/imageConvert.worker.ts', import.meta.url), {
      type: 'module',
    })

    worker.onmessage = (event: MessageEvent<ImageConvertResponse>) => {
      const data = event.data

      // 現在アクティブなリクエスト以外（古い / 遅延した）メッセージは無視する。
      if (data.id !== activeIdRef.current) {
        return
      }

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

  const convert = useCallback((file: File, options: ImageConvertOptions) => {
    if (!workerRef.current) {
      return
    }

    const id = `${Date.now()}`
    activeIdRef.current = id

    setStatus('converting')
    setProgress(0)
    setError(null)
    setResult(null)

    workerRef.current.postMessage({
      type: 'convert',
      id,
      file,
      options,
    })
  }, [])

  const reset = useCallback(() => {
    activeIdRef.current = null
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
