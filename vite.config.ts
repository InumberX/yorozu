import { reactRouter } from '@react-router/dev/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'

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
      'import.meta.env.VITE_NODE_ENV': `"${env.NODE_ENV || 'development'}"`,
      'import.meta.env.VITE_NO_INDEX': `"${env.NO_INDEX || ''}"`,
      'import.meta.env.VITE_SITE_URL': `"${env.SITE_URL || 'http://localhost:5173'}"`,
      'import.meta.env.VITE_SITE_NAME': `"${env.SITE_NAME || 'yorozu(development)'}"`,
      'import.meta.env.VITE_GOOGLE_ANALYTICS_ID': `"${env.GOOGLE_ANALYTICS_ID || 'G-0WRM57NTKL'}"`,
      'import.meta.env.VITE_CACHE_BUSTER': `"${CACHE_BUSTER}"`,
      'import.meta.env.VITE_LASTMOD': `"${LASTMOD}"`,
    },
    plugins: [reactRouter(), vanillaExtractPlugin(), devtoolsJson()],
    resolve: {
      tsconfigPaths: true,
    },
  }
})
