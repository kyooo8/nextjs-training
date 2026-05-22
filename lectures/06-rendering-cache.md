# 06. レンダリング戦略とキャッシュ

## この章のゴール

- Static / Streaming / Dynamic の違いを 30秒で説明できる
- Next.js 16のCache Componentsモデル (**明示的にキャッシュする**) を理解する
- `'use cache'` でコンポーネント・関数をキャッシュできる
- `cacheLife` (寿命) と `cacheTag` (タグ) の役割がわかる
- 書き込み後のキャッシュ破棄は `updateTag` / `revalidateTag` を使い分けられる
- 動的な処理 (cookies / searchParams など) は `<Suspense>` で囲う、を体得する

---

## この章で出てくる用語

| 用語 | ざっくり |
|------|---------|
| **Cache Components** | Next.js 16 の現行キャッシュモデル。「明示的に書いたものだけキャッシュ」 |
| **`'use cache'`** | 「この関数 / コンポーネントの結果をキャッシュして」と宣言するディレクティブ |
| **`cacheLife`** | キャッシュの寿命を指定する関数 (`'hours'`, `'days'` などのプロファイル) |
| **`cacheTag`** | キャッシュにタグを付ける関数。後でタグ単位で破棄するため |
| **`updateTag`** | タグ付きキャッシュを **即時破棄** (Server Actions 内、自分の書き込みを即見せたいとき) |
| **`revalidateTag`** | タグ付きキャッシュを破棄 (古いまま返しつつ裏で更新 = stale-while-revalidate) |
| **`<Suspense>`** | 「ここの中身は遅れて届くかも」を示す React の境界 |
| **Static Shell** | ビルド時に作っておく、ページの "枠" 部分の HTML |
| **PPR (Partial Prerendering)** | 静的シェル + 動的部分をストリーミング、の組み合わせ |

詳しい説明は [glossary.md](glossary.md)。

---

## 大前提: Next.js 16 のキャッシュは「オプトイン」

> 一行で: **デフォルトでは何もキャッシュされない。`'use cache'` を書いた部分だけがキャッシュされる**。

有効化するには、`next.config.ts` に1行追加します。

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true, // ← これ
}

export default nextConfig
```

研修のスターターでは、これを有効にした前提で進めます。

---

## レンダリングの3形態

### 1. Static (静的)
- 静的シェル (Static Shell) として **ビルド時に HTML を作っておく**
- 以降は CDN から即配信できる (速い・安い)
- 例: ヘッダー、ナビ、利用規約

### 2. Streaming (ストリーミング)
- レンダリングしながら、できた部分から順次ブラウザに送る
- 静的シェルを先に出し、遅い部分を後から差し込む
- `<Suspense>` 境界 + `loading.tsx` で実現

### 3. Dynamic (動的)
- リクエストごとにサーバーで作る
- ユーザー固有データ、その瞬間ごとに違う情報
- App Router では「`<Suspense>` の中で実行され、ストリーミングされる」 形が基本

イメージ:

```
[ブラウザ]  ← Static シェル (即届く: ヘッダー、ナビ、スケルトン)
           ← (200ms後) ストリーミングで届く: 「投稿一覧」 セクション
           ← (1s後)   ストリーミングで届く: 「個人化されたお知らせ」
```

---

## どんな処理が「dynamic」 扱いになるか

App Router (Cache Components 有効時)では、以下を`<Suspense>`で囲うか`'use cache'`でキャッシュするかのどちらかをしないとビルドエラーになります。

| トリガー | 何が原因 |
|----------|---------|
| `await cookies()` | リクエスト固有のクッキーを読んでいる |
| `await headers()` | リクエスト固有のヘッダーを読んでいる |
| `await searchParams` | クエリ文字列は毎回違う |
| `await params` (動的セグメント) | URLの一部が動的 |
| `Math.random()` / `Date.now()` / `crypto.randomUUID()` | 非deterministic な処理 |
| 非キャッシュの `await fetch(...)` / DB クエリ | ランタイムデータ取得 |

> 💡 ビルドエラーのメッセージ: `Uncached data was accessed outside of <Suspense>` ← これが出たら、囲うか `'use cache'` を付ける。

---

## `'use cache'`でキャッシュする

ファイル / コンポーネント / 関数 の 3レベルで使えます。

### 関数レベル (一番よく使う)

```tsx
// src/lib/posts.ts
import { cacheLife, cacheTag } from 'next/cache'

export async function getPosts() {
  'use cache'              // ← この関数の戻り値をキャッシュ
  cacheLife('hours')       // ← 寿命: 1時間 (組み込みプロファイル)
  cacheTag('posts')        // ← タグ: 後で 'posts' でまとめて破棄できる

  return await db.post.findMany()
}
```

### コンポーネントレベル

```tsx
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('posts')

  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

### ファイルレベル (ファイル先頭に書く)

```tsx
// src/app/news/page.tsx
'use cache'

export default async function NewsPage() {
  // このファイルから export される全関数がキャッシュ対象に
  return <main>...</main>
}
```

---

## `cacheLife` の組み込みプロファイル

| プロファイル | revalidate (どれくらいでサーバー側が再生成) |
|------------|------------------------------|
| `seconds` | 1秒 |
| `minutes` | 1分 |
| `hours`  | 1時間 |
| `days`   | 1日 |
| `weeks`  | 1週間 |
| `max`    | 30日 |

数値で細かく指定もできます:

```tsx
'use cache'
cacheLife({
  stale: 3600,       // クライアント側で古いとみなすまで 1時間
  revalidate: 7200,  // サーバー側で再生成までの 2時間
  expire: 86400,     // 完全に切れるまでの 1日
})
```

迷ったらまず `'hours'` か `'days'` を使えばOK。

---

## 動的な部分は `<Suspense>` で囲う (重要)

Cache Components モデルで一番よくやるパターン:

```tsx
// src/app/dashboard/page.tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'

// 静的シェルに入る部分
export default function DashboardPage() {
  return (
    <main>
      <h1>ダッシュボード</h1>                {/* ← 静的 */}
      <BlogPosts />                          {/* ← キャッシュ済み */}
      <Suspense fallback={<p>読み込み中…</p>}>
        <UserGreeting />                     {/* ← 動的: cookies を使う */}
      </Suspense>
    </main>
  )
}

// キャッシュされるコンポーネント (静的シェルに含まれる)
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

// 動的コンポーネント (Suspense で囲って streaming)
async function UserGreeting() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  return <p>あなたのテーマ: {theme}</p>
}
```

**ポイント**:
- ヘッダー `<h1>` と `<BlogPosts />` は **ビルド時に作って配信**
- `<UserGreeting />` は `<Suspense>` で囲んだので、その内側だけリクエスト時に streaming
- これが Partial Prerendering (PPR)。最速で出せる部分だけ先に出す思想

---

## 「動的データを上で await しない」 鉄則

Suspense の効果を最大化するには:

❌ **NG**: ページの上で動的データを await する

```tsx
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams  // ← ここで await すると...
  return (
    <>
      <h1>検索</h1>                  // ← ここも全部 dynamic になる
      <Results q={q} />
    </>
  )
}
```

✅ **OK**: Suspense の内側に await を押し込む

```tsx
export default function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return (
    <>
      <h1>検索</h1>                                  {/* ← static */}
      <Suspense fallback={<p>検索中…</p>}>
        <Results paramsPromise={searchParams} />     {/* ← この中で await */}
      </Suspense>
    </>
  )
}

async function Results({ paramsPromise }: { paramsPromise: Promise<{ q?: string }> }) {
  const { q } = await paramsPromise
  // ... 検索処理
}
```

ルール: 「動的データの `await` は、それが必要な末端のコンポーネントまで持っていく」。

---

## 書き込み後のキャッシュ破棄:`updateTag`vs`revalidateTag`

書き込み (Server Actions) 後、関連するキャッシュを破棄する関数が3つあります。
新しい書き方では `revalidatePath` よりタグベース (`updateTag` / `revalidateTag`) が推奨されています。

|  | `updateTag` | `revalidateTag` | `revalidatePath` |
|--|------------|-----------------|------------------|
| **使える場所** | Server Actions のみ | Server Actions + Route Handlers | 両方 |
| **挙動** | **即時破棄** | stale-while-revalidate (古いまま返して裏で更新) | パス全体を破棄 |
| **使い所** | 自分の書き込みを即座に見せたい | バックグラウンドで更新でOK | タグが分からないとき |

### updateTag (即時): 「投稿した直後、自分のページに自分の投稿が見えるべき」

```ts
// src/app/posts/actions.ts
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') ?? '')
  await db.post.create({ data: { title } })
  updateTag('posts')        // ← 'posts' タグ付きキャッシュを即時破棄
  redirect('/posts')
}
```

### revalidateTag (stale-while-revalidate): 「ニュース記事は数秒遅れて反映してもOK」

```ts
'use server'

import { revalidateTag } from 'next/cache'

export async function publishArticle(id: string) {
  await db.article.update({ where: { id }, data: { published: true } })
  revalidateTag('articles', 'max') // 'max' = stale ウィンドウを最大に
}
```

### revalidatePath (ざっくり): 「とにかくこのページのキャッシュ捨てて」

```ts
'use server'
import { revalidatePath } from 'next/cache'

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } })
  revalidatePath('/posts')
}
```

> 💡 推奨度: **`updateTag`/`revalidateTag` > `revalidatePath`**。タグの方が精密で、必要なキャッシュだけ破棄できます。

---

## ハンズオン

### 0. 準備
- `next.config.ts` に `cacheComponents: true` を追加 (まだなら)

### 1. 静的なお知らせページ
- `src/app/news/page.tsx` を作る
- 固定の文字列だけ表示
- ビルドログで Static として扱われていることを確認

### 2. `'use cache'` でキャッシュした投稿一覧
- `src/lib/posts.ts` に `getPosts()` を作る
- `'use cache'` + `cacheLife('hours')` + `cacheTag('posts')` を書く
- `/posts` ページから呼んで一覧表示

### 3. 動的なテーマ表示 (Suspense)
- `src/app/dashboard/page.tsx` を作る
- 上部: 静的なヘッダー
- 下部: `<Suspense>` で囲った `<UserGreeting />` で `cookies()` を読む
- ブラウザの DevTools でクッキーをセットして表示が変わることを確認

### 4. 書き込み後のキャッシュ破棄
- 05章で書いた `createPost` Server Actionを、`revalidatePath`から`updateTag('posts')`に書き換え
- `getPosts()`に`cacheTag('posts')`が付いている → 投稿後に最新の一覧が見える

### 5. (発展) `<Suspense>` を意図的に外してビルド
- `<UserGreeting />` の `<Suspense>` を外す
- `npm run build` でエラー (`Uncached data was accessed outside of <Suspense>`) を読む
- 戻して直す

---

## 詰まったら (Q&A)

**Q. ビルドで `Uncached data was accessed outside of <Suspense>` と出る**
A. cookies / headers / searchParams / params / 非キャッシュfetch のどれかを、Suspense で囲わずに使っています。該当箇所を Suspense で囲うか、`'use cache'` を付けてキャッシュ可能にする。

**Q. 投稿したのに一覧が古いまま**
A. Server Action の最後で `updateTag('posts')` (または `revalidateTag` / `revalidatePath`) を呼んでいますか?
あと、`getPosts()` 側に `cacheTag('posts')` が付いているか確認。

**Q. `'use cache'` の中で `cookies()` を呼ぼうとしたら怒られた**
A. キャッシュされた関数の中で動的データを直接読むことはできません。Suspense の中で読んでから、引数として `'use cache'` 関数に渡してください。

**Q. ビルドが固まる (50秒で timeout)**
A. `'use cache'` の中で、外部の動的データ (await されていない Promise) を待っているのが原因。`use cache` のスコープに動的データを入れない。

**Q. `cacheLife('seconds')` を使ったら毎回再生成されて遅い**
A. `'seconds'` プロファイルは short-lived 扱いで、静的シェルに含まれません。意図的でなければ `'minutes'` 以上を。

**Q. 古い記事の `fetch(url, { next: { revalidate: 60 } })` は使える?**
A. Cache Components が有効なときは **旧モデルの fetch オプションは無視** または非推奨です。`'use cache'` + `cacheLife` に書き換える。

---

## チェックリスト

- [ ] Static / Streaming / Dynamic の違いを言える
- [ ] 「Next.js 16 のキャッシュは明示する世界」 と覚えた
- [ ] `'use cache'` + `cacheLife` + `cacheTag` の組み合わせを書ける
- [ ] 動的なデータ (cookies, searchParams, params) は `<Suspense>` で囲うことを覚えた
- [ ] 書き込み後は `updateTag` / `revalidateTag` を使う、を体得した
- [ ] ビルドエラー "Uncached data was accessed outside of <Suspense>" の意味がわかる
