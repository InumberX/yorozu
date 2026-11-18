// メディア特性のクエリ。スクリプトからも読むため、関数を置かずに値だけを export する
// （関数を export する .css.ts は、スクリプトから import するとビルドできない）。

// 動きを減らす設定。スタイルでは getMediaQuery('reduced-motion')、スクリプトでは matchMedia に渡す。
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
