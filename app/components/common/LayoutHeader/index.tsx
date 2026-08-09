import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import * as styles from './style.css'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LANG } from '~/config/consts'
import { PAGES } from '~/config/paths'

type Props = {
  lang: string
}

export const LayoutHeader = ({ lang }: Props) => {
  const { t } = useTranslation('common')
  const location = useLocation()

  const navItems = useMemo(
    () => [
      { key: 'home', page: PAGES.YZ10_100 },
      { key: 'image', page: PAGES.YZ20_100 },
      { key: 'video', page: PAGES.YZ30_100 },
    ],
    []
  )

  // 言語切り替えは現在のページを保ったまま、対象ロケールの URL へ遷移する。
  // JA=接頭辞なし / EN=/en。現在パスから /en を剥がして基準（JA）パスを求める。
  const buildLocaleUrl = (target: string) => {
    const basePath = location.pathname.replace(/^\/en(?=\/|$)/, '') || '/'
    if (target === LANG.EN) {
      return basePath === '/' ? '/en' : `/en${basePath}`
    }
    return basePath
  }

  return (
    <header className={styles.layoutHeader}>
      <div className={styles.layoutHeader_container}>
        <PrimitiveButton url={PAGES.YZ10_100.getUrl({ lang })} className={styles.layoutHeaderBrand}>
          {t('header.brand')}
        </PrimitiveButton>

        <nav className={styles.layoutHeaderNav} aria-label="global">
          <ul className={styles.layoutHeaderNav_items}>
            {navItems.map(({ key, page }) => (
              <li key={key} className={styles.layoutHeaderNav_item}>
                <PrimitiveButton url={page.getUrl({ lang })} className={styles.layoutHeaderNavLink}>
                  {page.getName({ lang })}
                </PrimitiveButton>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.layoutHeaderLang}>
          <PrimitiveButton
            url={buildLocaleUrl(LANG.JA)}
            className={[styles.layoutHeaderLang_link, lang === LANG.JA && styles.layoutHeaderLang_link__current]
              .filter(Boolean)
              .join(' ')}
          >
            {t('header.language.ja')}
          </PrimitiveButton>
          <span className={styles.layoutHeaderLang_separator}>/</span>
          <PrimitiveButton
            url={buildLocaleUrl(LANG.EN)}
            className={[styles.layoutHeaderLang_link, lang === LANG.EN && styles.layoutHeaderLang_link__current]
              .filter(Boolean)
              .join(' ')}
          >
            {t('header.language.en')}
          </PrimitiveButton>
        </div>
      </div>
    </header>
  )
}
