import { type LoaderFunctionArgs, Outlet } from 'react-router'

import { getLang, shouldRevalidateOnLangChange } from '~/utils/locale'

// lang が変わったら再検証する（理由は shouldRevalidateOnLangChange のコメント）。
export const shouldRevalidate = shouldRevalidateOnLangChange

export async function loader(args: LoaderFunctionArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function LayoutPublic() {
  return <Outlet />
}
