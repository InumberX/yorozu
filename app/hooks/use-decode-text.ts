import { useEffect, useState } from 'react'

// 解読中に見せる文字
const DECODE_GLYPHS = '0123456789ABCDEF#/<>[]'
// 全文がそろうまでのコマ数と、1 コマの長さ（ms）。30 コマ × 40ms で 1.2 秒。
const DECODE_FRAMES = 30
const DECODE_FRAME_INTERVAL = 40

const getRandomGlyph = () => {
  return DECODE_GLYPHS[Math.floor(Math.random() * DECODE_GLYPHS.length)]
}

// コマ数 frame のときの表示。先頭から確定させ、残りは空白を残してランダムな文字にする。
export const getDecodingText = (text: string, frame: number) => {
  const decodedLength = Math.floor((text.length * frame) / DECODE_FRAMES)
  const rest = Array.from(text.slice(decodedLength), (char) => {
    return char === ' ' ? ' ' : getRandomGlyph()
  }).join('')
  return text.slice(0, decodedLength) + rest
}

// 文字列が文字化けした状態から読める状態へ変わる演出。
// サーバー描画と最初の描画では全文を返し（ハイドレーションの不一致を避ける）、
// マウント後と text が変わったときに演出する。動きを減らす設定では演出しない。
export const useDecodeText = (text: string) => {
  // 演出中の表示。どの text の演出かを持ち、text が変わったら古い演出の表示は使わない。
  const [decoding, setDecoding] = useState<{ source: string; text: string } | null>(null)

  useEffect(() => {
    if (!text || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let frame = 0
    const timer = window.setInterval(() => {
      frame += 1
      if (frame >= DECODE_FRAMES) {
        window.clearInterval(timer)
        setDecoding(null)
        return
      }
      setDecoding({ source: text, text: getDecodingText(text, frame) })
    }, DECODE_FRAME_INTERVAL)

    return () => {
      window.clearInterval(timer)
    }
  }, [text])

  return decoding?.source === text ? decoding.text : text
}
