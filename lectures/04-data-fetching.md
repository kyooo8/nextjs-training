# 04. Server でデータを取る

> **講義 30分 + ハンズオン 45分**
> Server Component で `await fetch()` する書き心地を体験する回。

## この章のゴール

- Server Component で `fetch` してデータを取り、そのまま画面に出せる
- 「データ取得は**画面のすぐ近くに書く**」感覚を持つ
- `searchParams` を使った絞り込みを書ける
- Route Handler (`route.ts`) の使い所を判断できる

---

## なぜこの章があるか

React 時代の常識は「`useEffect` の中で `fetch` → `setState`」でした。
App Router (Server Component) の世界では、その書き方は **第一選択ではありません**。
ここを切り替えると、コード量が劇的に減り、見通しが良くなります。

---

## この章で出てくる用語

| 用語 | ざっくり |
|------|---------|
| **コロケーション** | データ取得を「使う場所のすぐそば」に書く設計思想 |
| **Request Memoization** | 同じURLへの `fetch` を1リクエスト中に自動でまとめてくれる仕組み |
| **`searchParams`** | URL の `?key=value` 部分を読む props (Promise) |
| **Route Handler** | `app/api/.../route.ts` の HTTP エンドポイント |

詳しくは [glossary.md](glossary.md)。

---

## Server Component の中で `fetch` する

Server Component は **async 関数として書ける** ので、中で `await fetch()` ができます。

```tsx
// src/app/posts/page.tsx
type Post = { id: number; title: string };

export default async function PostsPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts: Post[] = await res.json();

  return (
    <main>
      <h1>投稿一覧</h1>
      <ul>
        {posts.slice(0, 10).map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

これだけで動きます。

**ポイント**:
- `getServerSideProps` のような「props で渡す」儀式は **不要**
- 関数の中で直接 `await` できるので、コードが上から下に素直に読める
- 出てくる HTML はサーバーで完成済み (= 初回表示が速い、SEO も良い)

---

## 「データ取得を近くに置く」 = コロケーション

従来 (Pages Router / Express) :

```
getServerSideProps で取得   ← データ取得
        ↓ props
コンポーネント              ← データ使用
        ↓ さらに props
子コンポーネント            ← データ使用
```

App Router:

```
コンポーネント
  ├ const data = await fetch(...)   ← 取得と使用が同じ場所
  └ return <... data ... >
```

「取得 → props で延々と引き回す」のバケツリレーが消えます。
これが **コロケーション** という設計思想です。

---

## 同じデータを2回 fetch しても大丈夫

「親レイアウトでもユーザー情報がいる、子ページでもユーザー情報がいる」 ── そんなとき、両方で `fetch` していいの? と心配になります。

答え: **同じリクエスト中なら自動で1回にまとめてくれる** (Request Memoization)。

```tsx
// layout でも...
const user = await fetch('/api/me').then(r => r.json());

// page でも...
const user = await fetch('/api/me').then(r => r.json());
// → 実際のHTTPリクエストは 1 回だけ
```

→ だから「データ取得を共通化するために props で渡す」必要があまりありません。**欲しい場所で取りに行けばいい**。

> ⚠️ 注意: dedupe (重複排除) されるのは **同一の URL + メソッド** の場合だけ。DB 直アクセスや、別関数で包んだ場合は別ルール (詳しくは06章のキャッシュで)。

---

## 動的セグメント + データ取得

02章で書いた `/posts/[id]` を、実データから取るように書き換えます。

```tsx
// src/app/posts/[id]/page.tsx
type Props = { params: Promise<{ id: string }> };
type Post = { id: number; title: string; body: string };

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post: Post = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  ).then((r) => r.json());

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </main>
  );
}
```

ポイント:
- `params` も `await` するし、`fetch` も `await` する。両方とも Promise
- ID が存在しないとき (404) のハンドリングは後でやればよい (まず動かす)

---

## `searchParams` で `?q=...` を読む

URL の `?q=React` のような **クエリ文字列** を読むには、props の `searchParams` を使います。
これも `params` と同じく **Promise** です。

```tsx
// src/app/posts/page.tsx
type Props = {
  searchParams: Promise<{ q?: string }>;
};
type Post = { id: number; title: string };

export default async function PostsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const posts: Post[] = await fetch(
    'https://jsonplaceholder.typicode.com/posts'
  ).then((r) => r.json());

  const filtered = q
    ? posts.filter((p) => p.title.includes(q))
    : posts;

  return (
    <main>
      <h1>投稿一覧 {q && `(検索: ${q})`}</h1>
      <ul>
        {filtered.slice(0, 10).map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

03章で作った `SearchBox` (Client) と組み合わせると、**「Client で検索文字列を URL に入れる → Server がそれを読んで絞り込んだ HTML を返す」** が完成します。

---

## 取得中の表示: `loading.tsx`

データ取得には時間がかかります。読み込み中の画面を `loading.tsx` で簡単に作れます。

```tsx
// src/app/posts/loading.tsx
export default function Loading() {
  return <p>読み込み中…</p>;
}
```

`/posts` を開くと、データが届くまで「読み込み中…」と表示されます。これは内部的には React の `Suspense` を使った仕組みです (詳しくは06章)。

---

## DB アクセスも同じ感覚

`fetch` を `prisma.post.findMany()` などに置き換えるだけ。書き心地はそのまま。

```tsx
// src/app/posts/page.tsx (Prisma 例)
import { prisma } from '@/lib/prisma';

export default async function PostsPage() {
  const posts = await prisma.post.findMany();
  return (
    <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
  );
}
```

> ハッカソンのスターターでは DB を使うものもあります。「Server Component + ORM」 がデフォルトと思ってください。

---

## Route Handler (`route.ts`) って何に使うの?

`app/api/.../route.ts` を作ると **REST API エンドポイント** が作れます。

```ts
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true });
}
```

`http://localhost:3000/api/health` を開くと `{ "ok": true }` が返ります。

### でも、いつ使うの?

「ページ表示用のデータは Server Component の中で取ればいい」となると、Route Handler の出番は限られます。

**使うとき**:
- **外部のシステムから HTTP で叩かれる** エンドポイント (Webhook、OAuth コールバック)
- **JSON 以外を返したい** (画像生成、CSV ダウンロード、ストリーミング)
- **ヘルスチェック** や **クライアントから叩く軽い API**

**使わなくていいとき**:
- 自分のページに表示するデータ取得 → Server Component で直接やる
- フォーム送信や書き込み → **Server Actions** (05章)

> 💡 「Pages Router 時代の `pages/api/...` の置き換え」のように思いがちですが、App Router では出番がぐっと減ります。

---

## ハンズオン (45分)

### 1. 一覧を fetch から取るように書き換え
- 02章で書いた `src/app/posts/page.tsx` を fetch ベースに変更
- 上のサンプルそのままでOK (`jsonplaceholder.typicode.com` は無料の練習用API)

### 2. 詳細ページも fetch から取る
- `src/app/posts/[id]/page.tsx` を書き換え
- `params.id` を使って、その ID の投稿を1件取る

### 3. `loading.tsx` を追加
- `src/app/posts/loading.tsx` を作る
- ブラウザの DevTools で Network を Slow 3G にして、読み込み中が見えることを確認

### 4. 検索機能
- 03章で作った `SearchBox` (Client) を `/posts` の上部に置く
- `searchParams.q` を読んで、`posts.filter()` で絞り込む
- フォーム送信 → URL に `?q=...` → サーバーが絞った結果を返す、の流れを体験

### 5. `/api/health` を作る
- `src/app/api/health/route.ts` を作る
- ブラウザで `/api/health` を開いて JSON が見えること
- (発展) `?name=さくら` を読んで `{ ok: true, name: 'さくら' }` を返してみる
  - Route Handler では `Request` の `url` から検索パラメータを取る:
  ```ts
  export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    return Response.json({ ok: true, name });
  }
  ```

---

## 詰まったら (Q&A)

**Q. "Cannot use 'await' outside async function" と出る**
A. 関数を `async` にしてください。`export default async function Page() { ... }`

**Q. "params should be awaited" / "searchParams should be awaited"**
A. Next.js 15+ では両方 Promise。`await` してから使う。

**Q. fetch したのに何度リロードしても古いデータのまま**
A. **キャッシュ** にやられている可能性。Next.js 16 のキャッシュは「明示的に書いた部分だけがキャッシュされる」モデルですが、ビルド時のスナップショットや CDN 経由で古いものが返ることはあります。本格的なキャッシュ制御は 06章で。

**Q. searchParams をページの上で `await` していますが、本当はマズい?**
A. Cache Components モデルでは「動的データの await はそれを使う末端のコンポーネントまで持っていく」 のが推奨です。この章では分かりやすさを優先して page の上で書いていますが、本来は `<Suspense>` で囲って、その中で await するのがベストプラクティス。詳しくは 06章。

**Q. `useEffect` で fetch しちゃダメなの?**
A. ダメではないけど、まず Server Component で書けないか考える。`useEffect + fetch` は「クライアント側でしか取れないデータ」(ユーザー操作で動的に変わるなど) に限定するのが App Router の流儀。

**Q. 取得後にデータを加工したい (sort, group_by など)**
A. Server Component の中で普通の JS として書けばOK。サーバーで処理される。

---

## チェックリスト

- [ ] `await fetch()` を Server Component の中で書ける
- [ ] 「コロケーション」 = データ取得をコンポーネントのすぐそばに書く、を覚えた
- [ ] `params` も `searchParams` も Promise であることを覚えた
- [ ] `loading.tsx` の使い方がわかった
- [ ] Route Handler は「外部から叩かれるとき」「JSON以外を返すとき」が主用途、と理解

---

## 次の章へ

[05-server-actions.md](05-server-actions.md) では「データを書く側」 ── フォーム送信・更新・削除を **Server Actions** で書く方法を学びます。
