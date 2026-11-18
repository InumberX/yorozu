import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'

import { Concept } from '~/components/pages/YZ10_100/Concept'
import { MainVisual } from '~/components/pages/YZ10_100/MainVisual'
import { ToolList } from '~/components/pages/YZ10_100/ToolList'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { getLang, shouldRevalidateOnLangChange } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

// ツール一覧のセクションの id。メインビジュアルの CTA から移動する。
const TOOLS_SECTION_ID = 'tools'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
  })
}

// lang が変わったら再検証する（理由は shouldRevalidateOnLangChange のコメント）。
export const shouldRevalidate = shouldRevalidateOnLangChange

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function PageYZ10_100({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData

  return (
    <LayoutPageWrapper>
      <MainVisual lang={lang} toolsId={TOOLS_SECTION_ID} />
      <ToolList lang={lang} id={TOOLS_SECTION_ID} />
      <Concept />
    </LayoutPageWrapper>
  )
}
