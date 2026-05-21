# Next.js 研修 — 講義資料 (Day 1〜2)

新卒向け Next.js 研修の講義パートです。Day 1〜2 で App Router の基礎を仕込み、
Day 3〜5 で個人ハッカソンに入る前提で構成されています。

## 前提

- TS研修 (3日) を修了している
- React研修 (別途) を修了している (ブランクがあってもOK / 00章で軽くおさらいします)
- Node.js 20+ がインストールされている
- VSCode + TypeScript拡張を使う想定

## 想定環境

- **Next.js**: 16.x (App Router、Turbopackデフォルト)
- **React**: 19系
- **TypeScript**: 5系
- **Node.js**: 20以上

## 章構成

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
| 08 | ハッカソン助走 | Day 2 午後 | 60m | — |

合計: 講義 約5h + 演習 約4h (Day 1〜2 の枠に収まる想定)

加えて、いつでも参照できる **[lectures/glossary.md](lectures/glossary.md)** に用語集を置いています。

## 設計コンセプト (改訂版)

旧版が「知っている前提」になっていたのを反省し、以下の方針で書き直しています:

- **読者像**: React は一応やったがブランクあり / Next.js は初めて
- **各章の定型**: ゴール → なぜこの章 → 用語 → 本編 (概念 → **動く最小コード** → 解説) → ハンズオン (手順番号) → 詰まったら (Q&A) → チェックリスト
- **コード例は必ず動く完成形**を載せる (旧版は「コード例」だけ書いて中身が無かった)
- **用語は初出で1行説明 + glossary リンク**
- **Pages Router 関連はコラム化 or 「忘れてOK」と明記**

## 進め方

1. 講師は受講者全員と画面共有しながら、各 `.md` を上から順に進める
2. コードブロックは **受講者の手元でも実際にタイプしながら** 進める
3. 各章末のハンズオン / 演習は時間を区切ってやってもらう
4. 詰まる人がいたら巡回 / ペアプロでフォロー
5. **5分悩んだら聞いてOK** を最初に強調する

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

## 講師向けメモ

- **03章 (Server/Client)** が研修全体で最も重要。ここに時間を割く
- **06章 (キャッシュ)** は新卒最大の沼。完全理解を目指さず「地図を渡す」気持ちで
- 旧版にあった「`> 講師メモ`」ブロックは削除済み。本文側に組み込んでいる
- 受講者の質問は **本文に追加していく** のがおすすめ ("詰まったら" セクションに育てる)
