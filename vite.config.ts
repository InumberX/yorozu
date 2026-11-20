import { reactRouter } from '@react-router/dev/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'

import { resolveBuildEnv } from './scripts/build-env.ts'

// yorozu は SPA モード（`ssr: false`）。React Router がクライアント資産を
// build/client に prerender で出力する。ランタイム Worker は Basic 認証と静的配信
// のみを担い、wrangler 側で別途バンドルするため、ここでは @cloudflare/vite-plugin は
// 使わない（SSR 用の外部化調整も不要）。

const now = new Date()
const nowDatetime =
  now.getFullYear() +
  ('0' + (now.getMonth() + 1)).slice(-2) +
  ('0' + now.getDate()).slice(-2) +
  ('0' + now.getHours()).slice(-2) +
  ('0' + now.getMinutes()).slice(-2) +
  ('0' + now.getSeconds()).slice(-2)
const CACHE_BUSTER = `ver=${nowDatetime}`
const LASTMOD =
  now.getFullYear() +
  '-' +
  ('0' + (now.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + now.getDate()).slice(-2) +
  'T' +
  ('0' + now.getHours()).slice(-2) +
  ':' +
  ('0' + now.getMinutes()).slice(-2) +
  ':' +
  ('0' + now.getSeconds()).slice(-2) +
  '+09:00'

const warmupConfig = () => {
  if (process.env.GIT_WORKTREE) {
    return undefined
  }

  return {
    clientFiles: ['./app/**/!(*.server|*.test|*.stories)*.tsx'],
  }
}

export default defineConfig(({ mode }) => {
  // For local deploys (`npm run deploy-development` etc.) load values from
  // `.env.<env>.local`. CLOUDFLARE_ENV reflects the deploy target; fall back
  // to Vite's own mode (development/production) for `npm run dev`/`build`.
  // process.env always wins so CI's workflow-injected vars take precedence.
  const envMode = process.env.CLOUDFLARE_ENV || mode
  const fileEnv = loadEnv(envMode, process.cwd(), '')
  const env = { ...fileEnv, ...process.env }
  // デプロイするビルドで SITE_URL が空なら、ここで例外を投げてビルドを止める。
  const buildEnv = resolveBuildEnv(env)

  return {
    build: {
      assetsInlineLimit: 0,
    },
    server: {
      warmup: warmupConfig(),
      fs: {
        strict: !process.env.GIT_WORKTREE,
      },
    },
    define: {
      'import.meta.env.VITE_NODE_ENV': JSON.stringify(buildEnv.NODE_ENV),
      'import.meta.env.VITE_NO_INDEX': JSON.stringify(buildEnv.NO_INDEX),
      'import.meta.env.VITE_SITE_URL': JSON.stringify(buildEnv.SITE_URL),
      'import.meta.env.VITE_SITE_NAME': JSON.stringify(buildEnv.SITE_NAME),
      'import.meta.env.VITE_GOOGLE_ANALYTICS_ID': JSON.stringify(buildEnv.GOOGLE_ANALYTICS_ID),
      'import.meta.env.VITE_CACHE_BUSTER': `"${CACHE_BUSTER}"`,
      'import.meta.env.VITE_LASTMOD': `"${LASTMOD}"`,
    },
    plugins: [reactRouter(), vanillaExtractPlugin(), devtoolsJson()],
    // 変換の Worker は、エンコーダー（jSquash）を必要になったときに読み込む（動的 import）。
    // 既定の iife ではコードを分けられないため、ES モジュールの Worker として出力する。
    worker: {
      format: 'es' as const,
    },
    resolve: {
      tsconfigPaths: true,
    },
  }
})
