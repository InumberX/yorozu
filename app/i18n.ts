import { LANG } from '~/config/consts'
import enCommon from '~/locales/en/common.json'
import enPagesYZ10_100 from '~/locales/en/pages/YZ10_100.json'
import enPagesYZ20_100 from '~/locales/en/pages/YZ20_100.json'
import enPagesYZ30_100 from '~/locales/en/pages/YZ30_100.json'
import jaCommon from '~/locales/ja/common.json'
import jaPagesYZ10_100 from '~/locales/ja/pages/YZ10_100.json'
import jaPagesYZ20_100 from '~/locales/ja/pages/YZ20_100.json'
import jaPagesYZ30_100 from '~/locales/ja/pages/YZ30_100.json'

export const i18n = {
  supportedLngs: [LANG.EN, LANG.JA],
  fallbackLng: LANG.JA,
  defaultNS: 'common',
  react: {
    useSuspense: false,
  },
  resources: {
    en: {
      common: enCommon,
      'pages/YZ10_100': enPagesYZ10_100,
      'pages/YZ20_100': enPagesYZ20_100,
      'pages/YZ30_100': enPagesYZ30_100,
    },
    ja: {
      common: jaCommon,
      'pages/YZ10_100': jaPagesYZ10_100,
      'pages/YZ20_100': jaPagesYZ20_100,
      'pages/YZ30_100': jaPagesYZ30_100,
    },
  },
}

// All namespaces bundled in the i18n resources. Resources are provided inline
// (no backend), so the full set is always available in the store regardless of
// which subset is requested at init time.
export const i18nNamespaces = Object.keys(i18n.resources[LANG.JA])
