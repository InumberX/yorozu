import { useCallback, useEffect, useRef, useState } from 'react'

import type {
  ImageConvertOptions,
  ImageConvertRequest,
  ImageConvertResponse,
  ImageOutputFormat,
} from '~/features/image-convert/types'

export type ImageConvertStatus = 'idle' | 'converting' | 'done'

// 変換できた 1 ファイル
export type ImageConvertResultItem = {
  id: string
  sourceName: string
  // 書き出したファイルの名前（拡張子を出力形式に変えたもの）
  fileName: string
  beforeSize: number
  afterSize: number
  blob: Blob
  // ダウンロードとプレビューに使う。グループを消したときと、画面を離れるときに解放する。
  url: string
}

// 1 回の変換でできたもののまとまり
export type ImageConvertResultGroup = {
  id: string
  convertedAt: Date
  options: ImageConvertOptions
  items: ImageConvertResultItem[]
  // 変換できなかったファイルの名前
  failedNames: string[]
}

const EXTENSIONS: Record<ImageOutputFormat, string> = {
  webp: 'webp',
  avif: 'avif',
}

// 拡張子を出力形式のものに変える。同じ回の中で名前がぶつかるときは「-2」などを付ける。
export const toOutputFileName = (sourceName: string, format: ImageOutputFormat, usedNames: Set<string>) => {
  const dotIndex = sourceName.lastIndexOf('.')
  const base = dotIndex > 0 ? sourceName.slice(0, dotIndex) : sourceName
  const extension = EXTENSIONS[format]

  let name = `${base}.${extension}`
  for (let i = 2; usedNames.has(name); i = i + 1) {
    name = `${base}-${i}.${extension}`
  }
  usedNames.add(name)

  return name
}

type PendingRequest = {
  id: string
  resolve: (blob: Blob | null) => void
  onProgress: (progress: number) => void
}

const createWorker = () =>
  // Vite が Worker を解決できるよう、new URL には相対パスを渡す（エイリアスは使えない）。
  new Worker(new URL('../worker/image-convert.worker.ts', import.meta.url), {
    type: 'module',
  })

// 複数のファイルを 1 つずつ Worker で変換する。
// Worker はブラウザで動くときだけ作る（prerender の描画中には作らない）。
export const useImageConvert = () => {
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<PendingRequest | null>(null)
  // 単調増加の番号。Date.now() は同じミリ秒でぶつかりうるため ID に使わない。
  const sequenceRef = useRef(0)
  // 中止したかどうか。変換の途中で中止されたら、残りのファイルを変換しない。
  const runRef = useRef(0)
  const groupsRef = useRef<ImageConvertResultGroup[]>([])
  const [status, setStatus] = useState<ImageConvertStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [groups, setGroups] = useState<ImageConvertResultGroup[]>([])

  const nextId = () => {
    sequenceRef.current = sequenceRef.current + 1
    return `${sequenceRef.current}`
  }

  const setupWorker = useCallback(() => {
    const worker = createWorker()

    worker.onmessage = (event: MessageEvent<ImageConvertResponse>) => {
      const pending = pendingRef.current
      const data = event.data

      // 中止したあとに届いた、古い依頼への返事は捨てる
      if (!pending || data.id !== pending.id) {
        return
      }

      switch (data.type) {
        case 'progress':
          pending.onProgress(data.progress)
          break
        case 'done':
          pendingRef.current = null
          pending.resolve(data.blob)
          break
        case 'error':
          pendingRef.current = null
          console.error(`[image-convert] ${data.code}: ${data.message}`)
          pending.resolve(null)
          break
      }
    }

    workerRef.current = worker
  }, [])

  useEffect(() => {
    setupWorker()

    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
      for (const group of groupsRef.current) {
        for (const item of group.items) {
          URL.revokeObjectURL(item.url)
        }
      }
    }
  }, [setupWorker])

  const updateGroups = (update: (current: ImageConvertResultGroup[]) => ImageConvertResultGroup[]) => {
    groupsRef.current = update(groupsRef.current)
    setGroups(groupsRef.current)
  }

  const convertFile = (file: File, options: ImageConvertOptions, onProgress: (progress: number) => void) =>
    new Promise<Blob | null>((resolve) => {
      const worker = workerRef.current
      if (!worker) {
        resolve(null)
        return
      }

      const id = nextId()
      pendingRef.current = { id, resolve, onProgress }
      const request: ImageConvertRequest = { type: 'convert', id, file, options }
      worker.postMessage(request)
    })

  const convert = useCallback(async (files: File[], options: ImageConvertOptions) => {
    if (files.length === 0 || !workerRef.current) {
      return
    }

    runRef.current = runRef.current + 1
    const run = runRef.current
    const items: ImageConvertResultItem[] = []
    const failedNames: string[] = []
    const usedNames = new Set<string>()

    setStatus('converting')
    setProgress(0)

    for (const [index, file] of files.entries()) {
      const blob = await convertFile(file, options, (fileProgress) => {
        if (runRef.current === run) {
          setProgress(Math.floor(((index + fileProgress / 100) / files.length) * 100))
        }
      })

      // 中止されたら、ここまでの結果も残さない
      if (runRef.current !== run) {
        for (const item of items) {
          URL.revokeObjectURL(item.url)
        }
        return
      }

      if (blob) {
        items.push({
          id: nextId(),
          sourceName: file.name,
          fileName: toOutputFileName(file.name, options.format, usedNames),
          beforeSize: file.size,
          afterSize: blob.size,
          blob,
          url: URL.createObjectURL(blob),
        })
      } else {
        failedNames.push(file.name)
      }

      setProgress(Math.floor(((index + 1) / files.length) * 100))
    }

    updateGroups((current) => [{ id: nextId(), convertedAt: new Date(), options, items, failedNames }, ...current])
    setStatus('done')
    // convertFile と updateGroups は ref しか読まない
  }, [])

  // 変換を中止する。Worker の計算は止められないため、Worker ごと作り直す。
  const cancel = useCallback(() => {
    runRef.current = runRef.current + 1
    const pending = pendingRef.current
    pendingRef.current = null
    workerRef.current?.terminate()
    setupWorker()
    pending?.resolve(null)
    setStatus('idle')
    setProgress(0)
  }, [setupWorker])

  // 「変換が完了しました」の表示を消す（ファイルや設定を変えたとき）
  const clearDone = useCallback(() => {
    setStatus((current) => (current === 'done' ? 'idle' : current))
  }, [])

  const removeGroup = useCallback((groupId: string) => {
    const target = groupsRef.current.find((group) => group.id === groupId)
    for (const item of target?.items ?? []) {
      URL.revokeObjectURL(item.url)
    }
    updateGroups((current) => current.filter((group) => group.id !== groupId))
    // updateGroups は ref しか読まない
  }, [])

  return {
    status,
    progress,
    groups,
    convert,
    cancel,
    clearDone,
    removeGroup,
  }
}
