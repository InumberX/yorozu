import { type Params, type ShouldRevalidateFunctionArgs } from 'react-router'

import { LANG, PAGE_INFO, SITE_INFO } from '~/config/consts'

export const getLang = (params: Params<string>) => {
  const lang = params.lang ?? LANG.JA

  switch (lang) {
    case LANG.EN:
      return LANG.EN
    case LANG.JA:
      return LANG.JA
    default:
      throw new Response(null, {
        status: 404,
        statusText: `Not Found: Invalid language ${lang}`,
      })
  }
}

// `ssr: false` では、loader を持つルートは「自分の path に含まれるパラメータ」が変わったときしか
// 再検証されない（React Router の getShouldRevalidateFunction）。`:lang?` を path に持つのは
// `layout-public` だけなので、root と各ページは /image ⇄ /en/image の
// クライアント遷移で loaderData の lang が古いまま残る。lang を loader から読むルートはこれを export する。
export const shouldRevalidateOnLangChange = ({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) => {
  return currentParams.lang !== nextParams.lang || defaultShouldRevalidate
}

// URL のパスから言語を求める（JA=接頭辞なし / EN=/en）。prerender されていないパスの 404 では
// root の loaderData が SPA フォールバック（JA）のものになるため、表示言語は URL を正とする。
export const getLangFromPathname = (pathname: string) => {
  return /^\/en(?:\/|$)/.test(pathname) ? LANG.EN : LANG.JA
}

export const getLangRoute = ({ lang }: { lang?: string }) => {
  const effectiveLang = lang ?? LANG.JA
  return effectiveLang === LANG.JA ? '' : `/${effectiveLang}`
}

export const getPageInfo = ({ lang }: { lang?: string }) => {
  switch (lang) {
    case LANG.EN:
      return PAGE_INFO.EN
    default:
      return PAGE_INFO.JA
  }
}

export const getSiteInfo = ({ lang }: { lang?: string }) => {
  switch (lang) {
    case LANG.EN:
      return SITE_INFO.EN
    default:
      return SITE_INFO.JA
  }
}
