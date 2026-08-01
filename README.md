# yorozu

開発・web制作向けの便利ツールを集めた Webツールハブ。すべてブラウザ内で完結し、ファイルをサーバーにアップロードせずに変換・処理する。第一弾は画像（WebP / AVIF）・動画（WebM）のフォーマット変換。

- 公開URL: `yorozu.afterworks.jp`
- 姉妹プロジェクト: sugidama

## 技術構成

- React Router v7 / SPA モード（`ssr: false`）＋ `prerender` で用途ルートを静的HTML化
- ホスティング: Cloudflare Workers（静的アセット配信 ＋ Basic 認証ゲート）
- 変換はすべてクライアントサイド・Web Worker（画像=jSquash / 動画=ffmpeg.wasm を想定、いずれも同一オリジンから WASM を自前配信）
- スタイル: Vanilla Extract / Lint・Format: oxlint・oxfmt / テスト: Vitest / Storybook

詳細は `docs/`（`docs/README.md` が目次）を参照。

## セットアップ

```bash
npm install
npm run dev            # Vite 開発サーバー（http://localhost:5173）
```

## 主なコマンド

```bash
npm run build          # 本番ビルド（build/client を prerender 出力）
npm start              # wrangler で Worker + 静的配信をローカルプレビュー
npm run typecheck      # 型チェック（RR 型生成 → tsc）
npm run lint           # oxlint（warning 0）
npm run format         # oxfmt チェック
npm run test           # Vitest
npm run storybook      # Storybook（:6006）
npm run deploy-development  # dev-yorozu へデプロイ
npm run deploy-production   # yorozu へデプロイ
```

## 画面ID

`YZ<カテゴリ2桁>_<画面3桁>`（sugidama の `SG` と同型）。詳細は `docs/screens.md`。

| 画面ID | ルート | 画面 |
|--------|--------|------|
| `YZ10_100` | `/` ・ `/en` | トップ（ショーケース） |
| `YZ20_100` | `/image` ・ `/en/image` | 画像変換 |
| `YZ30_100` | `/video` ・ `/en/video` | 動画変換 |

## 多言語

日本語（既定・接頭辞なし）／英語（`/en`）。翻訳は `app/locales/{ja,en}/`。
