# 03. Server / Client Components の境界

## この章のゴール

- Server Component と Client Component の **違い** を、自分の言葉で説明できる
- どちらにすべきかを判断できる
- `"use client"` の正しい書き方と「**伝染する**」性質を理解する
- Server から Client に渡せるもの・渡せないものを把握する

---

## この章で出てくる用語

| 用語 | ざっくり |
|------|---------|
| **Server Component** | サーバーで実行されるコンポーネント。デフォルトはこっち |
| **Client Component** | ブラウザで実行されるコンポーネント。`"use client"` を書く |
| **Hydration (ハイドレーション)** | サーバーで作ったHTMLにブラウザでJSを「噛ませて」動かす作業 |
| **`"use client"`** | 「ここから先は Client Component です」と宣言する1行 |
| **シリアライズ** | データを「文字列にして送れる形」に変換すること |

詳しくは [glossary.md](glossary.md)。

---

## デフォルトは Server Component

App Router では、**何も書かなければそのコンポーネントは Server Component** です。
02章で書いたページは全部 Server Component でした。

### Server Component の特徴

```tsx
// app/posts/page.tsx ← これは Server Component
export default async function PostsPage() {
  // ✅ async / await が使える
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  // ✅ DB に直接アクセスしてもOK (Prisma など)
  // ✅ APIキーなど秘密情報を使ってもOK (バンドルされない)

  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

**できること**:
- `async` / `await` (普通の非同期関数として書ける)
- DB アクセス、APIキー、サーバー専用ライブラリ
- 結果はHTMLとしてブラウザに送られる

**できないこと**:
- `useState` / `useEffect` などのフック
- `onClick` などのイベントハンドラ
- `window` / `document` / `localStorage` などのブラウザAPI

> 💡 一言で: **「ページが表示されるまでに1回サーバーで実行されておしまい」**。動的に値を持ったり、ユーザーの操作に反応したりはできない。

---

## Client Component とは

ユーザーの操作 (クリック・入力) に反応したいときに使うのが Client Component。
ファイル冒頭に **`"use client"`** と書きます。

```tsx
// app/components/Counter.tsx
"use client"; // ← この1行が全て

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      クリック数: {count}
    </button>
  );
}
```

**できること**:
- `useState` / `useEffect` などフック全部
- `onClick` などのイベント
- `window` / `localStorage` などのブラウザAPI

**できないこと**:
- DB の直接アクセス(ブラウザに機密情報を送ることになる)
- APIキーの使用
- `async function Component()` の形 (Client Component は async にできない)

> 💡 注意: 「Client Component」は**初回表示時はサーバーでも一度レンダリングされる** (HTML を生成するため)。
> その後ブラウザで JS が読み込まれて、ボタンが押せるようになる (これが Hydration)。
> 完全にブラウザだけで動くわけではない、と頭の隅に置いておいてください。

---

## どちらにすべきか判断する

迷ったらこのフローチャート:

```
そのコンポーネントは...
├── useState / useEffect / onClick / ブラウザAPI を使う?
│   └─ Yes → Client Component ("use client" を書く)
│   └─ No  → Server Component (何も書かない)
└─ DB / API キー / 秘密情報を使う?
    └─ Yes → Server Component 一択
```

原則としてServer Componentを使う様にしましょう。
Client にするのはどうしても必要なときだけにします。

---

## `"use client"` は "伝染する"

`"use client"` を書いたファイルが **import するファイルも、全部 Client Component になる** ことが決まっています。
これを「境界」と呼びます。

```tsx
// components/Layout.tsx
"use client";              // ← ここに書くと
import Header from './Header';  // ← Header も自動的に Client 扱い
import Footer from './Footer';  // ← Footer も自動的に Client 扱い
```

### ❌ アンチパターン: ルートの layout に `"use client"` を書く

```tsx
// src/app/layout.tsx に "use client" を書くと...
// → 全ページが Client Component 扱いになる
// → サーバーで HTML が組み立てられなくなる
// → 初回表示が遅くなる、SEO に弱くなる
```

### ✅ ベストプラクティス: Client 境界を **葉っぱ側** (=末端) に置く

```
[ページ全体は Server]
   └─ <ArticleList> ... Server
        └─ <Article> ... Server
             └─ <LikeButton> "use client"   ← ここだけ Client
```

「ボタンだけ」「フォームだけ」と、**小さく** Client にするのがコツです。

---

## ハンズオン1: ボタンだけ Client にする

ページ全体は Server のまま、お気に入りボタンだけを Client にしてみます。

**作るファイル1**: クライアント側のボタン `src/app/components/FavoriteButton.tsx`

```tsx
// src/app/components/FavoriteButton.tsx
"use client";

import { useState } from 'react';

export default function FavoriteButton() {
  const [isFav, setIsFav] = useState(false);
  return (
    <button onClick={() => setIsFav(!isFav)}>
      {isFav ? '★ お気に入り済み' : '☆ お気に入りに追加'}
    </button>
  );
}
```

**編集するファイル**: `src/app/posts/[id]/page.tsx`

```tsx
import FavoriteButton from '@/app/components/FavoriteButton';

type Props = { params: Promise<{ id: string }> };

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <main>
      <h1>投稿 #{id}</h1>
      <FavoriteButton />
    </main>
  );
}
```

**確認**:
- ボタンがクリックで切り替わる (☆ ↔ ★)
- ページ全体は依然として `async` の Server Component のまま
- ブラウザのページソースを見ると、ボタンの初期表示HTMLは入っている (Hydration で動くようになる)

---

## Server から Client へ渡せる props (重要)

Server Component から Client Component に props を渡すとき、**シリアライズできる値しか渡せない** という制約があります。

| 渡せる ✅ | 渡せない ❌ |
|----------|------------|
| string / number / boolean | 関数 (普通の) |
| 配列 / プレーンなオブジェクト | クラスのインスタンス |
| `null` / `undefined` | Map / Set |
| Date | Symbol |
| (例外) **Server Actions の関数** | (DOM 要素も渡せない) |

`Server Actions の関数` だけは特例で渡せます。詳しくは 05章 で。

### 失敗例

```tsx
// Server Component
const callback = () => console.log('clicked');
return <ChildClient onClick={callback} />;
//                  ^^^^^^^^^^^^^^^^^^ 関数は渡せない! エラーになる
```

→ 対処: 関数は Client 側で定義するか、Server Actions を使う。

---

## 逆方向: Client の中に Server を入れたい

「Client Component の中で Server Component を直接 import する」 は **できません**。
import すると伝染で Server が Client になってしまうからです。

代わりに **`children` プロップス経由で渡す** パターンを使います。

```tsx
// components/Modal.tsx (Client)
"use client";
import { useState } from 'react';

export default function Modal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>開く</button>
      {open && <div className="modal">{children}</div>}
    </>
  );
}
```

```tsx
// app/page.tsx (Server) — 親が両方をまとめる
import Modal from './components/Modal';
import ServerChart from './components/ServerChart'; // Server Component

export default function Page() {
  return (
    <Modal>
      <ServerChart />   {/* Server のまま渡せる */}
    </Modal>
  );
}
```

**ポイント**: 親 (Server) が **両方を子要素として組み立てる**。Modal は中身を「箱に入れて表示する」だけ。

---

## ハンズオン2: 検索ボックス (Client) + 結果表示 (Server)

「検索ボックスは Client、検索結果は Server」 の組み合わせを作ります。
※ 実際の検索は次章でやるので、ここでは **構造だけ** 練習。

**作るファイル**: `src/app/components/SearchBox.tsx`

```tsx
// src/app/components/SearchBox.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/posts?q=${encodeURIComponent(q)}`);
      }}
    >
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="検索..." />
      <button type="submit">検索</button>
    </form>
  );
}
```

**編集**: `src/app/posts/page.tsx` の上部に `<SearchBox />` を置く。

確認: 検索ボタンを押すと URL に `?q=...` が付くこと。
(検索結果を絞り込む処理は 04章 で `searchParams` を使ってやります)

---

## よくある勘違い

- **「Client Component はクライアントだけで動く」** → 違う。初回は **サーバーでもレンダリング** される (Hydration のため)
- **「`"use client"` をたくさん付けても問題ない」** → JSバンドルが膨れる、初回表示が遅くなる
- **「Server Component なら何でも秘密が守られる」** → **`props` として渡したものはクライアントに送られる**。秘密は Server Component の中だけで使う

---

## ハンズオン3: 意図的に壊して、エラーメッセージを読む

エラーメッセージを **読める** ようになるのは超重要スキル。意図的に壊してみます。

### A. Server Component で `useState` を使ってみる

```tsx
// src/app/about/page.tsx
import { useState } from 'react'; // ← これがエラー

export default function AboutPage() {
  const [n, setN] = useState(0);
  return <p>{n}</p>;
}
```

→ どんなエラーが出るか、メッセージを読む。
→ 直し方: ファイル先頭に `"use client"` を追加するか、構造を見直す。

### B. Server から Client に関数を渡す

`FavoriteButton` に `onClick={() => ...}` を Server から渡そうとしてみる。
→ "Functions cannot be passed directly to Client Components..." が出ます。

> **エラーメッセージを読む習慣** をつけてください。ググる前に、まずメッセージに目を通す。Next.js のエラーは比較的親切です。

---

## 詰まったら (Q&A)

**Q. "You're importing a component that needs `useState`..." と出る**
A. その Component を Client にする必要があります。先頭に `"use client"` を追加。

**Q. ボタンが反応しない (クリックしても何も起きない)**
A. `"use client"` を書き忘れていないか確認。ない状態でも JSX としてはレンダリングされるが、JS がアタッチされないので反応しません。

**Q. ページ全体が遅い気がする**
A. ルートの `layout.tsx` に `"use client"` を付けていないか確認。配下が全部 Client になります。

**Q. ブラウザのソースを見たら、コードが見える!**
A. ブラウザに送られる = ソースに出る、という前提で考えてください。秘密情報 (APIキーなど) は **Server Component の中だけ** で使うこと。

---

## チェックリスト

- [ ] Server Component と Client Component の違いを口で言える
- [ ] `"use client"` を書く位置 (ファイル冒頭) がわかる
- [ ] 「伝染する」 = import される側まで Client になる、を理解した
- [ ] Server から Client に関数は渡せない、を覚えた
- [ ] Client の中に Server を入れたいときは `children` 経由、を知っている

---

## 次の章へ

[04-data-fetching.md](04-data-fetching.md) では、Server Component で実際にデータを取得する方法を学びます。
ここまで分かっていれば「Server だから async で fetch できる」が自然に納得できるはずです。
