import { PAGES, type PageConfig } from '~/config/paths'

// ツール登録。トップのツール一覧と「稼働ツール」の数は、ここから作る。
// ツールを足すときは、ここに 1 行足し、名前と説明を locales の pages/YZ10_100.json（tools.items）に足す。
export type ToolConfig = {
  // locales のキーとアイコンの選択に使う
  id: string
  // ツール一覧の CATEGORY 欄。英字の表記
  category: string
  page: PageConfig
}

export const TOOLS = [
  {
    id: 'image',
    category: 'IMAGE',
    page: PAGES.YZ20_100,
  },
  {
    id: 'video',
    category: 'VIDEO',
    page: PAGES.YZ30_100,
  },
] as const satisfies readonly ToolConfig[]

export type ToolId = (typeof TOOLS)[number]['id']

// 一覧の番号（01, 02, …）と「稼働ツール」の数は、2 桁でそろえて見せる。
export const toTwoDigits = (value: number) => {
  return String(value).padStart(2, '0')
}
