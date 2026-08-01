import { createInstance } from 'i18next'
import { renderToReadableStream } from 'react-dom/server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { type EntryContext, ServerRouter } from 'react-router'

import { getLocale, i18nNamespaces } from './i18next.server'

import { i18n } from '~/i18n'

// yorozu は SPA モード（ssr:false）。この entry はランタイムでは動かず、ビルド時の
// prerender で各ルートを一度だけ HTML 化するためだけに使われる。ロケール別（JA/EN）
// の静的 HTML を出力できるよう i18n インスタンスを言語付きで初期化する。
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext
) {
  const instance = createInstance()
  const lng = getLocale(request)

  await instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns: i18nNamespaces,
  })

  responseHeaders.set('X-Content-Type-Options', 'nosniff')

  const body = await renderToReadableStream(
    <I18nextProvider i18n={instance}>
      <ServerRouter context={reactRouterContext} url={request.url} />
    </I18nextProvider>,
    {
      onError(error) {
        console.error(error)
        responseStatusCode = 500
      },
    }
  )

  await body.allReady

  responseHeaders.set('Content-Type', 'text/html')
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}
