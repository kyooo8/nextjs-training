# 05. Server Actions でデータを更新する

## この章のゴール

- Server Action でフォーム送信を実装できる
- `"use server"` の付け方 (2パターン) を理解する
- 書き込み後に画面を更新する (`revalidatePath`) を使える
- バリデーションと、画面へのエラー表示を書ける

---

## この章で出てくる用語

| 用語 | ざっくり |
|------|---------|
| **Server Action** | サーバーで実行される関数を、クライアントから呼べる仕組み |
| **`"use server"`** | 「この関数はサーバーで実行される」 と宣言する1行 |
| **`revalidatePath`** | 指定したパスのキャッシュを破棄して再生成させる関数 |
| **`useActionState`** | Server Action の結果をフォーム上に表示するためのフック |

詳しくは [glossary.md](glossary.md)。

---

## Server Action とは

「サーバー側でだけ実行される関数」を作って、フォームの `action` 属性に渡したり、Client Component から `import` して呼んだりできる仕組みです。

普通のフォーム送信:

```
[ブラウザ] <form action="/api/posts" method="POST">
        ↓
[ブラウザ] HTTPリクエストを組み立てて送信
        ↓
[サーバー] Route Handler でリクエスト受け取り、解釈、DB書き込み、レスポンス
        ↓
[ブラウザ] レスポンスに応じて画面更新
```

Server Action:

```
[ブラウザ] <form action={createPost}>      ← 関数を直接渡せる!
        ↓
[Next.js] 自動でHTTP通信を作って実行
        ↓
[サーバー] createPost を実行
```

中身は HTTP 通信ですが、書き手にはほぼ見えません。「サーバーの関数を呼んでるだけ」に見える、ということ。

---

## `"use server"` の2つの書き方

### 方法1: ファイルの先頭に書く (おすすめ)

```ts
// src/app/posts/actions.ts
"use server";

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  console.log('タイトル:', title);
  // ... DB に保存など
}
```

ファイルの最上部に `"use server"` を1行書けば、そのファイルのexport 関数すべてがServer Actionとして扱われます。
Clientからもimportできるので、Client Component から呼ぶときはこれを使いましょう。

### 方法2: 関数の中に書く (Server Component と同じファイルで完結したいとき)

```tsx
// src/app/posts/new/page.tsx
export default function NewPostPage() {
  async function createPost(formData: FormData) {
    "use server"; // ← 関数の中に書く
    const title = formData.get('title');
    // ... 保存処理
  }
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">送信</button>
    </form>
  );
}
```

複数のActionがあるなら方法1。1ページに1つだけなら方法2でもOK。研修では方法1を基本に。

---

## 最小のフォーム + Server Action

「投稿タイトルを送って、コンソールに出すだけ」の最小例。

```ts
// src/app/posts/actions.ts
"use server";

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  console.log('受け取り:', title);
  // 後で DB 書き込みを足す
}
```

```tsx
// src/app/posts/new/page.tsx
import { createPost } from '../actions';

export default function NewPostPage() {
  return (
    <main>
      <h1>新規投稿</h1>
      <form action={createPost}>
        <input name="title" placeholder="タイトル" required />
        <button type="submit">送信</button>
      </form>
    </main>
  );
}
```

これだけで動きます。フォームを送るとサーバー側のターミナルに `受け取り: ○○` と出るはずです。

ちなみにブラウザのJavaScriptが無効でも動きます。フォームの `action` 属性がちゃんと使われているので、ブラウザの標準動作で送信されるからです。

---

## 書き込み後に画面を更新する: `updateTag`

DBに保存しただけでは、一覧ページのキャッシュが古いまま残っていることがあります。
「このタグが付いたキャッシュを捨てて、次のリクエストで作り直して」と指示するのが `updateTag` です。

Next.js 16 (Cache Components) では、書き込み直後の更新には `updateTag`が推奨されます (旧来の `revalidatePath` でも動きますが、タグベースの方が精密)。

```ts
// src/app/posts/actions.ts
"use server";

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

// 簡易版インメモリ DB (本番では使わないこと)
const posts: { id: number; title: string }[] = [];

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') ?? '');
  if (!title) return;

  posts.push({ id: Date.now(), title });

  updateTag('posts');   // ← 'posts' タグ付きキャッシュを即時破棄
  redirect('/posts');    // ← 一覧へ移動
}

export function getPosts() {
  return posts;
}
```

**ポイント**:
- `updateTag('posts')` を書き込みの後に呼ぶ
- これが効くためには、読み込み側 (`getPosts`) に `cacheTag('posts')` が付いている必要がある
- `redirect('/posts')` で一覧ページに飛ばす (戻ったときに新しい投稿が見える)

> 💡 関数の使い分けまとめ:
> - **`updateTag`**: Server Actions 内、即時破棄 (自分の書き込みを今すぐ反映したい)
> - **`revalidateTag`**: Server Actions と Route Handlers、stale-while-revalidate (少し遅れて反映でもOK)
> - **`revalidatePath`**: パス単位でざっくり破棄 (タグが分からないときの保険)

---

## フォームの入力をバリデーションする

`formData.get(...)` の戻り値は `string | File | null` です。安全に扱うには検証が必須。
シンプルな例:

```ts
"use server";

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();

  if (title.length === 0) {
    return { ok: false, error: 'タイトルは必須です' };
  }
  if (title.length > 100) {
    return { ok: false, error: 'タイトルは100文字以下にしてください' };
  }

  // ... 保存
  return { ok: true };
}
```

> 💡 本格的にやるならzodなどのスキーマバリデーターを使うのが定番ですが、研修では「`if` でチェック」で十分です。

---

## エラーをフォームの上に表示する: `useActionState`

フォーム送信の結果をフォームの上に表示したいとき、`useActionState`(React 19)を使います。
これはClient Componentの機能です。

**Action を変更**: 戻り値の形を決める

```ts
// src/app/posts/actions.ts
"use server";

import { updateTag } from 'next/cache';

export type State = { ok: boolean; error?: string };

export async function createPost(prevState: State, formData: FormData): Promise<State> {
  const title = String(formData.get('title') ?? '').trim();
  if (!title) return { ok: false, error: 'タイトルは必須です' };

  // DBに保存
  // ...

  updateTag('posts');
  return { ok: true };
}
```

**フォームを Client Component に**: `src/app/posts/new/PostForm.tsx`

```tsx
"use client";

import { useActionState } from 'react';
import { createPost, type State } from '../actions';

const initialState: State = { ok: true };

export default function PostForm() {
  const [state, formAction] = useActionState(createPost, initialState);

  return (
    <form action={formAction}>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <input name="title" placeholder="タイトル" />
      <button type="submit">送信</button>
    </form>
  );
}
```

```tsx
// src/app/posts/new/page.tsx
import PostForm from './PostForm';

export default function NewPostPage() {
  return (
    <main>
      <h1>新規投稿</h1>
      <PostForm />
    </main>
  );
}
```

これで、入力が空のときは「タイトルは必須です」と赤字で表示されるようになります。

---

## エラー処理の方針

| 方針 | いつ使う |
|------|---------|
| `throw new Error(...)` | システム的に異常 (DB接続失敗など) → `error.tsx` に飛ぶ |
| `return { ok: false, error: ... }` | ユーザーの入力ミスなど期待される失敗 → フォーム上に表示 |

「想定内のエラーで `throw` しない」 ── これだけ覚えておけばOK。

---

## 削除ボタンもServer Actionで

ボタン1つ = Server Action1つ。次のように書けます。

```tsx
// src/app/posts/[id]/DeleteButton.tsx
import { deletePost } from '../actions';

export default function DeleteButton({ id }: { id: number }) {
  const action = deletePost.bind(null, id); // 引数を固定
  return (
    <form action={action}>
      <button type="submit">削除</button>
    </form>
  );
}
```

```ts
// src/app/posts/actions.ts
"use server";

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deletePost(id: number) {
  // ... DB から削除
  updateTag('posts');
  redirect('/posts');
}
```

> 💡 `action.bind(null, id)` で「ID を埋め込んだ専用関数」を作っています。formData 以外の引数を渡すときの定番。

---

## ハンズオン

### 1. 投稿フォームを Server Action で作る
- `src/app/posts/actions.ts` を作る (`"use server"` + `createPost`)
- `src/app/posts/new/page.tsx` を作る
- 送信したらサーバー側のターミナルに値が出ることを確認

### 2. 投稿を一覧に反映させる
- `actions.ts` にインメモリの配列を持たせて、`createPost` で push
- 一覧 (`/posts`) もこの配列から読むようにする
- `createPost` の最後に `updateTag('posts')` + `redirect('/posts')`
- 一覧側 (`getPosts`) には `'use cache'` + `cacheTag('posts')` を付けておく (06章で詳しく)
- フォーム送信 → 一覧に追加されることを確認

### 3. バリデーションを足す
- 空文字を送ったら `{ ok: false, error: 'タイトルは必須です' }` を返す
- `useActionState` を使って、フォーム上に赤字で表示

### 4. (ストレッチ) 削除ボタン
- 各投稿に「削除」 ボタンを追加
- `action.bind(null, id)` で ID を渡して削除
- 削除後に一覧から消えることを確認

---

## 詰まったら (Q&A)

**Q. "Functions cannot be passed directly to Client Components" と出る**
A. `"use server"` を忘れています。ファイルの最上部に書いてください。

**Q. 送信したのに一覧が更新されない**
A. `updateTag('posts')` を Action の最後に書きましたか? あと、読み込み側に `cacheTag('posts')` が付いていないと、`updateTag` を呼んでも何も破棄されません。 → 06章で詳しく。

**Q. `formData.get('title')` が `null`**
A. `<input name="title">` の `name` 属性が抜けています。`name` は必須。

**Q. `useActionState` のシグネチャがよく分からない**
A. 第1引数 = `(prevState, formData) => newState` の Action、第2引数 = 初期値。`[現在のstate, action] = useActionState(...)` で返ってきます。

**Q. JS 無効でも動くって本当?**
A. はい。フォームの `action` 属性が普通に使われるので、ブラウザ標準のフォーム送信として動きます。ただし `useActionState` を使うとフォームは Client Component になります。

---

## チェックリスト

- [ ] `"use server"` の2つの書き方を知っている
- [ ] フォームの `action` に Server Action を直接渡せる、を体験した
- [ ] `updateTag` / `revalidateTag` / `revalidatePath` の使い分けをざっくり知っている
- [ ] エラーは「想定内 → 戻り値で返す」「異常 → throw」の使い分けを知っている
- [ ] `useActionState` でエラーをフォーム上に表示できる
