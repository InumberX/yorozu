import { type RouteConfigEntry } from '@react-router/dev/routes'
import { describe, expect, test } from 'vitest'

import config from '../../react-router.config'

import { LANG } from '~/config/consts'
import routes from '~/routes'

// ページを足すときは app/routes.ts と react-router.config.ts の prerender の両方に足す。
// 片方への足し忘れを、ルートの定義から組み立てたパスと prerender の一覧を比べて見つける。

// ルートの定義から、URL になるパス（:lang? を含む）を集める。レイアウトだけのルートは含めない。
const collectPaths = (entries: RouteConfigEntry[], parent = ''): string[] => {
  return entries.flatMap((entry) => {
    const path = [parent, entry.path].filter(Boolean).join('/')
    if (entry.children?.length) {
      return collectPaths(entry.children, path)
    }
    return [path]
  })
}

// :lang? を、JA（接頭辞なし）と EN（/en）に展開する。
const expandLang = (path: string) => {
  return [LANG.JA, LANG.EN].map((lang) => {
    const segments = path
      .split('/')
      .map((segment) => (segment === ':lang?' ? (lang === LANG.JA ? '' : lang) : segment))
      .filter(Boolean)
    return `/${segments.join('/')}`
  })
}

describe('prerender', () => {
  test('app/routes.ts のすべてのページを、全言語ぶん prerender する', async () => {
    const entries = await routes
    const expected = collectPaths(entries).flatMap(expandLang)
    expect([...(config.prerender as string[])].sort()).toEqual([...new Set(expected)].sort())
  })
})
