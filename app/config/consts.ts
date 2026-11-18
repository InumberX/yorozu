import { SITE_NAME } from '~/config/env'

export const SITE_NAME_JA = SITE_NAME
export const BASE_DESCRIPTION_JA =
  'yorozu（万）は、開発・web制作の「あると嬉しい」便利ツールを集めた Webツールハブです。画像・動画のフォーマット変換など、すべてブラウザ内で完結し、ファイルをサーバーにアップロードせずに処理します。'
export const BASE_TITLE_NOTE_JA = 'ブラウザ完結の便利ツールハブ'

export const SITE_NAME_EN = SITE_NAME
export const BASE_DESCRIPTION_EN =
  'yorozu is a hub of handy tools for developers and web creators. Convert images and videos and more — everything runs in your browser, with no file uploads to any server.'
export const BASE_TITLE_NOTE_EN = 'Browser-based web tool hub'

export const LANG = {
  JA: 'ja',
  EN: 'en',
} as const

export const PAGE_INFO = {
  JA: {
    YZ10_100: {
      NAME: 'ホーム',
    },
    YZ20_100: {
      NAME: '画像変換',
    },
    YZ30_100: {
      NAME: '動画変換',
    },
  },
  EN: {
    YZ10_100: {
      NAME: 'Home',
    },
    YZ20_100: {
      NAME: 'Image Converter',
    },
    YZ30_100: {
      NAME: 'Video Converter',
    },
  },
} as const

export const SITE_INFO = {
  JA: {
    SITE_NAME: SITE_NAME_JA,
    BASE_TITLE_NOTE: BASE_TITLE_NOTE_JA,
    BASE_DESCRIPTION: BASE_DESCRIPTION_JA,
  },
  EN: {
    SITE_NAME: SITE_NAME_EN,
    BASE_TITLE_NOTE: BASE_TITLE_NOTE_EN,
    BASE_DESCRIPTION: BASE_DESCRIPTION_EN,
  },
} as const

// 外部サイトへのリンク先。REQUEST はフッターとトップの両方で使う。
export const EXTERNAL_LINKS = {
  // ツールの要望は GitHub の issue で受け付ける（docs/design-guideline.md「デザインの正」）。
  REQUEST: 'https://github.com/InumberX/yorozu/issues',
  GITHUB: 'https://github.com/InumberX',
  AFTERWORKS: 'https://afterworks.jp',
} as const
