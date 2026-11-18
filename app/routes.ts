import { index, route, type RouteConfig } from '@react-router/dev/routes'

// ルートは用途ごとのページ（画面 ID は docs/screens.md）。JA は接頭辞なし、EN は /en。
// ページを足すときは、ここと react-router.config.ts の prerender の両方に足す。
export default [
  // :lang? を path に持つのはこのレイアウトだけ。ヘッダー・フッターで各ページを囲む。
  route(':lang?', 'routes/layout-public/route.tsx', [
    index('routes/YZ10_100/route.tsx'),
    route('image', 'routes/YZ20_100/route.tsx'),
    route('video', 'routes/YZ30_100/route.tsx'),
  ]),
] satisfies RouteConfig
