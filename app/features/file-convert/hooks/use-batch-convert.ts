import { useCallback, useEffect, useRef, useState } from 'react'

import type {
  ConvertFailure,
  ConvertRequest,
  ConvertResponse,
  ConvertResultGroup,
  ConvertResultItem,
  ConvertStatus,
} from '~/features/file-convert/types'
import { toOutputFileName } from '~/features/file-convert/utils/convert-label'

// 1 ファイルの変換の結果。Worker ごと落ちたとき（読み込めない・メモリが足りないなど）は isCrashed。
type ConvertFileResult =
  | { blob: Blob; warnings: string[]; isCrashed: false }
  | { blob: null; code: string | null; isCrashed: boolean }

type PendingRequest = {
  id: string
  resolve: (result: ConvertFileResult) => void
  onProgress: (progress: number) => void
}

// Worker が続けて落ちたら、残りのファイルは変換しない。
// スクリプト自体が読めないとき（新しい版のデプロイで古いファイルが消えた、通信が切れた）は、何度作り直しても同じ結果になる。
// 重いファイルが続いただけのときとは区別できないため、2 回続いたら打ち切る。1 回だけなら、そのファイルだけ失敗にして次へ進む。
const MAX_CONSECUTIVE_CRASHES = 2

export type UseBatchConvertParams<O> = {
  // Worker を作る。Vite が Worker を解決できるよう、各ツールの中で
  // `new Worker(new URL('../worker/x.worker.ts', import.meta.url), { type: 'module' })` と書く。
  createWorker: () => Worker
  // 書き出すファイルの拡張子（例: webp）
  getExtension: (options: O) => string
  // console に出すときの見出し（例: image-convert）
  logLabel: string
}

// 複数のファイルを 1 つずつ Worker で変換する。
// Worker は変換を始めるときに作り、終わったら止める（prerender の描画中には作らない）。
export const useBatchConvert = <O>({ createWorker, getExtension, logLabel }: UseBatchConvertParams<O>) => {
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<PendingRequest | null>(null)
  // 単調増加の番号。Date.now() は同じミリ秒でぶつかりうるため ID に使わない。
  const sequenceRef = useRef(0)
  // 何回目の変換か。中止や画面を離れたときに番号を進め、前の変換の結果を捨てる目印にする。
  const runRef = useRef(0)
  const groupsRef = useRef<ConvertResultGroup<O>[]>([])
  const [status, setStatus] = useState<ConvertStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [groups, setGroups] = useState<ConvertResultGroup<O>[]>([])

  // 呼び出し元が毎回新しい関数を渡しても、作り直さずに最新のものを使う
  const paramsRef = useRef({ createWorker, getExtension, logLabel })
  useEffect(() => {
    paramsRef.current = { createWorker, getExtension, logLabel }
  }, [createWorker, getExtension, logLabel])

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
    pending?.resolve({ blob: null, code: null, isCrashed })
  }, [])

  const getWorker = useCallback(() => {
    if (workerRef.current) {
      return workerRef.current
    }

    const worker = paramsRef.current.createWorker()

    worker.onmessage = (event: MessageEvent<ConvertResponse>) => {
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
          pending.resolve({ blob: data.blob, warnings: data.warnings ?? [], isCrashed: false })
          break
        case 'error':
          pendingRef.current = null
          console.error(`[${paramsRef.current.logLabel}] ${data.code}: ${data.message}`)
          pending.resolve({ blob: null, code: data.code, isCrashed: false })
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
      console.error(`[${paramsRef.current.logLabel}] worker crashed`, event)
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

  const updateGroups = useCallback((update: (current: ConvertResultGroup<O>[]) => ConvertResultGroup<O>[]) => {
    groupsRef.current = update(groupsRef.current)
    setGroups(groupsRef.current)
  }, [])

  const convertFile = useCallback(
    (file: File, options: O, onProgress: (progress: number) => void) =>
      new Promise<ConvertFileResult>((resolve) => {
        const id = nextId()
        pendingRef.current = { id, resolve, onProgress }
        const request: ConvertRequest<O> = { type: 'convert', id, file, options }
        try {
          getWorker().postMessage(request)
        } catch (error) {
          // Worker を作れない、または依頼を渡せない（CSP で禁じられているなど）。
          // 落ちたときと同じく、Worker を捨てて次のファイルで作り直す（続けて失敗したら打ち切られる）
          console.error(`[${paramsRef.current.logLabel}] failed to start worker`, error)
          stopWorker(true)
        }
      }),
    [getWorker, nextId, stopWorker]
  )

  const convert = useCallback(
    async (files: File[], options: O) => {
      if (files.length === 0) {
        return
      }

      runRef.current = runRef.current + 1
      const run = runRef.current
      const items: ConvertResultItem[] = []
      const failures: ConvertFailure[] = []
      const usedNames = new Set<string>()
      const extension = paramsRef.current.getExtension(options)
      let consecutiveCrashes = 0

      setStatus('converting')
      setProgress(0)

      for (const [index, file] of files.entries()) {
        const result = await convertFile(file, options, (fileProgress) => {
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

        if (result.blob) {
          items.push({
            id: nextId(),
            sourceName: file.name,
            fileName: toOutputFileName(file.name, extension, usedNames),
            beforeSize: file.size,
            afterSize: result.blob.size,
            blob: result.blob,
            url: URL.createObjectURL(result.blob),
            warnings: result.warnings,
          })
        } else {
          failures.push({ name: file.name, code: result.code })
        }

        consecutiveCrashes = result.isCrashed ? consecutiveCrashes + 1 : 0
        if (consecutiveCrashes >= MAX_CONSECUTIVE_CRASHES) {
          failures.push(...files.slice(index + 1).map((rest) => ({ name: rest.name, code: null })))
          break
        }

        setProgress(Math.floor(((index + 1) / files.length) * 100))
      }

      // エンコーダー（WASM など）が使うメモリは、大きいファイルのあとも縮まないことがある。
      // 変換が終わるたびに Worker を止めて、そのメモリを手放す（次の変換で作り直す）。
      stopWorker(false)

      updateGroups((current) => [{ id: nextId(), convertedAt: new Date(), options, items, failures }, ...current])
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
