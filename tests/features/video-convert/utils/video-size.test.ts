import { describe, expect, test } from 'vitest'

import { toOutputSize } from '~/features/video-convert/utils/video-size'

describe('toOutputSize', () => {
  test('元のままなら大きさを変えない（奇数は偶数にそろえる）', () => {
    expect(toOutputSize(1920, 1080, 'original')).toEqual({ width: 1920, height: 1080 })
    expect(toOutputSize(1921, 1081, 'original')).toEqual({ width: 1922, height: 1082 })
  })

  test('短い辺が上限を超えるときだけ、縦横比を保って縮める', () => {
    expect(toOutputSize(1920, 1080, '720')).toEqual({ width: 1280, height: 720 })
    expect(toOutputSize(3840, 2160, '480')).toEqual({ width: 854, height: 480 })
  })

  test('縦長の動画は短い辺（幅）でそろえる', () => {
    expect(toOutputSize(1080, 1920, '720')).toEqual({ width: 720, height: 1280 })
  })

  test('元より大きくはしない', () => {
    expect(toOutputSize(1280, 720, '1080')).toEqual({ width: 1280, height: 720 })
  })
})
