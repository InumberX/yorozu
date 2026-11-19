import { useEffect, useRef, useState } from 'react'

import * as styles from './style.css'

// 描く大きさ（px）。表示は置いた場所いっぱいに広がり、いちばん大きいところで 56px。
// 高精細な画面でもぼやけないよう、その 2 倍で描く。
const SIDE = 56 * 2

// 見本の絵と、元のファイルについてわかったこと（大きさ・長さなど）
export type FileThumbnailLoadResult<M> = {
  // 短い辺を side に縮めたもの。描き終えたら FileThumbnail が閉じる。
  bitmap: ImageBitmap
  meta: M
}

export type FileThumbnailProps<M> = {
  // 見本にするファイル。同じ要素で別のファイルに差し替えないこと（変わるときは key を変えて作り直す）。
  file: Blob
  // ファイルを読み、短い辺が side（px）の bitmap にする。読めないときは reject する。
  load: (file: Blob, side: number) => Promise<FileThumbnailLoadResult<M>>
  // 描けるまで（描けないときも）出すアイコンの種類
  icon: 'image' | 'video'
  onLoad?: (meta: M) => void
  className?: string
}

// ファイルの小さな見本。大きさは置いた場所に合わせる（置く側で幅と高さを決める）。
// load で作った bitmap をキャンバスの真ん中に描き、はみ出た分は切り落とす。
//
// <img> や <video> に元のファイルを渡すと、56px の見本でもブラウザが元の大きさのまま展開して持ち続けることがある。
// 大きいファイルを何個も読み込むと重くなるため、見本の大きさに縮めた bitmap だけを描く。
export const FileThumbnail = <M,>({ file, load, icon, onLoad, className }: FileThumbnailProps<M>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawn, setIsDrawn] = useState(false)
  // 最新の load / onLoad を、effect をやり直さずに呼ぶため
  const callbacksRef = useRef({ load, onLoad })
  useEffect(() => {
    callbacksRef.current = { load, onLoad }
  }, [load, onLoad])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof createImageBitmap === 'undefined') {
      return
    }

    let isCancelled = false
    const side = SIDE

    const draw = async () => {
      const { bitmap, meta } = await callbacksRef.current.load(file, side)

      try {
        if (isCancelled) {
          return
        }
        const context = canvas.getContext('2d')
        if (!context) {
          return
        }
        canvas.width = side
        canvas.height = side
        context.drawImage(bitmap, (side - bitmap.width) / 2, (side - bitmap.height) / 2)
        setIsDrawn(true)
        callbacksRef.current.onLoad?.(meta)
      } finally {
        bitmap.close()
      }
    }

    // 読めないファイルは、アイコンのままにする
    draw().catch(() => undefined)

    return () => {
      isCancelled = true
    }
  }, [file])

  return (
    <span className={[styles.fileThumbnail, className].filter(Boolean).join(' ')}>
      {!isDrawn && (
        <svg aria-hidden="true" className={styles.fileThumbnail_icon} viewBox="0 0 44 44" fill="none">
          <rect x="3" y="7" width="38" height="30" stroke="currentColor" strokeWidth="1.5" />
          {icon === 'image' ? (
            <>
              <path d="M3 31 L15 20 L23 27 L29 22 L41 32" stroke="currentColor" strokeWidth="1.5" />
              <rect x="29" y="13" width="5" height="5" fill="currentColor" />
            </>
          ) : (
            <path d="M18 15 L29 22 L18 29 Z" fill="currentColor" />
          )}
        </svg>
      )}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        width={0}
        height={0}
        className={[styles.fileThumbnail_image, isDrawn && styles.fileThumbnail_image__loaded]
          .filter(Boolean)
          .join(' ')}
      />
    </span>
  )
}
