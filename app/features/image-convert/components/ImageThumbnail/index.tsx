import { useEffect, useRef, useState } from 'react'

import * as styles from './style.css'

export type ImageThumbnailProps = {
  // 表示する画像。Blob を渡すと、表示している間だけ object URL を作る。
  // 同じ要素で別のファイルに差し替えないこと（ファイルが変わるときは key を変えて作り直す）。
  file?: Blob
  // すでに作ってある URL（変換結果など）
  src?: string
  size?: 'medium' | 'small'
  onLoadSize?: (size: { width: number; height: number }) => void
  className?: string
}

// 画像の小さな見本。読み込めるまでは、画像のアイコンを出す。
export const ImageThumbnail = ({ file, src, size = 'medium', onLoadSize, className }: ImageThumbnailProps) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Blob の URL は、表示している間だけ持つ。描画中には作らず、img に直接入れる。
  useEffect(() => {
    const image = imageRef.current
    if (!file || !image) {
      return
    }
    const url = URL.createObjectURL(file)
    image.src = url
    return () => {
      image.removeAttribute('src')
      URL.revokeObjectURL(url)
    }
  }, [file])

  const hasImage = !!file || !!src

  return (
    <span className={[styles.imageThumbnail, styles[`imageThumbnail__${size}`], className].filter(Boolean).join(' ')}>
      {!isLoaded && (
        <svg aria-hidden="true" className={styles.imageThumbnail_icon} viewBox="0 0 44 44" fill="none">
          <rect x="3" y="7" width="38" height="30" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 31 L15 20 L23 27 L29 22 L41 32" stroke="currentColor" strokeWidth="1.5" />
          <rect x="29" y="13" width="5" height="5" fill="currentColor" />
        </svg>
      )}
      {hasImage && (
        <img
          ref={imageRef}
          src={src}
          alt=""
          decoding="async"
          className={[styles.imageThumbnail_image, isLoaded && styles.imageThumbnail_image__loaded]
            .filter(Boolean)
            .join(' ')}
          onLoad={(event) => {
            setIsLoaded(true)
            onLoadSize?.({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })
          }}
        />
      )}
    </span>
  )
}
