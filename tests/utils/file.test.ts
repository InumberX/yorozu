import { describe, expect, test } from 'vitest'

import { formatFileSize, isAcceptedFile, isSameFile, mergeFiles } from '~/utils/file'

const createFile = (name: string, type: string, lastModified = 1) => new File(['x'], name, { type, lastModified })

describe('isAcceptedFile', () => {
  test('MIME タイプで判定する', () => {
    expect(isAcceptedFile(createFile('a.png', 'image/png'), 'image/png,image/jpeg')).toBe(true)
    expect(isAcceptedFile(createFile('a.gif', 'image/gif'), 'image/png,image/jpeg')).toBe(false)
  })

  test('「image/*」のような書き方と、拡張子で判定する', () => {
    expect(isAcceptedFile(createFile('a.gif', 'image/gif'), 'image/*')).toBe(true)
    expect(isAcceptedFile(createFile('A.JPG', ''), '.jpg')).toBe(true)
    expect(isAcceptedFile(createFile('a.txt', ''), 'image/*')).toBe(false)
  })

  test('accept が空なら、どのファイルも通す', () => {
    expect(isAcceptedFile(createFile('a.txt', 'text/plain'), '')).toBe(true)
  })
})

describe('mergeFiles', () => {
  test('同じファイル（名前・大きさ・更新日時が同じ）は足さない', () => {
    const a = createFile('a.png', 'image/png')
    const b = createFile('b.png', 'image/png')
    const aAgain = createFile('a.png', 'image/png')
    const aNewer = createFile('a.png', 'image/png', 2)

    expect(isSameFile(a, aAgain)).toBe(true)
    expect(mergeFiles([a], [aAgain, b, aNewer])).toEqual([a, b, aNewer])
  })
})

describe('formatFileSize', () => {
  test('単位を切り替え、100 未満は小数第 1 位まで出す', () => {
    expect(formatFileSize(512)).toBe('512B')
    expect(formatFileSize(1536)).toBe('1.5KB')
    expect(formatFileSize(4.2 * 1024 * 1024)).toBe('4.2MB')
    expect(formatFileSize(512 * 1024)).toBe('512KB')
  })
})
