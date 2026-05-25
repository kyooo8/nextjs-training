# Next.js 研修 — 講義資料 (Day 1〜2)

新卒向け Next.js 研修の講義パートです。

## 前提

- TS研修を修了している
- React研修 (別途) を修了している
- Node.js 20+ がインストールされている
- VSCode + TypeScript拡張を使う想定

## 想定環境

- **Next.js**: 16.x (App Router、Turbopackデフォルト)
- **React**: 19系
- **TypeScript**: 5系
- **Node.js**: 20以上

## 章構成

あくまでも目安

| #  | テーマ | 日 | 講義 | 演習 |
|----|--------|----|------|------|
| 00 | オリエンテーション (環境確認 + Reactおさらい) | Day 1 朝 | 30m | — |
| 01 | そもそも Next.js / App Router とは | Day 1 午前 | 30m | — |
| 02 | ルーティングを書く | Day 1 午前〜午後 | 30m | 40m |
| 03 | Server / Client Components の境界 | Day 1 午後 | 40m | 45m |
| 04 | Server でデータを取る | Day 2 午前 | 30m | 45m |
| 05 | Server Actions でデータを更新する | Day 2 午前 | 40m | 45m |
| 06 | レンダリング戦略とキャッシュ | Day 2 午後 | 40m | 30m |
| 07 | テストとデバッグの最低ライン | Day 2 午後 | 30m | 30m |

加えて、いつでも参照できる **[lectures/glossary.md](lectures/glossary.md)** に用語集を置いています。


## ディレクトリ

```
lectures/
  00-orientation.md           ← オリエンテーション + Reactおさらい
  01-what-is-nextjs.md        ← Next.js とは / App Router の地図
  02-routing.md               ← ルーティング (Link, layout, 動的ルート)
  03-server-client.md         ← Server / Client Components の境界 ★最重要
  04-data-fetching.md         ← Server でデータを取る (fetch, searchParams)
  05-server-actions.md        ← Server Actions (フォーム, revalidate)
  06-rendering-cache.md       ← レンダリング戦略 + キャッシュ4層の地図
  07-test-debug.md            ← Vitest + デバッグ
  08-hackathon-prep.md        ← ハッカソン助走
  glossary.md                 ← 用語集 (Ctrl+F で検索する辞書)
```
