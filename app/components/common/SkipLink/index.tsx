import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

type Props = {
  // 飛び先（本文の要素）の id
  targetId: string
}

// キーボードで操作する閲覧者が、ヘッダーのナビを飛ばして本文へ移れるようにする。
// ページの先頭（最初に Tab で止まる位置）に置く。
export const SkipLink = ({ targetId }: Props) => {
  const { t } = useTranslation('common')

  return (
    <a href={`#${targetId}`} className={styles.skipLink}>
      {t('skipLink')}
    </a>
  )
}
