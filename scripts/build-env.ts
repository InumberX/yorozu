// ビルド時に埋め込む値（vite.config.ts の define）を、環境変数から決める。
//
// デプロイ先（CLOUDFLARE_ENV）を指定したビルドでは、SITE_URL が空ならビルドを失敗させる。
// 既定値で通すと、canonical・og:url・og:image が開発用の URL のまま公開されるため。
// デプロイ先のないビルド（`npm run build`、push.yml の build）は公開しないので、開発用の既定値で通す。
//
// GOOGLE_ANALYTICS_ID には既定値を置かない。渡したビルドだけが gtag を出す。
// 既定値に本番の ID を置くと、開発・ローカルビルド・変数の漏れた staging が本番に計測を送る。

export const DEFAULT_SITE_URL = 'http://localhost:5173'
export const DEFAULT_SITE_NAME = 'yorozu(development)'

type BuildEnvSource = Record<string, string | undefined>

export type BuildEnv = {
  NODE_ENV: string
  NO_INDEX: string
  SITE_URL: string
  SITE_NAME: string
  GOOGLE_ANALYTICS_ID: string
}

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const resolveBuildEnv = (env: BuildEnvSource): BuildEnv => {
  const deployTarget = env.CLOUDFLARE_ENV?.trim()
  const siteUrl = env.SITE_URL?.trim() ?? ''

  if (deployTarget && !siteUrl) {
    throw new Error(
      `SITE_URL が空です（CLOUDFLARE_ENV=${deployTarget}）。デプロイするビルドには SITE_URL が必要です。` +
        'CI では GitHub Environment の変数、ローカルでは .env.<環境>.local に設定してください。'
    )
  }

  if (siteUrl && !isHttpUrl(siteUrl)) {
    throw new Error(`SITE_URL が http(s) の URL ではありません: ${siteUrl}`)
  }

  return {
    NODE_ENV: env.NODE_ENV || 'development',
    NO_INDEX: env.NO_INDEX || '',
    // canonical などは `${SITE_URL}${pathname}` で組み立てるので、末尾のスラッシュは落とす。
    SITE_URL: (siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, ''),
    SITE_NAME: env.SITE_NAME || DEFAULT_SITE_NAME,
    GOOGLE_ANALYTICS_ID: env.GOOGLE_ANALYTICS_ID?.trim() ?? '',
  }
}
