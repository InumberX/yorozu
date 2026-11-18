import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'

import { ImageConverter } from '~/components/pages/YZ20_100/ImageConverter'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { LANG } from '~/config/consts'
import { getLang, getPageInfo, shouldRevalidateOnLangChange } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

export const meta: MetaFunction = (args) => {
  const lang = (args.matches.find((match) => match.id === 'root')?.loaderData as { lang?: string })?.lang ?? LANG.JA

  return getMetadata({
    args,
    title: getPageInfo({ lang }).YZ20_100.NAME,
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

export default function PageYZ20_100() {
  return (
    <LayoutPageWrapper>
      <ImageConverter />
    </LayoutPageWrapper>
  )
}
