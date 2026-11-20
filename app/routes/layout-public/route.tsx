import { Outlet } from 'react-router'

import type { Route } from './+types/route'

import { LayoutFooter } from '~/components/common/LayoutFooter'
import { LayoutHeader } from '~/components/common/LayoutHeader'
import { SkipLink } from '~/components/common/SkipLink'
import { LayoutMain } from '~/components/ui/layouts/LayoutMain'
import { LayoutWrapper } from '~/components/ui/layouts/LayoutWrapper'
import { getLang, shouldRevalidateOnLangChange } from '~/utils/locale'

// lang が変わったら再検証する（理由は shouldRevalidateOnLangChange のコメント）。
export const shouldRevalidate = shouldRevalidateOnLangChange

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

// スキップリンクの飛び先（本文の main 要素）の id
const MAIN_CONTENT_ID = 'main-content'

export default function LayoutPublicWrapper({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData

  return (
    <LayoutWrapper>
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <LayoutHeader lang={lang} />
      <LayoutMain id={MAIN_CONTENT_ID}>
        <Outlet />
      </LayoutMain>
      <LayoutFooter lang={lang} />
    </LayoutWrapper>
  )
}
