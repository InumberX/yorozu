import { useTranslation } from 'react-i18next'
import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'
import * as styles from './style.css'

import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { LayoutSection } from '~/components/ui/layouts/LayoutSection'
import { PageTitle } from '~/components/ui/typographies/PageTitle'
import { LANG } from '~/config/consts'
import { ImageConvertPanel } from '~/features/image-convert/components/ImageConvertPanel'
import { getLang, getPageInfo } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

export const meta: MetaFunction = (args) => {
  const lang = (args.matches.find((match) => match.id === 'root')?.loaderData as { lang?: string })?.lang ?? LANG.JA

  return getMetadata({
    args,
    title: getPageInfo({ lang }).YZ20_100.NAME,
  })
}

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function PageYZ20_100() {
  const { t } = useTranslation('pages/YZ20_100')

  return (
    <LayoutPageWrapper>
      <LayoutSection>
        <LayoutInner>
          <PageTitle titleTag="h1" color="primary" title={t('title.heading')} />
          <p className={styles.lead}>{t('title.lead')}</p>
          <ImageConvertPanel />
        </LayoutInner>
      </LayoutSection>
    </LayoutPageWrapper>
  )
}
