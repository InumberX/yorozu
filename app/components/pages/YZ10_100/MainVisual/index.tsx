import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { BasePanel } from '~/components/ui/panels/BasePanel'
import { LANG } from '~/config/consts'
import { TOOLS } from '~/config/tools'
import { useDecodeText } from '~/hooks/use-decode-text'
import { toTwoDigits } from '~/utils/to-two-digits'

type Props = {
  lang: string
  // ツール一覧のセクションの id。CTA の移動先
  toolsId: string
}

export const MainVisual = ({ lang, toolsId }: Props) => {
  const { t } = useTranslation('pages/YZ10_100')

  // 英語版は見出しがタグラインと同じ文なので、タグラインを出さない（locales で空にしている）。
  const tagline = t('mainVisual.tagline')
  const decodedTagline = useDecodeText(tagline)

  const stats = [
    { key: 'tools', value: toTwoDigits(TOOLS.length), isNumber: true },
    { key: 'uploads', value: '0', isNumber: true },
    { key: 'runsIn', value: t('mainVisual.stats.runsInValue'), isNumber: false },
  ] as const

  return (
    <div className={styles.mainVisual}>
      <LayoutInner>
        <BasePanel color="dense">
          <div aria-hidden="true" className={styles.mainVisualGeometry}>
            <div className={styles.mainVisualGeometry_stage}>
              {styles.mainVisualGeometrySquares.map((className) => (
                <span key={className} className={className} />
              ))}
            </div>
          </div>

          <p aria-hidden="true" lang="en" translate="no" className={styles.mainVisualBand}>
            <span>YOROZU.AFTERWORKS.JP</span>
            <span>
              <span className={styles.mainVisualBand_wide}>BROWSER ONLY / </span>NO UPLOAD
            </span>
          </p>

          <div className={styles.mainVisualHeading}>
            <h1
              className={[styles.mainVisualHeading_title, lang === LANG.EN && styles.mainVisualHeading_title__en]
                .filter(Boolean)
                .join(' ')}
            >
              <span className={styles.mainVisualHeading_line}>{t('mainVisual.title.line1')}</span>
              {/* 英語は語の区切りが要るので、2 行の間に空白を入れる（行は block なので見た目は変わらない）。 */}
              {lang === LANG.EN && ' '}
              <span className={[styles.mainVisualHeading_line, styles.mainVisualHeading_line__outline].join(' ')}>
                {t('mainVisual.title.line2')}
              </span>
            </h1>
            {tagline && (
              <p lang="en" translate="no" className={styles.mainVisualHeading_tagline}>
                <span className={styles.mainVisualHeading_taglineText}>{tagline}</span>
                <span aria-hidden="true">{decodedTagline}</span>
              </p>
            )}
          </div>

          <div className={styles.mainVisualLead}>
            <p className={styles.mainVisualLead_text}>{t('mainVisual.lead')}</p>
          </div>

          <div className={styles.mainVisualFooter}>
            <div className={styles.mainVisualAction}>
              <PrimitiveButton url={`#${toolsId}`} className={styles.mainVisualAction_button}>
                {t('mainVisual.cta')}
                <span aria-hidden="true">→</span>
              </PrimitiveButton>
            </div>

            <dl className={styles.mainVisualStats}>
              {stats.map((stat) => (
                <div key={stat.key} className={styles.mainVisualStat}>
                  <dt className={styles.mainVisualStat_label}>{t(`mainVisual.stats.${stat.key}`)}</dt>
                  <dd
                    className={[styles.mainVisualStat_value, stat.isNumber && styles.mainVisualStat_value__number]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </BasePanel>
      </LayoutInner>
    </div>
  )
}
