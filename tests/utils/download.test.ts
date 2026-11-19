import { unzipSync, strFromU8 } from 'fflate'
import { describe, expect, test } from 'vitest'

import { createZip } from '~/utils/download'

describe('createZip', () => {
  test('渡したファイルを、名前のとおりに ZIP にまとめる', async () => {
    const zip = await createZip([
      { name: 'a.webp', blob: new Blob(['aaa']) },
      { name: 'b.webp', blob: new Blob(['bb']) },
    ])

    expect(zip.type).toBe('application/zip')
    const files = unzipSync(new Uint8Array(await zip.arrayBuffer()))
    expect(Object.keys(files)).toEqual(['a.webp', 'b.webp'])
    expect(strFromU8(files['a.webp'])).toBe('aaa')
  })

  test('大きいファイルも、区切って読みながら中身を変えずにまとめる', async () => {
    // 区切り（8MB）をまたぐ大きさ
    const size = 8 * 1024 * 1024 + 3
    const data = new Uint8Array(size).map((_, i) => i % 251)
    const zip = await createZip([
      { name: 'large.webm', blob: new Blob([data]) },
      { name: 'empty.webm', blob: new Blob([]) },
    ])

    const files = unzipSync(new Uint8Array(await zip.arrayBuffer()))
    const large = files['large.webm']
    expect(large).toHaveLength(size)
    // 8MB の配列をそのまま比べると重いため、区切りの前後と全体の合計で確かめる
    expect(Array.from(large.subarray(size - 8))).toEqual(Array.from(data.subarray(size - 8)))
    expect(large.reduce((sum, value) => sum + value, 0)).toBe(data.reduce((sum, value) => sum + value, 0))
    expect(files['empty.webm']).toHaveLength(0)
  })
})
