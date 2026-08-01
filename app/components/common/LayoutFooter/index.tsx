import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

export const LayoutFooter = () => {
  const { t } = useTranslation('common')

  return (
    <footer className={styles.layoutFooter}>
      <div className={styles.layoutFooter_container}>
        <p className={styles.layoutFooter_note}>{t('footer.note')}</p>
        <p className={styles.layoutFooter_copyright}>{t('footer.copyright')}</p>
      </div>
    </footer>
  )
}
