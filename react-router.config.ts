import type { Config } from '@react-router/dev/config'

// yorozu は SPA モード（ランタイム SSR なし）。用途ルートはビルド時に prerender で
// 静的 HTML 化し、各ルートに meta（title / OGP）を持たせる。
// i18n は JA=接頭辞なし / EN=/en。`($lang)` パラメータは自動展開されないため、
// 全ロケール × 全ルートのパスを明示的に列挙する。
export default {
  ssr: false,
  prerender: ['/', '/image', '/video', '/en', '/en/image', '/en/video'],
} satisfies Config
