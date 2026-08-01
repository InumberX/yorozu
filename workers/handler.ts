import { createWorkerFetch } from '@inumberx/cloudflare-workers-basic-auth'

// Mirror of bindings declared in `wrangler.jsonc` plus Workers secrets set via
// `wrangler secret put`. Keep in sync manually whenever `wrangler.jsonc`
// changes; `npm run build` does not regenerate this type.
export type WorkerEnv = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
  ASSETS: Fetcher
}

// yorozu は SPA（ssr:false）。ランタイム SSR は無いため、GET/HEAD は static-asset
// バインディング（ASSETS）が prerender 済み HTML / SPA フォールバックを返す。
// createWorkerFetch は Basic 認証 → ASSETS 転送 → handler フォールバックの順で処理
// するので、handler は最終フォールバックの 404 のみを担う。
export function createHandleWorkerRequest() {
  return createWorkerFetch<WorkerEnv>({
    handler: () => new Response('Not Found', { status: 404 }),
    realm: 'Yorozu',
    basicAuth: (env) => ({ user: env.BASIC_AUTH_USER, pass: env.BASIC_AUTH_PASS }),
    assets: (env) => env.ASSETS,
  })
}
