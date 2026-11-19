import type { VideoResolution } from '~/features/video-convert/types'

// エンコーダーは幅と高さが偶数でないと受け付けないことがあるため、偶数にそろえる
const toEven = (value: number) => Math.max(2, Math.round(value / 2) * 2)

// 書き出す大きさ。短い辺が上限を超えるときだけ、縦横比を保って縮める（元より大きくはしない）。
export const toOutputSize = (
  width: number,
  height: number,
  resolution: VideoResolution
): { width: number; height: number } => {
  const shortSide = Math.min(width, height)
  const limit = resolution === 'original' ? shortSide : Number(resolution)
  const scale = shortSide > limit ? limit / shortSide : 1
  return { width: toEven(width * scale), height: toEven(height * scale) }
}
