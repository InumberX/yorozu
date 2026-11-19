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

// 1 ファイルの変換の結果。Worker ごと落ちたとき（読み込めない・メモリが足りないなど）は isCrashed。
type ConvertFileResult = {
  blob: Blob | null
  isCrashed: boolean
}

type PendingRequest = {
  id: string
  resolve: (result: ConvertFileResult) => void
  onProgress: (progress: number) => void
}

// Worker が続けて落ちたら、残りのファイルは変換しない。
// スクリプト自体が読めないとき（新しい版のデプロイで古いファイルが消えた、通信が切れた）は、何度作り直しても同じ結果になる。
// 重いファイルが続いただけのときとは区別できないため、2 回続いたら打ち切る。1 回だけなら、そのファイルだけ失敗にして次へ進む。
const MAX_CONSECUTIVE_CRASHES = 2

const createWorker = () =>
  // Vite が Worker を解決できるよう、new URL には相対パスを渡す（エイリアスは使えない）。
  new Worker(new URL('../worker/image-convert.worker.ts', import.meta.url), {
    type: 'module',
  })

// 複数のファイルを 1 つずつ Worker で変換する。
// Worker は変換を始めるときに作り、終わったら止める（prerender の描画中には作らない）。
export const useImageConvert = () => {
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<PendingRequest | null>(null)
  // 単調増加の番号。Date.now() は同じミリ秒でぶつかりうるため ID に使わない。
  const sequenceRef = useRef(0)
  // 何回目の変換か。中止や画面を離れたときに番号を進め、前の変換の結果を捨てる目印にする。
  const runRef = useRef(0)
  const groupsRef = useRef<ImageConvertResultGroup[]>([])
  const [status, setStatus] = useState<ImageConvertStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [groups, setGroups] = useState<ImageConvertResultGroup[]>([])

  const nextId = useCallback(() => {
    sequenceRef.current = sequenceRef.current + 1
    return `${sequenceRef.current}`
  }, [])

  // Worker を止める。待っている依頼があれば、変換できなかったものとして終わらせる。
  const stopWorker = useCallback((isCrashed: boolean) => {
    workerRef.current?.terminate()
    workerRef.current = null
    const pending = pendingRef.current
    pendingRef.current = null
    pending?.resolve({ blob: null, isCrashed })
  }, [])

  const getWorker = useCallback(() => {
    if (workerRef.current) {
      return workerRef.current
    }

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
          pending.resolve({ blob: data.blob, isCrashed: false })
          break
        case 'error':
          pendingRef.current = null
          console.error(`[image-convert] ${data.code}: ${data.message}`)
          pending.resolve({ blob: null, isCrashed: false })
          break
      }
    }

    // Worker のスクリプトが読めない、Worker の中で捕まえられない例外が起きた、返事を受け取れない、のいずれか。
    // 待っている依頼が永遠に終わらなくなるため、Worker ごと捨てて、次のファイルでは作り直す。
    const handleCrash = (event: Event) => {
      event.preventDefault()
      // 止めたあとの Worker から届いたものなら、今の Worker と依頼には関係がない
      if (workerRef.current !== worker) {
        return
      }
      console.error('[image-convert] worker crashed', event)
      stopWorker(true)
    }
    worker.onerror = handleCrash
    worker.onmessageerror = handleCrash

    workerRef.current = worker
    return worker
  }, [stopWorker])

  useEffect(() => {
    return () => {
      // 画面を離れたら、変換を打ち切り、保存用の URL を手放す
      runRef.current = runRef.current + 1
      stopWorker(false)
      for (const group of groupsRef.current) {
        for (const item of group.items) {
          URL.revokeObjectURL(item.url)
        }
      }
    }
  }, [stopWorker])

  const updateGroups = useCallback((update: (current: ImageConvertResultGroup[]) => ImageConvertResultGroup[]) => {
    groupsRef.current = update(groupsRef.current)
    setGroups(groupsRef.current)
  }, [])

  const convertFile = useCallback(
    (file: File, options: ImageConvertOptions, onProgress: (progress: number) => void) =>
      new Promise<ConvertFileResult>((resolve) => {
        const id = nextId()
        pendingRef.current = { id, resolve, onProgress }
        const request: ImageConvertRequest = { type: 'convert', id, file, options }
        try {
          getWorker().postMessage(request)
        } catch (error) {
          // Worker を作れない（CSP で禁じられているなど）。作り直しても同じなので、落ちたものとして扱う
          console.error('[image-convert] failed to start worker', error)
          pendingRef.current = null
          resolve({ blob: null, isCrashed: true })
        }
      }),
    [getWorker, nextId]
  )

  const convert = useCallback(
    async (files: File[], options: ImageConvertOptions) => {
      if (files.length === 0) {
        return
      }

      runRef.current = runRef.current + 1
      const run = runRef.current
      const items: ImageConvertResultItem[] = []
      const failedNames: string[] = []
      const usedNames = new Set<string>()
      let consecutiveCrashes = 0

      setStatus('converting')
      setProgress(0)

      for (const [index, file] of files.entries()) {
        const { blob, isCrashed } = await convertFile(file, options, (fileProgress) => {
          if (runRef.current === run) {
            setProgress(Math.floor(((index + fileProgress / 100) / files.length) * 100))
          }
        })

        // 中止されたり、画面を離れたりしたら、ここまでの結果も残さない
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

        consecutiveCrashes = isCrashed ? consecutiveCrashes + 1 : 0
        if (consecutiveCrashes >= MAX_CONSECUTIVE_CRASHES) {
          failedNames.push(...files.slice(index + 1).map((rest) => rest.name))
          break
        }

        setProgress(Math.floor(((index + 1) / files.length) * 100))
      }

      // エンコーダー（WASM）が使うメモリは、大きい画像のあとも縮まない。
      // 変換が終わるたびに Worker を止めて、そのメモリを手放す（次の変換で作り直す）。
      stopWorker(false)

      updateGroups((current) => [{ id: nextId(), convertedAt: new Date(), options, items, failedNames }, ...current])
      setStatus('done')
    },
    [convertFile, nextId, stopWorker, updateGroups]
  )

  // 変換を中止する。Worker の計算は止められないため、Worker ごと止める。
  const cancel = useCallback(() => {
    runRef.current = runRef.current + 1
    stopWorker(false)
    setStatus('idle')
    setProgress(0)
  }, [stopWorker])

  // 「変換が完了しました」の表示を消す（ファイルや設定を変えたとき）
  const clearDone = useCallback(() => {
    setStatus((current) => (current === 'done' ? 'idle' : current))
  }, [])

  const removeGroup = useCallback(
    (groupId: string) => {
      const target = groupsRef.current.find((group) => group.id === groupId)
      for (const item of target?.items ?? []) {
        URL.revokeObjectURL(item.url)
      }
      updateGroups((current) => current.filter((group) => group.id !== groupId))
    },
    [updateGroups]
  )

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
