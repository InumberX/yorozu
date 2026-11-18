import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutSection } from '~/components/ui/layouts/LayoutSection'
import { PageTitle } from '~/components/ui/typographies/PageTitle'
import { VideoConvertPanel } from '~/features/video-convert/components/VideoConvertPanel'

// ページの見出し・リードと、変換の操作パネル
export const VideoConverter = () => {
  const { t } = useTranslation('pages/YZ30_100')

  return (
    <LayoutSection>
      <LayoutInner>
        <PageTitle titleTag="h1" color="primary" title={t('title.heading')} />
        <p className={styles.lead}>{t('title.lead')}</p>
        <VideoConvertPanel />
      </LayoutInner>
    </LayoutSection>
  )
}
