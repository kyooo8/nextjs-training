# 01. そもそも Next.js / App Router とは

## この章のゴール

- Next.js が React の上に何を足しているかを、自分の言葉で説明できる
- App Router の「ファイル = URL」の感覚を持つ
- これから出てくる主要ファイル (`page.tsx` / `layout.tsx` / その他) の役割を知っている

---

## この章で出てくる用語

| 用語 | ざっくり |
|------|---------|
| **App Router** | Next.js のルーティング方式。`app/` フォルダで書く |
| **Server Component** | サーバーで実行されるコンポーネント (詳しくは03章) |
| **Client Component** | ブラウザで実行されるコンポーネント (詳しくは03章) |

詳しい定義は [glossary.md](glossary.md) にまとめています。

---

## Next.js とは何か

Reactはコンポーネントを書くためのライブラリです。
しかしReactはViewに特化しており、実際に動くWebアプリを作ろうとするとReactだけでは足りないものが結構あります。

ここでは、Next.jsがReactに何を足してくれているのかを見ていきます。

---

### 1. ルーティング (URL とページの対応)

React単体には、ブラウザのURLを見て表示するコンポーネントを切り替える仕組みがありません。
通常は `react-router-dom`のような専用ライブラリを追加して、コード上で対応関係を書きます。

```tsx
// React 単体 + react-router-dom の例
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/posts/:id" element={<PostPage />} />
</Routes>
```

Next.js(App Router)ではフォルダ構造がそのままURLになります。

```
app/
  page.tsx              → /
  posts/[id]/page.tsx   → /posts/任意の値
```

---

### 2. サーバー側でデータを取得する

React は本来ブラウザで動くライブラリです。
そしてブラウザからDBに直接つなぐことはできません (パスワードがバレるのでセキュリティ上ありえない)。

そのためReact単体でDBに保存したデータを画面に出すには、

```
[ブラウザ React] ─ fetch('/api/posts') → [サーバー (Express など)] → [DB]
                ← JSON ─
```

のように、別途サーバーを立ててAPIを作り、ブラウザからfetchする構成になります。

Next.jsのServer Componentは、コンポーネント自体がサーバーで動きます。
だからコンポーネントの中で直接、こんな書き方ができます。

```tsx
// app/posts/page.tsx (Server Component)
export default async function PostsPage() {
  const posts = await prisma.post.findMany(); // DB に直接アクセス!
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

---

### 3. ビルドと開発環境

React で本格的なアプリを作るとき、自分で組まないといけないものは結構たくさんあります。

- TypeScript の設定 (`tsconfig.json`)
- バンドラ (webpack / Vite など) の設定
- 開発サーバー + HMR (ホットリロード) の用意
- 本番ビルドの最適化

最近はViteなどで楽になっていますが、それでも自分で組み合わせる必要があります。

Next.jsは`npm run dev` 一発で全部入りの状態になります。

- TypeScript はそのまま動く
- Turbopack (高速バンドラ) が同梱されている
- ファイルを保存すると即座にブラウザに反映される
- `npm run build` で本番向けの最適化済みビルドが出る

---

### 4. キャッシュとパフォーマンス

React 自体には、「データやページのキャッシュを管理する仕組み」 はありません。
データ取得をキャッシュしたいなら `TanStack Query` などのライブラリを入れる、
HTML を使い回したいなら静的サイトジェネレーター (例: Gatsby) を別途使う、という感じになります。

Next.jsはデフォルトでいろいろキャッシュしてくれます。

- 静的なページの HTML を作って使い回す
- 必要なときだけ再生成する

詳しくは 06章で「地図」として扱います。

---

### 5. 画像・フォントなどの最適化

Reactで`<img src="..." />`を書くと、画像はただそのまま表示されるだけです。
表示サイズに合わせたリサイズや、WebP変換、遅延読み込み (画面に入ったら読む) などは、必要なら自前で組むことになります。

Next.js は専用のコンポーネント / ヘルパーを用意しています。

- `next/image` の `<Image>`: リサイズ・WebP 変換・遅延読み込みを自動でやる
- `next/font`: Google Fonts などを最適化して読み込む

---

### まとめ

> **一言で**: 「React にルーティング・サーバー実行・ビルド・キャッシュ・最適化を **セットで** 提供してくれるフレームワーク」

---

## ハンズオン

スターターを起動した状態で:

1. ブラウザで `http://localhost:3000` を開く
2. エディタで `src/app/page.tsx` を開いて、表示されている文字をどこかから探す
3. その文字を適当に書き換えて保存する
4. ブラウザに戻り、リロードせずに表示が変わるか確認 (HMR = ホットリロード)

---

## チェックリスト

- [ ] 「フォルダ = URL」「page.tsx を置いたとこだけ実際にアクセスできる」が言える
- [ ] `layout.tsx` / `page.tsx` / `loading.tsx` などが「予約された名前」だと知っている
- [ ] スターターで `src/app/page.tsx` を編集 → 画面が変わるのを確認した
