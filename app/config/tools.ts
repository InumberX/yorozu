import { PAGES, type PageConfig } from '~/config/paths'

// ツール登録。トップのツール一覧と「稼働ツール」の数は、ここから作る。
// ツールを足すときは、次をそろえる（手順は docs/screens.md「トップ」）。
// - ここに 1 行足す
// - 名前と説明を locales の pages/YZ10_100.json（tools.items）に足す
// - アイコンの SVG を public/assets/img/icon-tool-<id>.svg に置き、SvgIcon の SVG_ICON_VARIANT と svgIcon__* のスタイルに足す
// - components/pages/YZ10_100/ToolList の TOOL_ICONS に足す（漏れると型エラーになる）
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
