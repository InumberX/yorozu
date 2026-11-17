// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, test, vi } from 'vitest'

import { createHandleWorkerRequest, SPA_FALLBACK_PATH, type WorkerEnv } from '../../workers/handler'

const FALLBACK_HTML = '<!DOCTYPE html><html lang="ja"><title>fallback</title></html>'
const HTML_ACCEPT = 'text/html,application/xhtml+xml,*/*;q=0.8'

// prerender 済みの /image だけを持ち、それ以外は 404 を返す ASSETS（not_found_handling: "none" と同じ）。
const createEnv = (env: Partial<WorkerEnv> = {}) => {
  const fetch = vi.fn(async (input: RequestInfo | URL) => {
    const { pathname } = new URL(input instanceof Request ? input.url : input)
    if (pathname === SPA_FALLBACK_PATH) {
      return new Response(FALLBACK_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }
    if (pathname === '/image/') {
      return new Response('image page', { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }
    return new Response('Not Found', { status: 404 })
  })
  return { fetch, env: { ASSETS: { fetch } as unknown as Fetcher, ...env } }
}

const handle = createHandleWorkerRequest()

describe('workers/handler', () => {
  test('ASSETS にあるページはそのまま返す', async () => {
    const { env } = createEnv()
    const response = await handle(new Request('https://yorozu.test/image/', { headers: { Accept: HTML_ACCEPT } }), env)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('image page')
  })

  test.each(['/fr', '/fr/image', '/nope', '/en/nope'])(
    '未列挙のページ %s は SPA フォールバックを 404 で返す',
    async (path) => {
      const { env } = createEnv()
      const response = await handle(
        new Request(`https://yorozu.test${path}`, { headers: { Accept: HTML_ACCEPT } }),
        env
      )
      expect(response.status).toBe(404)
      expect(response.headers.get('Content-Type')).toContain('text/html')
      expect(await response.text()).toBe(FALLBACK_HTML)
    }
  )

  test('HEAD は本文なしの 404', async () => {
    const { env } = createEnv()
    const response = await handle(
      new Request('https://yorozu.test/fr', { method: 'HEAD', headers: { Accept: HTML_ACCEPT } }),
      env
    )
    expect(response.status).toBe(404)
    expect(await response.text()).toBe('')
  })

  test.each([
    ['.data（ブラウザが text/html を受け付けると送っても）', '/fr/image.data', HTML_ACCEPT],
    ['ファイル', '/assets/nope.js', '*/*'],
  ])('%s はプレーンな 404 で、SPA フォールバックを取りに行かない', async (_, path, accept) => {
    const { env, fetch } = createEnv()
    const response = await handle(new Request(`https://yorozu.test${path}`, { headers: { Accept: accept } }), env)
    expect(response.status).toBe(404)
    expect(response.headers.get('Content-Type')).not.toContain('text/html')
    expect(
      fetch.mock.calls.map(([input]) => new URL(String(input instanceof Request ? input.url : input)).pathname)
    ).not.toContain(SPA_FALLBACK_PATH)
  })

  test('Basic 認証が設定されていれば、404 より先に認証を求める', async () => {
    const { env } = createEnv({ BASIC_AUTH_USER: 'user', BASIC_AUTH_PASS: 'pass' })
    const response = await handle(new Request('https://yorozu.test/fr', { headers: { Accept: HTML_ACCEPT } }), env)
    expect(response.status).toBe(401)
  })
})

describe('wrangler.jsonc', () => {
  // "single-page-application" に戻すと、未列挙パスに JA ホームが 200 で返り、上の 404 が効かなくなる。
  test('ASSETS は未列挙パスに 404 を返す（not_found_handling: "none"）', () => {
    const config = readFileSync(new URL('../../wrangler.jsonc', import.meta.url), 'utf8')
    expect(config).toMatch(/^\s*"not_found_handling":\s*"none",?\s*$/m)
  })
})
