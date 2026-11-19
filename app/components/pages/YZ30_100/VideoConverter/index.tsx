import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { ToolHeading } from '~/components/ui/headings/ToolHeading'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { NotePanel } from '~/components/ui/panels/NotePanel'
import { PAGES } from '~/config/paths'
import { VideoConvertPanel } from '~/features/video-convert/components/VideoConvertPanel'
import { MAX_DURATION_MINUTES, MAX_FILE_SIZE_LABEL } from '~/features/video-convert/limits'

type Props = {
  lang: string
}

// 動画変換のページの中身。見出し → 変換の操作（と結果）→ 注記。
// 出典: yorozu アーティファクト「yorozu-cyber-net-video」（PC）/「yorozu-cyber-net-video-sp」（SP）。
export const VideoConverter = ({ lang }: Props) => {
  const { t } = useTranslation('pages/YZ30_100')
  const { t: tCommon } = useTranslation('common')

  return (
    <LayoutInner>
      <div className={styles.videoConverter}>
        <ToolHeading
          breadcrumbs={[{ name: PAGES.YZ10_100.getName({ lang }), url: PAGES.YZ10_100.getUrl({ lang }) }]}
          breadcrumbLabel={t('heading.breadcrumbLabel')}
          label={t('heading.label')}
          title={t('heading.title')}
          lead={t('heading.lead')}
        />
        <VideoConvertPanel />
        <NotePanel
          items={[
            {
              title: t('notes.limitTitle'),
              text: t('notes.limit', { minutes: MAX_DURATION_MINUTES, size: MAX_FILE_SIZE_LABEL }),
            },
            { title: tCommon('convert.notes.privacyTitle'), text: tCommon('convert.notes.privacy') },
          ]}
        />
      </div>
    </LayoutInner>
  )
}
