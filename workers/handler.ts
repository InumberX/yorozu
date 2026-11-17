import { createWorkerFetch } from '@inumberx/cloudflare-workers-basic-auth'

// Mirror of bindings declared in `wrangler.jsonc` plus Workers secrets set via
// `wrangler secret put`. Keep in sync manually whenever `wrangler.jsonc`
// changes; `npm run build` does not regenerate this type.
export type WorkerEnv = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
  ASSETS: Fetcher
}

// React Router が出力する SPA フォールバック（root だけを描画するシェル）。ASSETS の
// html_handling が `.html` を外した URL へリダイレクトするため、拡張子なしで取得する。
export const SPA_FALLBACK_PATH = '/__spa-fallback'

const plainNotFound = () => new Response('Not Found', { status: 404 })

// prerender していないパスの 404。
// wrangler.jsonc の not_found_handling を "single-page-application" にすると、ASSETS は未知の
// パスに JA ホームの index.html を 200 で返す。すると /fr はホームとして表示され、/fr/image は
// /fr/image.data にも HTML が返って壊れたエラー画面になる。そのため ASSETS は 404 を返す設定
// （"none"）にし、ここで 404 を組み立てる。
// - ページの遷移（Accept に text/html）: SPA フォールバックを 404 で返す。クライアントの
//   React Router が /<path>.data を取りに行き、それが 404 なので root の ErrorBoundary が 404 を出す。
// - それ以外（`.data`・JS・画像など）: プレーンな 404。HTML を返すと呼び出し側が壊れる。
export const createNotFoundResponse = async (request: Request, env: WorkerEnv) => {
  const url = new URL(request.url)
  const isPageRequest =
    (request.method === 'GET' || request.method === 'HEAD') &&
    !url.pathname.endsWith('.data') &&
    (request.headers.get('Accept') ?? '').includes('text/html')
  if (!isPageRequest) {
    return plainNotFound()
  }

  const fallback = await env.ASSETS.fetch(new Request(new URL(SPA_FALLBACK_PATH, url), { headers: request.headers }))
  if (!fallback.ok) {
    return plainNotFound()
  }
  return new Response(request.method === 'HEAD' ? null : fallback.body, {
    status: 404,
    headers: fallback.headers,
  })
}

// yorozu は SPA（ssr:false）。ランタイム SSR は無いため、GET/HEAD は static-asset
// バインディング（ASSETS）が prerender 済み HTML を返す。
// createWorkerFetch は Basic 認証 → ASSETS 転送 → handler フォールバックの順で処理
// するので、handler は ASSETS に無いものの 404 を担う。handler には env が渡らないため、
// リクエストごとに env を閉じ込めた handler で組み立てる。
export function createHandleWorkerRequest() {
  return (request: Request, env: WorkerEnv) => {
    const workerFetch = createWorkerFetch<WorkerEnv>({
      handler: (notFoundRequest) => createNotFoundResponse(notFoundRequest, env),
      realm: 'Yorozu',
      basicAuth: (workerEnv) => ({ user: workerEnv.BASIC_AUTH_USER, pass: workerEnv.BASIC_AUTH_PASS }),
      assets: (workerEnv) => workerEnv.ASSETS,
    })
    return workerFetch(request, env)
  }
}
