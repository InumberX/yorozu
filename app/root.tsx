import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from 'react-router'

import type { Route } from './+types/root'
import * as styles from './root.css'

import { LayoutPortal } from '~/components/common/LayoutPortal'
import { LANG } from '~/config/consts'
import { GOOGLE_ANALYTICS_ID } from '~/config/env'
import { ZodProvider } from '~/providers/ZodProvider'
import * as gtag from '~/utils/gtag.client'
import { getLang, getLangFromPathname, getSiteInfo, shouldRevalidateOnLangChange } from '~/utils/locale'

export const handle = {
  i18n: 'common',
}

// lang が変わったら再検証する（理由は shouldRevalidateOnLangChange のコメント）。
export const shouldRevalidate = shouldRevalidateOnLangChange

export async function loader({ request, params }: Route.LoaderArgs) {
  const lang = getLang(params)
  const url = new URL(request.url)
  const paths = url.pathname.split('/').splice(1)

  // 日本語は接頭辞なしが正。明示的な `/ja` はプレフィックス無しへ寄せる。
  if (lang === LANG.JA && paths.length > 0 && paths[0] === LANG.JA) {
    // 接頭辞を `/` へ置き換えるとスラッシュが1つ増え、`//evil.com` のような
    // プロトコル相対 URL になる。置き換えず除去するだけにしたうえで、
    // 文字列として検査せず自サイトのオリジンに解決できるかで判定する。
    const stripped = url.pathname.replace(new RegExp(`^/${LANG.JA}`), '') || '/'
    const candidate = new URL(`${stripped}${url.search}${url.hash}`, url.origin)
    const redirectUrl =
      candidate.origin === url.origin ? `${candidate.pathname}${candidate.search}${candidate.hash}` : '/'
    throw redirect(redirectUrl)
  }

  return {
    lang,
  }
}

export function Layout({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const location = useLocation()
  // 正常なページでは root の loaderData の lang と一致する。404 では loaderData が
  // SPA フォールバック（JA）のものになるため、URL から求める。
  const lang = getLangFromPathname(location.pathname)

  return (
    <html lang={lang} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#05080b" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="twitter:site" content="@InumberX" />
        {/* SVG に対応していないブラウザ向けに favicon.ico も置く。ico の sizes は、SVG と並べるときに広く使われている 32x32 にする。 */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
        {/* Android のホーム画面・アプリとしてのインストール用（android-icon-*.png） */}
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* デザイン案A のフォント（和文・見出し: Zen Kaku Gothic New / 英数字: Share Tech Mono）。
            将来 COOP/COEP を付与する場合は、自前配信へ切り替える必要がある。 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap"
        />
        <Meta />
        <Links />
        {GOOGLE_ANALYTICS_ID && (
          <>
            <script
              async
              suppressHydrationWarning
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
            />
            <script
              async
              id="gtag-init"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GOOGLE_ANALYTICS_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <div className={styles.layoutRoot}>
          {children}
          <LayoutPortal />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function RootRoute({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData
  const { i18n } = useTranslation()
  const location = useLocation()
  // 初回ロードの page_view は Layout 内のインライン gtag('config') が送信済みのため、
  // 初回の effect 実行はスキップし、以降の SPA 遷移のみを送信する（二重計測の防止）。
  const isFirstPageview = useRef(true)

  // 言語は描画前（useLayoutEffect）にそろえる。useEffect だと描画後になり、言語を切り替えた直後に
  // URL・aria-current は新しい言語なのに文言は前の言語、という画面が 1 フレーム見える（計測済み）。
  // リソースはインラインなので changeLanguage は同期で終わり、その再描画も描画前に反映される。
  useLayoutEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID) {
      return
    }

    if (isFirstPageview.current) {
      isFirstPageview.current = false
      return
    }

    gtag.pageview(location.pathname, GOOGLE_ANALYTICS_ID)
  }, [location.pathname])

  return (
    <ZodProvider>
      <Outlet />
    </ZodProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const { t } = useTranslation('common')
  const location = useLocation()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  // ロケールは URL を真実とする。未列挙パスは SPA フォールバック（JA シェル）が 404 で返るため
  // i18n.language は 'ja' になりがちだが、/en 配下の 404 は英語で表示し /en へ戻す。
  const lang = getLangFromPathname(location.pathname)
  const backTo = lang === LANG.EN ? '/en' : '/'

  // 404 とそれ以外で文言を分ける。404 以外（読み込みの失敗、描画中の例外など）は原因を利用者に出さず、
  // 「問題が発生しました」と、時間をおいて試す案内だけを出す。
  const key = isNotFound ? 'error.notFound' : 'error.general'
  const title = t(`${key}.title`, { lng: lang })
  const lead = t(`${key}.lead`, { lng: lang })
  // エラー時はページの meta が出ないため、タイトルをここで出す（React 19 が head へ移す）。
  const { SITE_NAME } = getSiteInfo({ lang })
  const documentTitle = `${title} | ${SITE_NAME}`

  return (
    <main className={styles.errorPage}>
      <title>{documentTitle}</title>
      <div className={styles.errorPage_inner}>
        {isRouteErrorResponse(error) && <p className={styles.errorPage_status}>{error.status}</p>}
        <h1 className={styles.errorPage_title}>{title}</h1>
        <p className={styles.errorPage_lead}>{lead}</p>
        <Link to={backTo} className={styles.errorPage_back}>
          {t(`${key}.back`, { lng: lang })}
        </Link>
      </div>
    </main>
  )
}
