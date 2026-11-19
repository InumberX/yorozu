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
})
