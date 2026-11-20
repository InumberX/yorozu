import type { Plugin } from 'vite'

// ビルド時に埋め込む値（vite.config.ts の define）を、環境変数から決める。
// vite.config.ts からだけ読む。app のコードは、埋め込まれた値を `~/config/env` から読む。
//
// - SITE_URL: デプロイするビルド（CLOUDFLARE_ENV あり）で空なら、ビルドを失敗させる（assertDeployBuildEnvPlugin）。
//   既定値で通すと、canonical・og:url・og:image が開発用の URL のまま公開されるため。
//   デプロイしないビルド（`npm run build`、push.yml の build）と、開発サーバー・typegen は
//   開発用の既定値で通す。typegen も command 'build' で vite.config を読むので、設定の読み込みでは
//   確かめず、実際にバンドルするとき（プラグインの buildStart）に確かめる。
// - NO_INDEX: staging（CLOUDFLARE_ENV=development）で空なら 'true' にする。変数が漏れても
//   staging が index されないように。開発サーバーでは NODE_ENV が production でないので、この値に
//   関係なく noindex になる（`app/utils/meta.ts`）。そのためビルドかどうかは見ない。'true' / 'false' / 空 以外は、綴りの誤りとして失敗させる
//   （`app/utils/meta.ts` は 'true' としか比べないので、'TRUE' や '1' は黙って index 可能になる）。
// - GOOGLE_ANALYTICS_ID: 既定値を置かない。渡したビルドだけが gtag を出す。
//   既定値に本番の ID を置くと、開発・ローカルビルド・変数の漏れた staging が本番に計測を送る。

export const DEFAULT_SITE_URL = 'http://localhost:5173'
export const DEFAULT_SITE_NAME = 'yorozu(development)'
export const STAGING_DEPLOY_TARGET = 'development'

type BuildEnvSource = Record<string, string | undefined>

export type BuildEnv = {
  NODE_ENV: string
  NO_INDEX: string
  SITE_URL: string
  SITE_NAME: string
  GOOGLE_ANALYTICS_ID: string
}

const NO_INDEX_VALUES = ['', 'true', 'false']

// 空白だけの値は、空として扱う。
const readEnv = (env: BuildEnvSource, key: string) => env[key]?.trim() ?? ''

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const resolveBuildEnv = (env: BuildEnvSource): BuildEnv => {
  const read = (key: string) => readEnv(env, key)

  const deployTarget = read('CLOUDFLARE_ENV')
  const siteUrl = read('SITE_URL')
  const noIndex = read('NO_INDEX')

  if (siteUrl && !isHttpUrl(siteUrl)) {
    throw new Error(`SITE_URL が http(s) の URL ではありません: ${siteUrl}`)
  }

  if (!NO_INDEX_VALUES.includes(noIndex)) {
    throw new Error(`NO_INDEX は 'true' か 'false' か空にしてください: ${noIndex}`)
  }

  return {
    NODE_ENV: read('NODE_ENV') || 'development',
    NO_INDEX: deployTarget === STAGING_DEPLOY_TARGET && noIndex === '' ? 'true' : noIndex,
    // canonical などは `${SITE_URL}${pathname}` で組み立てるので、末尾のスラッシュは落とす。
    SITE_URL: (siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, ''),
    SITE_NAME: read('SITE_NAME') || DEFAULT_SITE_NAME,
    GOOGLE_ANALYTICS_ID: read('GOOGLE_ANALYTICS_ID'),
  }
}

// デプロイするビルドで SITE_URL が空なら、例外を投げてビルドを止める。
// 設定の読み込みでは呼ばず、assertDeployBuildEnvPlugin の buildStart から呼ぶ（上の説明を参照）。
export const assertDeployBuildEnv = (env: BuildEnvSource) => {
  const deployTarget = readEnv(env, 'CLOUDFLARE_ENV')
  if (deployTarget && !readEnv(env, 'SITE_URL')) {
    throw new Error(
      `SITE_URL が空です（CLOUDFLARE_ENV=${deployTarget}）。デプロイするビルドには SITE_URL が必要です。` +
        'CI では GitHub Environment の変数、ローカルでは .env.<環境>.local に設定してください。'
    )
  }
}

// assertDeployBuildEnv を、実際にバンドルするとき（`vite build` の buildStart）だけ走らせるプラグイン。
// typegen は command 'build' で vite.config を読むだけで buildStart は走らないので、型チェックと
// 開発サーバーは止まらない。
export const assertDeployBuildEnvPlugin = (env: BuildEnvSource): Plugin => ({
  name: 'yorozu:assert-deploy-build-env',
  apply: 'build',
  buildStart() {
    assertDeployBuildEnv(env)
  },
})
