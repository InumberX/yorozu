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

// SPA フォールバックはビルド出力にあるため ASSETS から公開 URL として取れてしまう。直接開くと
// 画面は 404 なのにステータスが 200 になるので、ASSETS には無いものとして扱う。
const isSpaFallbackPath = (pathname: string) => {
  return /^\/__spa-fallback(?:\.html|\/)?$/.test(pathname)
}

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

  // 閲覧者のリクエストヘッダーは渡さない。If-None-Match などが付いていると ASSETS が 304 を返し、
  // 404 ページの代わりにプレーンな 404 になる。
  const fallback = await env.ASSETS.fetch(new URL(SPA_FALLBACK_PATH, url))
  if (!fallback.ok) {
    return plainNotFound()
  }
  // 検証子は外す。404 に付けておくと次のリクエストが条件付きになり、それに答える意味も無い。
  const headers = new Headers(fallback.headers)
  headers.delete('ETag')
  headers.delete('Last-Modified')
  return new Response(request.method === 'HEAD' ? null : fallback.body, {
    status: 404,
    headers,
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
      // SPA フォールバックへの直接アクセスは ASSETS に無いものとして handler（404）へ回す。
      // Basic 認証より後に判定されるよう、ここで ASSETS を包む。
      assets: (workerEnv) =>
        ({
          fetch: (assetRequest: Request) =>
            isSpaFallbackPath(new URL(assetRequest.url).pathname)
              ? Promise.resolve(plainNotFound())
              : workerEnv.ASSETS.fetch(assetRequest),
        }) as Fetcher,
    })
    return workerFetch(request, env)
  }
}
