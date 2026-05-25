# Next.js ドキュメント参照ルール (AI エージェント向け)

このプロジェクトの `node_modules/next` は **Next.js 16.x** が入っている。
**学習データの Next.js 知識は ほぼ Next.js 13 / 14 までの旧 API** で、
そのまま使うと、もう非推奨 / 削除済み / 挙動が変わった機能を「最新」 として書いてしまう。

Next.js に触れる前に、**必ずこのチートシートを使って `node_modules/next/dist/docs/` 配下を Read** すること。

## 鉄則

1. Next.js 固有の話題に触れる前に、まず該当ドキュメントを Read する
2. **「だいたいこんな API だったはず」 で書かない**。ドキュメントを開いて確認する
3. ドキュメントとの照合が終わるまで、コード片 / 解説文を出力しない
4. Web 上のブログ記事や Stack Overflow を参照したくなったら、**先に `node_modules/next/dist/docs/` を必ず読む**。バージョン不一致のリスクが圧倒的に高い

## ドキュメントのルート

```
node_modules/next/dist/docs/
├── 01-app/                    ← App Router の全ドキュメント (これがメイン)
│   ├── 01-getting-started/    ← 始める時に読むやつ
│   ├── 02-guides/             ← 個別トピックのガイド
│   ├── 03-api-reference/      ← API リファレンス
│   │   ├── 01-directives/     ← "use client" / "use server" / "use cache"
│   │   ├── 04-functions/      ← cookies / headers / cacheLife / updateTag / revalidateTag …
│   │   ├── 05-config/         ← next.config.ts のオプション
│   │   └── ...
│   └── 04-glossary.md         ← 用語集
├── 02-pages/                  ← 使わない (このプロジェクトでは触れないこと)
├── 03-architecture/
└── 04-community/
```

## トピック → ドキュメントパス対応表

質問・修正対象が左のキーワードに当てはまるとき、右のファイルを必ず Read する。
(`node_modules/next/dist/docs/` を起点としたパス)

| トピック | 必読ファイル |
|---------|------------|
| キャッシュ全般 / `fetch` の挙動 / `'use cache'` | `01-app/01-getting-started/08-caching.md` + `01-app/03-api-reference/01-directives/use-cache.md` |
| 旧モデルでのキャッシュ (Cache Components 無効) | `01-app/02-guides/caching-without-cache-components.md` |
| revalidation / `updateTag` / `revalidateTag` / `revalidatePath` | `01-app/01-getting-started/09-revalidating.md` + `01-app/03-api-reference/04-functions/{updateTag,revalidateTag,revalidatePath}.md` |
| `cacheLife` / `cacheTag` | `01-app/03-api-reference/04-functions/{cacheLife,cacheTag}.md` |
| Server / Client Components / `"use client"` | `01-app/01-getting-started/05-server-and-client-components.md` + `01-app/03-api-reference/01-directives/{use-client,use-server}.md` |
| データ取得 (Server Component で fetch / DB) | `01-app/01-getting-started/06-fetching-data.md` |
| Server Actions / フォーム / `useActionState` | `01-app/01-getting-started/07-mutating-data.md` + `01-app/02-guides/forms.md` |
| `layout.tsx` / `page.tsx` / ファイル規約 | `01-app/01-getting-started/03-layouts-and-pages.md` + `01-app/01-getting-started/02-project-structure.md` |
| `<Link>` / クライアントナビゲーション / prefetch | `01-app/01-getting-started/04-linking-and-navigating.md` + `01-app/02-guides/prefetching.md` |
| Route Handler (`app/api/.../route.ts`) | `01-app/01-getting-started/15-route-handlers.md` |
| Streaming / `<Suspense>` / `loading.tsx` / PPR | `01-app/02-guides/streaming.md` |
| `params` / `searchParams` / 動的ルート | `01-app/03-api-reference/03-file-conventions/page.md` (or `dynamic-routes.md`) |
| エラー (`error.tsx` / `notFound`) | `01-app/01-getting-started/10-error-handling.md` |
| メタデータ / OG画像 | `01-app/01-getting-started/14-metadata-and-og-images.md` |
| 画像 (`<Image>`) / `next/image` | `01-app/01-getting-started/12-images.md` |
| フォント (`next/font`) | `01-app/01-getting-started/13-fonts.md` |
| CSS / Tailwind / CSS Modules | `01-app/01-getting-started/11-css.md` |
| デプロイ | `01-app/01-getting-started/17-deploying.md` |
| アップグレード (バージョン間差分) | `01-app/01-getting-started/18-upgrading.md` |
| 認証 | `01-app/02-guides/authentication.md` |
| 用語の定義 | `01-app/04-glossary.md` |
| `next.config.ts` のオプション | `01-app/03-api-reference/05-config/01-next-config-js/` 配下を grep |

不明なときは `find node_modules/next/dist/docs -name "*<keyword>*"` で検索する。

## 過去にハマった (Next.js 16 で変わった) 主要ポイント

学習データから持ってきがちな、**古くて間違っている** 知識:

| 思い込みやすい古い知識 | Next.js 16 (現行) の実態 |
|----------------------|---------------------|
| `fetch` はデフォルトでキャッシュされる | デフォルトは **キャッシュされない**。`'use cache'` で明示 |
| `fetch(url, { next: { revalidate: 60 } })` で ISR | Cache Components モデルでは `'use cache'` + `cacheLife('hours')` |
| 書き込み後は `revalidatePath` | タグベースの **`updateTag`** / `revalidateTag` が推奨 |
| `params` / `searchParams` はオブジェクト | **Promise** になっている (15+) → `await` が必要 |
| キャッシュは 4層モデル (Data Cache / Full Route Cache / etc) | 4層モデルは旧モデル。現行は Cache Components + Static Shell + Router Cache |
| `unstable_cache` / `unstable_noStore` | `'use cache'` ディレクティブに置き換わった |
| Server Action は `<form action>` だけで使う | Client Component から関数として import して呼ぶ用法もある |
| Server Component で `useState` | 使えない (Client Component のみ) |

これらは **疑わしいと思ったら必ず該当 doc を読み直す**。

## 守るべき手順

```
ユーザーから Next.js 関連の依頼が来た
        ↓
依頼内容のキーワードを上の対応表で引く
        ↓
該当する node_modules/next/dist/docs/... ファイルを Read
        ↓
読んだ内容に基づいて回答 / コードを書く
        ↓
コード片を出力するときは、API 名 / オプション名 / シグネチャを doc と照合済みであることを確信してから
```

**省略するとユーザーに古い API で講義資料を書いてしまう事故が再発する。**
