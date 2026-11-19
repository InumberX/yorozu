import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { ToolHeading } from '~/components/ui/headings/ToolHeading'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { NotePanel } from '~/components/ui/panels/NotePanel'
import { PAGES } from '~/config/paths'
import { ImageConvertPanel } from '~/features/image-convert/components/ImageConvertPanel'
import { MAX_FILE_SIZE_LABEL } from '~/features/image-convert/schema'

type Props = {
  lang: string
}

// 画像変換のページの中身。見出し → 変換の操作（と結果）→ 注記。
// 出典: yorozu アーティファクト「yorozu-cyber-net-image」（PC）/「yorozu-cyber-net-image-sp」（SP）。
export const ImageConverter = ({ lang }: Props) => {
  const { t } = useTranslation('pages/YZ20_100')

  return (
    <LayoutInner>
      <div className={styles.imageConverter}>
        <ToolHeading
          breadcrumbs={[{ name: PAGES.YZ10_100.getName({ lang }), url: PAGES.YZ10_100.getUrl({ lang }) }]}
          breadcrumbLabel={t('heading.breadcrumbLabel')}
          label={t('heading.label')}
          title={t('heading.title')}
          lead={t('heading.lead')}
        />
        <ImageConvertPanel />
        <NotePanel
          items={[
            { title: t('notes.limitTitle'), text: t('notes.limit', { size: MAX_FILE_SIZE_LABEL }) },
            { title: t('notes.privacyTitle'), text: t('notes.privacy') },
          ]}
        />
      </div>
    </LayoutInner>
  )
}
