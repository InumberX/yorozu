import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { SectionTitle } from '~/components/pages/YZ10_100/SectionTitle'
import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { SVG_ICON_VARIANT, SvgIcon, type SvgIconVariant } from '~/components/ui/icons/SvgIcon'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutSection } from '~/components/ui/layouts/LayoutSection'
import { BasePanel } from '~/components/ui/panels/BasePanel'
import { EXTERNAL_LINKS } from '~/config/consts'
import { type ToolId, TOOLS } from '~/config/tools'
import { toTwoDigits } from '~/utils/to-two-digits'

type Props = {
  lang: string
  // セクションの id。メインビジュアルの CTA の移動先
  id: string
}

const TOOL_ICONS: Record<ToolId, SvgIconVariant> = {
  image: SVG_ICON_VARIANT.TOOL_IMAGE,
  video: SVG_ICON_VARIANT.TOOL_VIDEO,
}

export const ToolList = ({ lang, id }: Props) => {
  const { t } = useTranslation('pages/YZ10_100')

  return (
    <LayoutSection id={id} topSpace="topSpaceNone" bottomSpace="bottomSpaceNone" className={styles.toolList}>
      <LayoutInner>
        <BasePanel>
          <SectionTitle label="SEC.01" title={t('tools.heading')} />

          <div aria-hidden="true" lang="en" translate="no" className={styles.toolListHead}>
            <span className={styles.toolListHead_number}>NO.</span>
            <span className={styles.toolListHead_body}>TOOL</span>
            <span className={styles.toolListHead_category}>CATEGORY</span>
            <span className={styles.toolListHead_state}>STATE</span>
          </div>

          {/* 行全体が 1 つのリンク。読み上げはツールの名前と説明（外部リンクは別タブの補足も）にし、番号・カテゴリ・状態・OPEN は見た目だけにする。 */}
          <ul className={styles.toolListItems}>
            {TOOLS.map((tool, index) => (
              <li key={tool.id}>
                <PrimitiveButton url={tool.page.getUrl({ lang })} className={styles.toolListItem}>
                  <span aria-hidden="true" lang="en" translate="no" className={styles.toolListItem_number}>
                    {toTwoDigits(index + 1)}
                  </span>
                  <SvgIcon variant={TOOL_ICONS[tool.id]} className={styles.toolListItem_icon} />
                  <span className={styles.toolListItem_body}>
                    <span className={styles.toolListItem_name}>{t(`tools.items.${tool.id}.name`)}</span>
                    <span className={styles.toolListItem_description}>{t(`tools.items.${tool.id}.description`)}</span>
                  </span>
                  <span aria-hidden="true" className={styles.toolListItem_category}>
                    <span lang="en" translate="no" className={styles.toolListItem_chip}>
                      {tool.category}
                    </span>
                  </span>
                  <span aria-hidden="true" lang="en" translate="no" className={styles.toolListItem_state}>
                    <span className={styles.toolListItem_stateMark}>● </span>
                    ACTIVE
                  </span>
                  <span aria-hidden="true" lang="en" translate="no" className={styles.toolListItem_action}>
                    OPEN →
                  </span>
                </PrimitiveButton>
              </li>
            ))}

            <li>
              <PrimitiveButton
                url={EXTERNAL_LINKS.REQUEST}
                className={[styles.toolListItem, styles.toolListItem__request].join(' ')}
              >
                <span aria-hidden="true" lang="en" translate="no" className={styles.toolListItem_number}>
                  {toTwoDigits(TOOLS.length + 1)}
                </span>
                <SvgIcon variant={SVG_ICON_VARIANT.TOOL_ADD} className={styles.toolListItem_icon} />
                <span className={styles.toolListItem_body}>
                  <span className={styles.toolListItem_name}>{t('tools.next.name')}</span>
                  <span className={styles.toolListItem_description}>{t('tools.next.description')}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={[styles.toolListItem_category, styles.toolListItem_category__empty].join(' ')}
                >
                  —
                </span>
                <span aria-hidden="true" lang="en" translate="no" className={styles.toolListItem_state}>
                  <span className={styles.toolListItem_stateMark}>○ </span>
                  NEXT
                </span>
                <span aria-hidden="true" lang="en" translate="no" className={styles.toolListItem_action}>
                  REQUEST →
                </span>
              </PrimitiveButton>
            </li>
          </ul>
        </BasePanel>
      </LayoutInner>
    </LayoutSection>
  )
}
