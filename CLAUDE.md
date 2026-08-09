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

- 画像変換エンジン: jSquash（WASM）を想定（候補）。
- 動画変換エンジン: ffmpeg.wasm を想定（候補）。
  - **ffmpeg のシングルスレッド / マルチスレッドは未決定。** MT版は `SharedArrayBuffer` のため COOP/COEP（cross-origin isolation）ヘッダが必須。ST版は不要だが遅い。**着手前に確認すること。**

## 重要な制約・落とし穴

- COOP/COEP（`Cross-Origin-Opener-Policy: same-origin` / `Cross-Origin-Embedder-Policy: require-corp`）は **ffmpeg MT版を使う場合のみ必要**。静的アセットのルート（例: `public/_headers`）で付与する。
- `require-corp` 下では外部オリジンのリソースに CORP が必要。**WASM（ffmpeg core / jSquash）は同一オリジンから自前配信**する（CDN 依存にしない）。
- **大きい WASM（ffmpeg core ~25–30MB）は Worker スクリプトにバンドルしない。** 静的アセットとして配信する。
- 変換はすべてクライアントサイド。サーバー側処理は現状なし（将来足す余地を残すために RR を採用している）。
- `ssr: false` でもルートはビルド時に一度サーバー描画されるため SSR-safe にする。`window` / `Worker` 等はレンダー中に触らず、`useEffect` やイベントハンドラ内で遅延初期化する。
- 大きい / 長いファイルにはサイズ・長さのガードと進捗表示を入れる。

## ドキュメント

- `docs/` 直下にプロダクト横断のドキュメントを置く（`README.md` が目次）。
- 番号プレフィックスは使わない。順序は `docs/README.md` の目次で管理する。
- ツール個別の詳細が必要になったら `docs/tools/<name>/` に切り出す。
- 参照: `docs/requirements.md`（要件）, `docs/screens.md`（画面）, `docs/design-guideline.md`（デザイン）。

## 規約

- ファイル名・ディレクトリ名は英語 / ローマ字。ドキュメントの中身・UIコピーは日本語。
- ブランドカラー: ベース `#F4F4F4` / プライマリー `#0F1B2D` / セカンダリー `#C9A86A`。

## 未決事項（TBD）

- ffmpeg: シングルスレッド / マルチスレッド。
- 対応入力形式、品質 / 圧縮オプション、一括変換の要否。
- ロゴ（デザイナーに依頼予定）。
