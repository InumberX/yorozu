import { type PagesConfig } from '~/types/paths'
import { getLangRoute, getPageInfo } from '~/utils/locale'

export const PAGES: PagesConfig = {
  YZ10_100: {
    id: 'YZ10_100',
    getName: ({ lang }) => {
      const pageInfo = getPageInfo({
        lang,
      })
      return pageInfo.YZ10_100.NAME
    },
    getUrl: ({ lang }) => {
      const langRoute = getLangRoute({
        lang,
      })
      return langRoute === '' ? '/' : langRoute
    },
  },
  YZ20_100: {
    id: 'YZ20_100',
    getName: ({ lang }) => {
      const pageInfo = getPageInfo({
        lang,
      })
      return pageInfo.YZ20_100.NAME
    },
    getUrl: ({ lang }) => {
      const langRoute = getLangRoute({
        lang,
      })
      return `${langRoute}/image`
    },
  },
  YZ30_100: {
    id: 'YZ30_100',
    getName: ({ lang }) => {
      const pageInfo = getPageInfo({
        lang,
      })
      return pageInfo.YZ30_100.NAME
    },
    getUrl: ({ lang }) => {
      const langRoute = getLangRoute({
        lang,
      })
      return `${langRoute}/video`
    },
  },
} as const

export type PageKey = keyof typeof PAGES
export type PageConfig = (typeof PAGES)[PageKey]
