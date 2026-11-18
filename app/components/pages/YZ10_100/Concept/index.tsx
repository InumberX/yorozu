import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { SectionTitle } from '~/components/pages/YZ10_100/SectionTitle'
import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutSection } from '~/components/ui/layouts/LayoutSection'
import { BasePanel } from '~/components/ui/panels/BasePanel'
import { EXTERNAL_LINKS } from '~/config/consts'

export const Concept = () => {
  const { t } = useTranslation('pages/YZ10_100')

  return (
    <LayoutSection topSpace="topSpaceNone" bottomSpace="bottomSpaceNone">
      <LayoutInner>
        <BasePanel>
          <SectionTitle label="SEC.02" title={t('concept.heading')} />

          <ul className={styles.conceptItems}>
            {(['device', 'worker'] as const).map((key) => (
              <li key={key} className={styles.conceptItem}>
                <h3 className={styles.conceptItem_title}>{t(`concept.items.${key}.heading`)}</h3>
                <p className={styles.conceptItem_text}>{t(`concept.items.${key}.text`)}</p>
              </li>
            ))}
            <li className={styles.conceptItem}>
              <h3 className={styles.conceptItem_title}>{t('concept.items.growing.heading')}</h3>
              <p className={styles.conceptItem_text}>
                {t('concept.items.growing.textBefore')}
                <PrimitiveButton url={EXTERNAL_LINKS.REQUEST} className={styles.conceptItem_link}>
                  {t('concept.items.growing.link')}
                </PrimitiveButton>
                {t('concept.items.growing.textAfter')}
              </p>
            </li>
          </ul>
        </BasePanel>
      </LayoutInner>
    </LayoutSection>
  )
}
