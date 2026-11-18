import { describe, expect, test } from 'vitest'

import { shouldRevalidateOnLangChange } from '~/utils/locale'

// loader で lang を読むルート（getLang を呼ぶルート）は、shouldRevalidateOnLangChange を
// shouldRevalidate として export していないと、言語を切り替えても loaderData の lang が古いまま残る。
// 新しいルートにも効くよう、ルートのファイルを列挙して確かめる。
const sources = import.meta.glob<string>(['/app/root.tsx', '/app/routes/**/route.tsx'], {
  eager: true,
  query: '?raw',
  import: 'default',
})
const modules = import.meta.glob<Record<string, unknown>>(['/app/root.tsx', '/app/routes/**/route.tsx'], {
  eager: true,
})

const langRoutes = Object.keys(sources).filter((path) => /\bgetLang\(/.test(sources[path]))

describe('lang を loader で読むルートの再検証', () => {
  test('対象のルートが見つかる', () => {
    expect(langRoutes).toContain('/app/root.tsx')
    expect(langRoutes.length).toBeGreaterThan(1)
  })

  test.each(langRoutes)('%s は shouldRevalidateOnLangChange を shouldRevalidate として export する', (path) => {
    expect(modules[path].shouldRevalidate).toBe(shouldRevalidateOnLangChange)
  })
})
