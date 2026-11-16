import { useEffect, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import * as styles from './style.css'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LANG } from '~/config/consts'
import { CACHE_BUSTER } from '~/config/env'
import { PAGES } from '~/config/paths'
import { BREAKPOINTS } from '~/styles/variables/breakpoints.css'

type Props = {
  lang: string
}

// 末尾スラッシュの有無で現在地判定がずれないようにそろえる。
const normalizePath = (path: string) => {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

export const LayoutHeader = ({ lang }: Props) => {
  const { t } = useTranslation('common')
  const location = useLocation()
  const menuId = useId()
  // SP メニューを開いたときのパス。別のページへ移動したら（パスが変わったら）閉じた扱いにする。
  const [menuOpenedPath, setMenuOpenedPath] = useState<string | null>(null)
  const isMenuOpen = menuOpenedPath === location.pathname
  // 開閉のアニメーションは、閲覧者がメニューを操作したときだけかける。
  // 常にかけると、PC → SP へ幅が変わったときに「開 → 閉」の変化として
  // メニューが一瞬見えてしまうため。
  const [isMenuAnimated, setIsMenuAnimated] = useState(false)

  const navItems = useMemo(
    () => [
      { key: 'home', page: PAGES.YZ10_100 },
      { key: 'image', page: PAGES.YZ20_100 },
      { key: 'video', page: PAGES.YZ30_100 },
    ],
    []
  )

  const currentPath = normalizePath(location.pathname)

  // SP メニューは Esc で閉じる。
  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpenedPath(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  // PC / SP が切り替わったら、メニューをアニメーションなしで閉じる。
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia(`(width >= ${BREAKPOINTS.sm}px)`)
    const handleChange = () => {
      setIsMenuAnimated(false)
      setMenuOpenedPath(null)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuAnimated(true)
    setMenuOpenedPath(isMenuOpen ? null : location.pathname)
  }

  // 言語切り替えは現在のページを保ったまま、対象ロケールの URL へ遷移する。
  // JA=接頭辞なし / EN=/en。現在パスから /en を剥がして基準（JA）パスを求める。
  const buildLocaleUrl = (target: string) => {
    const basePath = location.pathname.replace(/^\/en(?=\/|$)/, '') || '/'
    if (target === LANG.EN) {
      return basePath === '/' ? '/en' : `/en${basePath}`
    }
    return basePath
  }

  const languages = [
    { code: LANG.JA, label: t('header.language.ja') },
    { code: LANG.EN, label: t('header.language.en') },
  ]

  return (
    <header className={styles.layoutHeader}>
      <LayoutInner size="full">
        <div className={styles.layoutHeader_container}>
          <PrimitiveButton url={PAGES.YZ10_100.getUrl({ lang })} className={styles.layoutHeaderBrand}>
            <img
              src={`/assets/img/img-logo-cyber-medium.svg?${CACHE_BUSTER}`}
              alt={t('header.brand')}
              width={287}
              height={75}
              className={styles.layoutHeaderBrand_logo}
            />
          </PrimitiveButton>

          <nav
            id={menuId}
            className={[
              styles.layoutHeaderNav,
              isMenuAnimated && styles.layoutHeaderNav__animated,
              isMenuOpen && styles.layoutHeaderNav__open,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={t('header.navLabel')}
          >
            <ul className={styles.layoutHeaderNav_items}>
              {navItems.map(({ key, page }) => {
                const isCurrent = normalizePath(page.getUrl({ lang })) === currentPath

                return (
                  <li key={key} className={styles.layoutHeaderNav_item}>
                    <PrimitiveButton
                      url={page.getUrl({ lang })}
                      ariaCurrent={isCurrent ? 'page' : undefined}
                      className={styles.layoutHeaderNavLink}
                    >
                      {t(`header.nav.${key}`)}
                      {isCurrent && <span aria-hidden="true" className={styles.layoutHeaderNavLink_marker} />}
                    </PrimitiveButton>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className={styles.layoutHeaderLang} role="group" aria-label={t('header.language.label')}>
            {languages.map(({ code, label }, index) => (
              <span key={code} className={styles.layoutHeaderLang_item}>
                {index > 0 && (
                  <span aria-hidden="true" className={styles.layoutHeaderLang_separator}>
                    /
                  </span>
                )}
                <PrimitiveButton
                  url={buildLocaleUrl(code)}
                  lang={code}
                  hrefLang={code}
                  ariaCurrent={lang === code ? 'true' : undefined}
                  className={styles.layoutHeaderLang_link}
                >
                  <span className={styles.layoutHeaderLang_label}>{label}</span>
                </PrimitiveButton>
              </span>
            ))}
          </div>

          <PrimitiveButton
            onClick={toggleMenu}
            ariaLabel={isMenuOpen ? t('header.menu.close') : t('header.menu.open')}
            ariaControls={menuId}
            ariaExpanded={isMenuOpen}
            className={styles.layoutHeaderMenuButton}
          >
            <span aria-hidden="true" className={styles.layoutHeaderMenuButton_icon} />
          </PrimitiveButton>
        </div>
      </LayoutInner>
    </header>
  )
}
