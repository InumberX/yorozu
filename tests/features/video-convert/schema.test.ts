import { describe, expect, test } from 'vitest'

import { testI18n } from '../../test-utils'

import { LANG } from '~/config/consts'
import { MAX_DURATION_MINUTES, MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from '~/features/video-convert/limits'
import { createVideoConvertSchema } from '~/features/video-convert/schema'

const schema = createVideoConvertSchema(testI18n.getFixedT(LANG.JA, 'pages/YZ30_100'))

// 200MB の中身を作らずに、大きさだけを決める
const createFile = (size: number, type = 'video/mp4') => {
  const file = new File(['x'], 'a.mp4', { type, lastModified: 1 })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

const parse = (files: File[], options: Record<string, unknown> = {}) =>
  schema.safeParse({ files, codec: 'vp9', quality: 3, resolution: 'original', ...options })

describe('createVideoConvertSchema', () => {
  test('上限は長さ 2 分・1 ファイル 200MB', () => {
    expect(MAX_DURATION_MINUTES).toBe(2)
    expect(MAX_FILE_SIZE_LABEL).toBe('200MB')
    expect(parse([createFile(MAX_FILE_SIZE)]).success).toBe(true)
    expect(parse([createFile(10, 'video/quicktime')]).success).toBe(true)
  })

  test('上限を超えるファイルは、上限を添えたエラーにする', () => {
    const result = parse([createFile(MAX_FILE_SIZE + 1)])
    expect(result.error?.issues[0]?.path).toEqual(['files', 0])
    expect(result.error?.issues[0]?.message).toBe('1ファイル 200MB までです。')
  })

  test('MP4・MOV 以外と、ファイルなしはエラーにする', () => {
    expect(parse([createFile(10, 'video/webm')]).error?.issues[0]?.message).toBe(
      'MP4 か MOV のファイルを読み込んでください。'
    )
    expect(parse([]).error?.issues[0]?.message).toBe('ファイルを読み込んでください。')
  })

  test('画質は 1〜5、解像度とコーデックは決まったものだけ', () => {
    expect(parse([createFile(10)], { quality: 0 }).success).toBe(false)
    expect(parse([createFile(10)], { quality: 6 }).success).toBe(false)
    expect(parse([createFile(10)], { resolution: '360' }).success).toBe(false)
    expect(parse([createFile(10)], { codec: 'av1' }).success).toBe(false)
  })

  test('長さがわかっていて 2 分を超えるものはエラーにし、わからないものは通す', () => {
    const short = createFile(10)
    const long = createFile(10)
    const unknown = createFile(10)
    const durations = new Map([
      [short, 120],
      [long, 120.5],
    ])
    const withDurations = createVideoConvertSchema(testI18n.getFixedT(LANG.JA, 'pages/YZ30_100'), (file) =>
      durations.get(file)
    )

    const result = withDurations.safeParse({
      files: [short, long, unknown],
      codec: 'vp9',
      quality: 3,
      resolution: 'original',
    })
    expect(result.error?.issues).toHaveLength(1)
    expect(result.error?.issues[0]?.path).toEqual(['files', 1])
    expect(result.error?.issues[0]?.message).toBe('長さ 2分 までです。')
  })
})
