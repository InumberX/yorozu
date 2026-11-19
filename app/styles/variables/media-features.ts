// メディア特性のクエリ。スタイル（.css.ts）とスクリプトの両方から読む。

// 動きを減らす設定。スタイルでは getMediaQuery('reduced-motion')、スクリプトでは matchMedia に渡す。
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
