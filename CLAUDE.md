# yorozu

開発・web制作向けの便利ツールを集めた Webツールハブ。すべてブラウザ内で完結し、ファイルをサーバーにアップロードせずに変換・処理する。ツールは継続的に追加していく前提で、第一弾は画像・動画のフォーマット変換。

- 公開URL: `yorozu.afterworks.jp`（afterworks のサブドメイン）
- 姉妹プロジェクト: sugidama
- コンセプト: 「万（よろず）＝あらゆるものが揃う器」。特定機能に縛られず、ツールが増えても破綻しない設計にする。

## 技術構成（確定）

- フレームワーク: React Router v7 / SPA モード（`ssr: false`）。用途ルートは `prerender` で静的HTML化し、meta（title / OGP）を各ルートに持たせる。
- ホスティング: Cloudflare Workers（静的アセット配信）。ランタイムSSRは使わない。
- ルーティング: 用途ごとにページを分ける（`/image`, `/video` …）。個別の解説ページは持たない。
- 重い処理（WASM変換）は Web Worker で実行し、UIをブロックしない。

## 技術候補（未確定・要判断）

- 画像変換エンジン: 書き出しは jSquash（WASM、`@jsquash/webp` / `@jsquash/avif`）、読み込みはブラウザの `createImageBitmap`。Worker から必要になったときに動的 import する（`vite.config.ts` の `worker.format: 'es'`）。
- 動画変換エンジン: ffmpeg.wasm を想定（候補）。
  - **ffmpeg のシングルスレッド / マルチスレッドは未決定。** MT版は `SharedArrayBuffer` のため COOP/COEP（cross-origin isolation）ヘッダが必須。ST版は不要だが遅い。**着手前に確認すること。**

## 重要な制約・落とし穴

- COOP/COEP（`Cross-Origin-Opener-Policy: same-origin` / `Cross-Origin-Embedder-Policy: require-corp`）は **ffmpeg MT版を使う場合のみ必要**。静的アセットのルート（例: `public/_headers`）で付与する。
- `require-corp` 下では外部オリジンのリソースに CORP が必要。**WASM（ffmpeg core / jSquash）は同一オリジンから自前配信**する（CDN 依存にしない）。
- **大きい WASM（ffmpeg core ~25–30MB）は Worker スクリプトにバンドルしない。** 静的アセットとして配信する。
- 変換はすべてクライアントサイド。サーバー側処理は現状なし（将来足す余地を残すために RR を採用している）。
- `ssr: false` でもルートはビルド時に一度サーバー描画されるため SSR-safe にする。`window` / `Worker` 等はレンダー中に触らず、`useEffect` やイベントハンドラ内で遅延初期化する。
- 大きい / 長いファイルにはサイズ・長さのガードと進捗表示を入れる。
- `ssr: false` では、loader を持つルートは**自分の path に含まれるパラメータ**が変わったときしか再検証されない。`:lang?` を path に持つのは `layout-public` だけなので、root と各ページは `/image` ⇄ `/en/image` の遷移で loaderData の `lang` が古いまま残る。**loader で `getLang` を呼ぶルートは `export const shouldRevalidate = shouldRevalidateOnLangChange`（`app/utils/locale.ts`）を必ず書く。** 漏れは `tests/routes/lang-revalidation.test.ts` が検出する。
- prerender していないパスは 404 にする。ASSETS は `not_found_handling: "none"` で 404 を返し、Worker（`workers/handler.ts`）がページ遷移には SPA フォールバックを 404 で、`.data` やファイルにはプレーンな 404 を返す。`"single-page-application"` に戻すと未列挙パスに JA ホームが 200 で返り、`/fr` がホームとして表示される。404 ページの表示言語と `<html lang>` は URL から求める（`getLangFromPathname`）。

## ドキュメント

- `docs/` 直下にプロダクト横断のドキュメントを置く（`README.md` が目次）。
- 番号プレフィックスは使わない。順序は `docs/README.md` の目次で管理する。
- ツール個別の詳細が必要になったら `docs/tools/<name>/` に切り出す。
- 参照: `docs/requirements.md`（要件）, `docs/screens.md`（画面）, `docs/design-guideline.md`（デザイン）。
- **デザインの正は claude.ai の yorozu アーティファクト**（トップ `yorozu-cyber-net(-sp)` / 画像変換 `yorozu-cyber-net-image(-sp)` / 動画変換 `yorozu-cyber-net-video(-sp)` / `OGP`）。URL とファイルの対応は `docs/design-guideline.md`「デザインの正」。

## 規約

- ファイル名・ディレクトリ名は英語 / ローマ字。ドキュメントの中身・UIコピーは日本語。
- ファイル・ディレクトリの命名は after_works（`inumberx/after_works-v006` の `.claude/skills/review-pr/rules/style/naming.md`）に揃える。**コンポーネント（ディレクトリ + エントリファイル）だけ PascalCase、それ以外はすべて kebab-case。**

  | 種別 | 形式 | 例 |
  |---|---|---|
  | コンポーネント | PascalCase ディレクトリ + `index.tsx` | `ui/buttons/BaseButton/index.tsx` |
  | コンポーネントのスタイル | `style.css.ts`（Vanilla Extract） | `BaseButton/style.css.ts` |
  | Provider | PascalCase ディレクトリ + `index.tsx` | `providers/AppProvider/index.tsx` |
  | UI カテゴリ | 複数形 kebab-case | `buttons/`、`layouts/`、`typographies/` |
  | ページ固有のコンポーネント | `components/pages/<画面ID>/` の下に PascalCase ディレクトリ + `index.tsx` | `components/pages/YZ10_100/MainVisual/index.tsx` |
  | hooks | `use-kebab-case.ts` | `features/image-convert/hooks/use-image-convert.ts` |
  | Web Worker | `kebab-case.worker.ts` | `worker/image-convert.worker.ts` |
  | styles / utils / config / 型定義 | kebab-case | `media-query.css.ts`、`css-variables.css.ts`、`gtag.client.ts`、`paths.d.ts` |
  | テスト・ストーリー | `tests/` `stories/` に `app/` の構造をミラーし `index.test.tsx` / `index.stories.tsx` | `tests/components/ui/buttons/BaseButton/index.test.tsx` |
  | utils などのテスト | `tests/` に `app/` の構造をミラーし `<ファイル名>.test.ts`（after_works と同じ） | `tests/utils/locale.test.ts` |

  after_works と違う点は2つ。いずれもフレームワーク由来なので残す: (1) スタイルは CSS Modules ではなく Vanilla Extract の `style.css.ts`。クラスを一つも持たない tsx には作らない。(2) `.server.ts` / `.client.ts` の接尾辞は React Router がバンドルの振り分けに使うので外さない（`i18next.server.ts`、`gtag.client.ts`、`entry.server.tsx`）。`app/locales/*/pages/YZ10_100.json`、`app/components/pages/YZ10_100/`、`app/routes/YZ10_100/` は画面 ID（`docs/screens.md`）なので対象外。
- ルートはファイル名から自動で作らず、`app/routes.ts` に書く（`route()` / `index()`）。ルートのモジュールは `app/routes/<画面 ID>/route.tsx`（レイアウトは `app/routes/layout-public/route.tsx`）に置き、loader・meta とページの組み立てだけを持つ。ページの中身は `app/components/pages/<画面 ID>/` に置く。ページを足すときは `app/routes.ts` と `react-router.config.ts` の `prerender` の両方に足す（足し忘れは `tests/routes/prerender.test.ts` が検出する）。
- ページの中（`LayoutMain` の中）のレイアウトを画面の幅で切り替えるときは、メディアクエリではなくコンテナクエリ（`'@container'` と `getContainerQuery()`）を使う。`LayoutMain` が `container-type: inline-size` を持つ。メディアクエリを使うのは、`LayoutMain` の外にあるもの（ヘッダー・フッター）、ヘッダーと連動する値（`LayoutPageWrapper` の上の余白）、ヘッダー・フッターでも使う部品（`LayoutInner`）と、`hover`・`prefers-reduced-motion` などの、幅ではないメディア特性だけにする。
- CSS に書く数値（px / rem などのサイズ指定）は整数にし、小数点は使わない。出力される rem や `clamp()` の表示サイズが小数になるのは対象外。既存の小数（`root.css.ts` の `sup` / `sub` の em、`css-variables.css.ts` の `4.6vw`）は例外として残す。
- ブランドカラー（ダークテーマ）: 背景 `#05080B` / 主色 `#5CFFB1` / ハイライト `#C8FFE6` / 差し色 `#FFB454`。詳細と実装上の色は `docs/design-guideline.md`。

## 未決事項（TBD）

- ffmpeg: シングルスレッド / マルチスレッド。
- 動画の対応入力形式、品質 / 圧縮オプション。（画像は `docs/screens.md` の YZ20_100 に記載）
