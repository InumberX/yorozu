import { useTranslation } from 'react-i18next'
import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'
import * as styles from './style.css'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { LayoutSection } from '~/components/ui/layouts/LayoutSection'
import { PageTitle } from '~/components/ui/typographies/PageTitle'
import { ReplaceNewLineText } from '~/components/ui/typographies/ReplaceNewLineText'
import { PAGES } from '~/config/paths'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
  })
}

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function PageYZ10_100({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData
  const { t: tPage } = useTranslation('pages/YZ10_100')

  const tools = [
    {
      key: 'image',
      name: tPage('tools.image.name'),
      description: tPage('tools.image.description'),
      action: tPage('tools.image.action'),
      url: PAGES.YZ20_100.getUrl({ lang }),
    },
    {
      key: 'video',
      name: tPage('tools.video.name'),
      description: tPage('tools.video.description'),
      action: tPage('tools.video.action'),
      url: PAGES.YZ30_100.getUrl({ lang }),
    },
  ]

  return (
    <LayoutPageWrapper>
      <div className={styles.home}>
        <LayoutSection tag="div" bottomSpace="bottomSpaceSmall">
          <LayoutInner>
            <div className={styles.homeHero}>
              <h1 className={styles.homeHero_title}>{tPage('title.heading')}</h1>
              <p className={styles.homeHero_lead}>
                <ReplaceNewLineText text={tPage('title.lead')} />
              </p>
            </div>
          </LayoutInner>
        </LayoutSection>

        <LayoutSection topSpace="topSpaceSmall">
          <LayoutInner>
            <PageTitle titleTag="h2" color="primary" title={tPage('tools.heading')} />
            <ul className={styles.homeTools}>
              {tools.map((tool) => (
                <li key={tool.key} className={styles.homeTools_item}>
                  <div className={styles.homeToolCard}>
                    <h3 className={styles.homeToolCard_title}>{tool.name}</h3>
                    <p className={styles.homeToolCard_description}>{tool.description}</p>
                    <div className={styles.homeToolCard_action}>
                      <BaseButton url={tool.url} size="medium">
                        {tool.action}
                      </BaseButton>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </LayoutInner>
        </LayoutSection>
      </div>
    </LayoutPageWrapper>
  )
}
