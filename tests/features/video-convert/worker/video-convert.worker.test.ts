import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import type { VideoConvertRequest, VideoConvertResponse } from '~/features/video-convert/types'

// Mediabunny は WebCodecs を使うため jsdom では動かない。Worker が見る部分だけを差し替える。
type FakeTrack = { isVideoTrack: () => boolean; isAudioTrack: () => boolean }
type FakeConversion = {
  isValid: boolean
  discardedTracks: { track: FakeTrack; reason: string }[]
  onProgress?: (progress: number) => void
  execute: () => Promise<void>
}

const videoTrack: FakeTrack = { isVideoTrack: () => true, isAudioTrack: () => false }
const audioTrack: FakeTrack = { isVideoTrack: () => false, isAudioTrack: () => true }

const mocks = vi.hoisted(() => ({
  primaryVideoTrack: null as unknown,
  conversion: null as unknown,
}))

vi.mock('mediabunny', () => {
  class Input {
    getPrimaryVideoTrack = async () => mocks.primaryVideoTrack
    computeDuration = async () => 10
    dispose = () => {}
  }
  class Output {
    target = { buffer: new ArrayBuffer(8) }
  }
  class Stub {}
  return {
    BlobSource: Stub,
    BufferTarget: Stub,
    MP4: {},
    QTFF: {},
    Quality: Stub,
    WebMOutputFormat: Stub,
    Input,
    Output,
    canEncodeVideo: async () => true,
    Conversion: { init: async () => mocks.conversion },
  }
})

const decodableVideoTrack = {
  codec: 'avc',
  displayWidth: 1920,
  displayHeight: 1080,
  canDecode: async () => true,
}

const toConversion = (overrides: Partial<FakeConversion> = {}): FakeConversion => ({
  isValid: true,
  discardedTracks: [],
  execute: async () => {},
  ...overrides,
})

const request: VideoConvertRequest = {
  type: 'convert',
  id: 'file-1',
  file: new File(['x'], 'a.mp4', { type: 'video/mp4' }),
  options: { codec: 'vp9', quality: 3, resolution: 'original' },
}

const ctx = globalThis as unknown as {
  onmessage: ((event: MessageEvent<VideoConvertRequest>) => Promise<void>) | null
  postMessage: (message: VideoConvertResponse) => void
}

// 最後に送った返事（progress 以外）を返す
const convert = async (): Promise<VideoConvertResponse | undefined> => {
  const posted: VideoConvertResponse[] = []
  ctx.postMessage = (message) => {
    posted.push(message)
  }
  await ctx.onmessage?.({ data: request } as MessageEvent<VideoConvertRequest>)
  return posted.filter((message) => message.type !== 'progress').at(-1)
}

describe('video-convert.worker', () => {
  const originalPostMessage = ctx.postMessage

  beforeAll(async () => {
    await import('~/features/video-convert/worker/video-convert.worker')
  })

  beforeEach(() => {
    mocks.primaryVideoTrack = decodableVideoTrack
    mocks.conversion = toConversion()
  })

  afterEach(() => {
    ctx.postMessage = originalPostMessage
  })

  test('映像トラックがなければ NO_VIDEO_TRACK', async () => {
    mocks.primaryVideoTrack = null
    expect(await convert()).toMatchObject({ type: 'error', code: 'NO_VIDEO_TRACK' })
  })

  test('映像を読み出せなければ UNDECODABLE_VIDEO', async () => {
    mocks.primaryVideoTrack = { ...decodableVideoTrack, canDecode: async () => false }
    expect(await convert()).toMatchObject({ type: 'error', code: 'UNDECODABLE_VIDEO' })
  })

  test.each([
    ['undecodable_source_codec', 'UNDECODABLE_VIDEO'],
    ['no_encodable_target_codec', 'UNSUPPORTED_ENCODER'],
  ])('映像が %s で外されたら %s（isValid より先に見る）', async (reason, code) => {
    mocks.conversion = toConversion({ isValid: false, discardedTracks: [{ track: videoTrack, reason }] })
    expect(await convert()).toMatchObject({ type: 'error', code })
  })

  test('映像が外されずに isValid が false なら CONVERT_FAILED', async () => {
    mocks.conversion = toConversion({ isValid: false })
    expect(await convert()).toMatchObject({ type: 'error', code: 'CONVERT_FAILED' })
  })

  test.each([
    ['undecodable_source_codec', 'AUDIO_UNDECODABLE'],
    ['no_encodable_target_codec', 'AUDIO_UNENCODABLE'],
  ])('音声が %s で外されたら、変換して %s の注意を付ける', async (reason, warning) => {
    mocks.conversion = toConversion({ discardedTracks: [{ track: audioTrack, reason }] })
    expect(await convert()).toMatchObject({ type: 'done', warnings: [warning] })
  })

  test('何も外されなければ、注意なしで変換する', async () => {
    const result = await convert()
    expect(result).toMatchObject({ type: 'done', warnings: [] })
    expect(result?.type === 'done' && result.blob.type).toBe('video/webm')
  })
})
