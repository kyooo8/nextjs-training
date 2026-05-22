# 02. ルーティングを書く

## この章のゴール

- 新しい URL を作るために、どこに何のファイルを置けばよいかわかる
- `Link` で画面遷移を書ける
- 動的ルート (`/posts/[id]`) を作り、`params` から ID を取り出せる
- 共通レイアウト (`layout.tsx`) で「全ページ共通のヘッダー」が作れる

---

## この章で出てくる用語

| 用語 | ざっくり |
|------|---------|
| **ルート (route)** | URL ひとつ分。`/about` や `/posts/42` がそれぞれ「1つのルート」 |
| **動的セグメント** | `[id]` のように「中身が変わる部分」。 `[フォルダ名]` の形 |
| **`params`** | 動的セグメントから取れる値。`/posts/42` なら `{ id: '42' }` |
| **`Link`** | Next.js 標準の画面遷移コンポーネント。`<a>` の代わりに使う |

詳しくは [glossary.md](glossary.md)。

---

## 静的なページを1つ追加する

まずは一番シンプルな例から。`/about` という URL を増やしてみます。

**作るファイル**: `src/app/about/page.tsx`

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
      <p>ユニコォォォォーーーーン！！</p>
    </main>
  );
}
```

これだけで `http://localhost:3000/about` が開けるようになります。

> 💡 ポイント: **デフォルト export された関数の名前 (`AboutPage`) は何でもOK**。重要なのは「ファイル名が `page.tsx`」「フォルダ名が URL」の2つだけ。

---

## ページを `Link` でつなぐ

`<a href="/about">` でも動きますが、それだと **ページ全体を再読み込み** してしまい遅いです。
Next.js では `Link` を使うと、必要な部分だけ差し替える **高速な遷移 (クライアントナビゲーション)** になります。

**編集するファイル**: `src/app/page.tsx`

```tsx
// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>ホーム</h1>
      <ul>
        <li><Link href="/about">About へ</Link></li>
        <li><Link href="/posts">投稿一覧へ</Link></li>
      </ul>
    </main>
  );
}
```

> 💡 import 元は **`next/link`**。`react-router-dom` ではないので注意。

---

## 動的ルート (`/posts/[id]`)

「投稿の詳細ページ」のように、URLの一部が **動的に変わる** ページを作るには `[フォルダ名]` の形を使います。

```
src/app/
├── posts/
│   ├── page.tsx           ← /posts (一覧)
│   └── [id]/
│       └── page.tsx       ← /posts/任意の値 (詳細)
```

**作るファイル1**: 一覧 `src/app/posts/page.tsx`

```tsx
// src/app/posts/page.tsx
import Link from 'next/link';

const posts = [
  { id: '1', title: 'はじめての投稿' },
  { id: '2', title: '「それでも」と言い続けろ' },
  { id: '3', title: '輝きの向こう側へ' },
];

export default function PostsPage() {
  return (
    <main>
      <h1>投稿一覧</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <Link href={`/posts/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

**作るファイル2**: 詳細 `src/app/posts/[id]/page.tsx`

```tsx
// src/app/posts/[id]/page.tsx
type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <main>
      <h1>投稿 #{id}</h1>
      <p>これは ID {id} の詳細ページです。</p>
    </main>
  );
}
```

---

## 共通レイアウト (`layout.tsx`)

ヘッダーやサイドバーなど、配下の全ページに共通する枠を書くのが `layout.tsx` です。
スターターを `create-next-app` で作っていれば、ルートの `src/app/layout.tsx` はもう存在します (ここに `<html>` と `<body>` を書く)。

ここでは`/posts` 配下にだけサイドバーを出すレイアウトを増やしてみます。

```tsx
// src/app/posts/layout.tsx
import Link from 'next/link';

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <aside style={{ width: 160, borderRight: '1px solid #ddd', paddingRight: 16 }}>
        <h2>メニュー</h2>
        <ul>
          <li><Link href="/posts">一覧</Link></li>
          <li><Link href="/posts/1">投稿1</Link></li>
          <li><Link href="/posts/2">投稿2</Link></li>
        </ul>
      </aside>
      <section style={{ flex: 1 }}>{children}</section>
    </div>
  );
}
```

ポイント:

- `children` には `posts/page.tsx` や `posts/[id]/page.tsx` が入る
- ページを切り替えても、サイドバー部分は再レンダリングされない(これがレイアウトの利点)

---

## 404 ページ

`not-found.tsx` を置けば、存在しないルートにアクセスされたときの表示を作れます。

```tsx
// src/app/not-found.tsx
export default function NotFound() {
  return (
    <main>
      <h1>ページが見つかりません</h1>
      <p>URL を確認してください。</p>
    </main>
  );
}
```

---

## ハンズオン

スターターを動かした状態で、以下を1つずつやります。

### 1. `/about` を作る
- `src/app/about/page.tsx` を作って、適当な文字を表示
- ブラウザで `http://localhost:3000/about` を開いて表示されること

### 2. トップから `/about` への Link を張る
- `src/app/page.tsx` を編集
- `next/link` の `Link` を使う
- ブラウザで戻る・進むができることも確認

### 3. `/posts` の一覧ページを作る
- 上のサンプルそのままでOK
- 配列 `posts` を増やして10件ぐらいに変えてみる

### 4. `/posts/[id]` の詳細ページを作る
- `await params` を忘れないこと
- 一覧の `Link` から詳細に飛べることを確認

### 5. `/posts` 配下にサイドバー (`layout.tsx`) を追加
- 一覧画面と詳細画面で、サイドバーが同じままであることを確認
- ページ切り替え時にサイドバーが点滅しなければ成功

### 6. (余裕があれば) `posts/[id]` で、`posts` 配列から該当の投稿だけを表示する
- `posts.find((p) => p.id === id)` で見つける
- 見つからなければ「投稿が見つかりません」と表示

---

## 詰まったら (Q&A)

**Q. 404 になる**
A. まずファイル名が `page.tsx` (小文字、`.tsx`) かを確認。`Page.tsx` や `index.tsx` はダメ。

**Q. `params.id` が `undefined` / "params should be awaited" エラーが出る**
A. Next.js 15+ では `await params` が必須です。
```tsx
// ❌ ダメ
export default function Page({ params }) {
  return <p>{params.id}</p>;
}

// ✅ OK
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <p>{id}</p>;
}
```

**Q. `Link` をクリックしたらフル再読み込みになる**
A. `<a>` を使ってませんか? `next/link` の `Link` コンポーネントを使ってください。

**Q. レイアウトが効かない (サイドバーが出ない)**
A. ファイル名が `layout.tsx` か / `children` を `return` の中で表示しているかを確認。

---

## チェックリスト

- [ ] `/about` をブラウザで開ける
- [ ] トップから `Link` で `/about` `/posts` に飛べる
- [ ] `/posts/任意の数字` で詳細が表示される
- [ ] `params` を `await` してから使うことを覚えた
- [ ] `/posts` 配下でサイドバーが共通表示される
