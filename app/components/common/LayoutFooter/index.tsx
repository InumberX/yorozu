import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { CACHE_BUSTER } from '~/config/env'
import { PAGES } from '~/config/paths'

type Props = {
  lang: string
}

export const LayoutFooter = ({ lang }: Props) => {
  const { t } = useTranslation('common')

  const navGroups = [
    {
      key: 'tools',
      items: [
        { key: 'image', url: PAGES.YZ20_100.getUrl({ lang }) },
        { key: 'video', url: PAGES.YZ30_100.getUrl({ lang }) },
      ],
    },
    {
      key: 'links',
      items: [
        { key: 'request', url: 'https://github.com/InumberX/yorozu/issues' },
        { key: 'github', url: 'https://github.com/InumberX' },
        { key: 'afterworks', url: 'https://afterworks.jp' },
      ],
    },
  ] as const

  return (
    <footer className={styles.layoutFooter}>
      <LayoutInner>
        <div className={styles.layoutFooter_container}>
          <div className={styles.layoutFooterBrand}>
            <img
              src={`/assets/img/img-logo-cyber-medium.svg?${CACHE_BUSTER}`}
              alt={t('footer.brand')}
              width={287}
              height={75}
              className={styles.layoutFooterBrand_logo}
            />
            <p lang="en" translate="no" className={styles.layoutFooterBrand_tagline}>
              {t('footer.tagline')}
            </p>
          </div>

          {navGroups.map(({ key, items }) => (
            <nav
              key={key}
              aria-label={t(`footer.${key}.label`)}
              className={[styles.layoutFooterNav, styles[`layoutFooterNav__${key}`]].join(' ')}
            >
              <p lang="en" translate="no" className={styles.layoutFooterNav_title}>
                {t(`footer.${key}.title`)}
              </p>
              <ul className={styles.layoutFooterNav_items}>
                {items.map((item) => (
                  <li key={item.key}>
                    <PrimitiveButton url={item.url} className={styles.layoutFooterNav_link}>
                      {t(`footer.${key}.${item.key}`)}
                    </PrimitiveButton>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </LayoutInner>

      <div className={styles.layoutFooterCopy}>
        <LayoutInner>
          <p>
            <small lang="en" translate="no" className={styles.layoutFooterCopy_text}>
              {t('footer.copyright')}
            </small>
          </p>
        </LayoutInner>
      </div>
    </footer>
  )
}
