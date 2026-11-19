import { useEffect, useRef, useState } from 'react'

import * as styles from './style.css'

const SIZES = {
  medium: 56,
  small: 44,
} as const

// 高精細な画面でもぼやけないよう、表示の 2 倍の大きさで描く
const PIXEL_RATIO = 2

export type ImageThumbnailProps = {
  // 見本にする画像。同じ要素で別の画像に差し替えないこと（変わるときは key を変えて作り直す）。
  file: Blob
  size?: keyof typeof SIZES
  // 元の画像の大きさ（px）を受け取る
  onLoadSize?: (size: { width: number; height: number }) => void
  className?: string
}

// 画像の小さな見本。描けるまでは（描けないときも）画像のアイコンを出す。
//
// <img> に元の画像を渡すと、56px の見本でもブラウザが元の大きさのまま展開して持ち続けることがある。
// 大きい画像を何枚も読み込むと重くなるため、見本の大きさに縮めた bitmap をキャンバスに描き、
// 元の大きさの bitmap はすぐに手放す。
export const ImageThumbnail = ({ file, size = 'medium', onLoadSize, className }: ImageThumbnailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawn, setIsDrawn] = useState(false)
  // 最新の onLoadSize を、effect をやり直さずに呼ぶため
  const onLoadSizeRef = useRef(onLoadSize)
  useEffect(() => {
    onLoadSizeRef.current = onLoadSize
  }, [onLoadSize])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof createImageBitmap === 'undefined') {
      return
    }

    let isCancelled = false
    const side = SIZES[size] * PIXEL_RATIO

    const draw = async () => {
      // 元の大きさを知るために一度展開し、縮めた bitmap を作ったら、すぐに閉じる
      const original = await createImageBitmap(file)
      const { width, height } = original
      // 短い辺を見本の大きさに合わせて縮め、はみ出た分は切り落とす（object-fit: cover と同じ）
      const resized = await createImageBitmap(
        original,
        width < height
          ? { resizeWidth: side, resizeQuality: 'medium' }
          : { resizeHeight: side, resizeQuality: 'medium' }
      ).finally(() => original.close())

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
        context.drawImage(resized, (side - resized.width) / 2, (side - resized.height) / 2)
        setIsDrawn(true)
        onLoadSizeRef.current?.({ width, height })
      } finally {
        resized.close()
      }
    }

    // 読めない画像は、アイコンのままにする
    draw().catch(() => undefined)

    return () => {
      isCancelled = true
    }
  }, [file, size])

  return (
    <span className={[styles.imageThumbnail, styles[`imageThumbnail__${size}`], className].filter(Boolean).join(' ')}>
      {!isDrawn && (
        <svg aria-hidden="true" className={styles.imageThumbnail_icon} viewBox="0 0 44 44" fill="none">
          <rect x="3" y="7" width="38" height="30" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 31 L15 20 L23 27 L29 22 L41 32" stroke="currentColor" strokeWidth="1.5" />
          <rect x="29" y="13" width="5" height="5" fill="currentColor" />
        </svg>
      )}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        width={0}
        height={0}
        className={[styles.imageThumbnail_image, isDrawn && styles.imageThumbnail_image__loaded]
          .filter(Boolean)
          .join(' ')}
      />
    </span>
  )
}
