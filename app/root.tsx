import { useEffect, type ReactNode } from 'react'
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
  useRouteLoaderData,
} from 'react-router'

import type { Route } from './+types/root'
import * as styles from './root.css'

import { LayoutPortal } from '~/components/common/LayoutPortal'
import { LANG } from '~/config/consts'
import { GOOGLE_ANALYTICS_ID } from '~/config/env'
import * as gtag from '~/utils/gtags.client'
import { getLang } from '~/utils/locale'

export const handle = {
  i18n: 'common',
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const lang = getLang(params)
  const url = new URL(request.url)
  const paths = url.pathname.split('/').splice(1)

  // 日本語は接頭辞なしが正。明示的な `/ja` はプレフィックス無しへ寄せる。
  if (lang === LANG.JA && paths.length > 0 && paths[0] === LANG.JA) {
    const redirectUrl = `${
      url.pathname.replace(new RegExp(`^/${LANG.JA}`), '/').replace(/\/\//g, '/') || '/'
    }${url.search}${url.hash}`
    throw redirect(redirectUrl)
  }

  return {
    lang,
  }
}

export function Layout({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const loaderData = useRouteLoaderData<typeof loader>('root')
  const lang = loaderData?.lang ?? i18n.language ?? LANG.JA

  return (
    <html lang={lang} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0f1b2d" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="twitter:site" content="@InumberX" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
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

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID) {
      return
    }

    gtag.pageview(location.pathname, GOOGLE_ANALYTICS_ID)
  }, [location.pathname])

  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  const { t, i18n } = useTranslation('common')
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  const title = isNotFound ? t('error.notFound.title') : t('error.errorMessageTitle')
  const lead = isNotFound ? t('error.notFound.lead') : ''
  // 現在のロケールに応じた戻り先。英語ページの 404 から JA トップへ飛ばさない。
  const backTo = i18n.language === LANG.EN ? '/en' : '/'

  return (
    <main className={styles.errorPage}>
      <div className={styles.errorPage_inner}>
        {isRouteErrorResponse(error) && <p className={styles.errorPage_status}>{error.status}</p>}
        <h1 className={styles.errorPage_title}>{title}</h1>
        {lead && <p className={styles.errorPage_lead}>{lead}</p>}
        <Link to={backTo} className={styles.errorPage_back}>
          {t('error.notFound.back')}
        </Link>
      </div>
    </main>
  )
}
