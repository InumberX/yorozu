import { describe, expect, test } from 'vitest'

import { testI18n } from '../../test-utils'

import { LANG } from '~/config/consts'
import { createImageConvertSchema, MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from '~/features/image-convert/schema'

const schema = createImageConvertSchema(testI18n.getFixedT(LANG.JA, 'pages/YZ20_100'))

const createFile = (size: number, type = 'image/png') =>
  new File([new Uint8Array(size)], 'a.png', { type, lastModified: 1 })

const parse = (files: File[]) => schema.safeParse({ files, format: 'webp', quality: 80 })

describe('createImageConvertSchema', () => {
  test('1 ファイルの上限は 20MB', () => {
    expect(MAX_FILE_SIZE_LABEL).toBe('20MB')
    expect(parse([createFile(MAX_FILE_SIZE)]).success).toBe(true)
  })

  test('上限を超えるファイルは、上限を添えたエラーにする', () => {
    const result = parse([createFile(MAX_FILE_SIZE + 1)])
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['files', 0])
    expect(result.error?.issues[0]?.message).toBe('1ファイル 20MB までです。')
  })

  test('PNG・JPEG 以外と、ファイルなしはエラーにする', () => {
    expect(parse([createFile(10, 'image/gif')]).error?.issues[0]?.message).toBe(
      'PNG か JPEG のファイルを読み込んでください。'
    )
    expect(parse([]).error?.issues[0]?.message).toBe('ファイルを読み込んでください。')
  })
})
