import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LANG } from '~/config/consts'
import { PAGES } from '~/config/paths'

type Props = {
  lang: string
}

export const LayoutHeader = ({ lang }: Props) => {
  const { t } = useTranslation('common')

  const navItems = useMemo(
    () => [
      { key: 'home', page: PAGES.YZ10_100 },
      { key: 'image', page: PAGES.YZ20_100 },
      { key: 'video', page: PAGES.YZ30_100 },
    ],
    []
  )

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
            url={PAGES.YZ10_100.getUrl({ lang: LANG.JA })}
            className={[styles.layoutHeaderLang_link, lang === LANG.JA && styles.layoutHeaderLang_link__current]
              .filter(Boolean)
              .join(' ')}
          >
            {t('header.language.ja')}
          </PrimitiveButton>
          <span className={styles.layoutHeaderLang_separator}>/</span>
          <PrimitiveButton
            url={PAGES.YZ10_100.getUrl({ lang: LANG.EN })}
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
