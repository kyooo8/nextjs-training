# 01. そもそも Next.js / App Router とは

## この章のゴール

- Next.js が React の上に何を足しているかを、自分の言葉で説明できる
- App Router の「ファイル = URL」の感覚を持つ
- これから出てくる主要ファイル (`page.tsx` / `layout.tsx` / その他) の役割を知っている

---

## この章で出てくる用語

| 用語 | ざっくり |
|------|---------|
| **App Router** | Next.js の最新のルーティング方式。`app/` フォルダで書く |
| **Pages Router** | 旧来の方式。`pages/` フォルダで書く。**この研修では扱いません** |
| **Server Component** | サーバーで実行されるコンポーネント (詳しくは03章) |
| **Client Component** | ブラウザで実行されるコンポーネント (詳しくは03章) |

詳しい定義は [glossary.md](glossary.md) にまとめています。

---

## Next.js とは何か

React は **コンポーネントを書くためのライブラリ** です。
コンポーネントを画面に表示する、それ自体は React だけでもできます。
ただし、実際に「動く Web アプリ」 を作ろうとすると、React だけでは足りないものが結構あります。

ここでは、Next.js が React に **何を足してくれているのか** を 5つに分けて見ていきます。
(細かい話は後の章で扱うので、ここでは「ふーん、こういう違いがあるんだな」 で OK)

---

### 1. ルーティング (URL とページの対応)

React 単体には、ブラウザの URL を見て表示するコンポーネントを切り替える仕組みがありません。
通常は **`react-router-dom`** のような専用ライブラリを追加して、コード上で対応関係を書きます。

```tsx
// React 単体 + react-router-dom の例
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/posts/:id" element={<PostPage />} />
</Routes>
```

Next.js (App Router) では、**フォルダ構造がそのまま URL** になります。

```
app/
  page.tsx              → /
  posts/[id]/page.tsx   → /posts/任意の値
```

ライブラリの追加もコード上のルート定義も不要。**ファイルを置くだけ**。

---

### 2. サーバー側でデータを取得する

React は本来 **ブラウザで動く** ライブラリです。
そしてブラウザから DB に直接つなぐことはできません (パスワードがバレるのでセキュリティ上ありえない)。

そのため React 単体で「DB に保存したデータを画面に出す」アプリを作るには、

```
[ブラウザ React] ─ fetch('/api/posts') → [サーバー (Express など)] → [DB]
                ← JSON ─
```

のように、**別途サーバーを立てて API を作り、ブラウザから fetch する** 構成になります。

Next.js の Server Component は、**コンポーネント自体がサーバーで動きます**。
だからコンポーネントの中で直接、こんな書き方ができます。

```tsx
// app/posts/page.tsx (Server Component)
export default async function PostsPage() {
  const posts = await prisma.post.findMany(); // DB に直接アクセス!
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

API サーバーを別に立てる必要がない = コードがシンプル = バケツリレーが消える、という嬉しさです。
(詳しくは 03〜04章)

---

### 3. ビルドと開発環境

React で本格的なアプリを作るとき、自分で組まないといけないものは結構たくさんあります。

- TypeScript の設定 (`tsconfig.json`)
- バンドラ (webpack / Vite など) の設定
- 開発サーバー + HMR (ホットリロード) の用意
- 本番ビルドの最適化

最近は Vite などで楽になっていますが、それでも自分で組み合わせる必要があります。

Next.js は **`npm run dev` 一発で全部入り** の状態になります。

- TypeScript はそのまま動く
- Turbopack (高速バンドラ) が同梱されている
- ファイルを保存すると即座にブラウザに反映される
- `npm run build` で本番向けの最適化済みビルドが出る

---

### 4. キャッシュとパフォーマンス

React 自体には、「データやページのキャッシュを管理する仕組み」 はありません。
データ取得をキャッシュしたいなら `TanStack Query` などのライブラリを入れる、
HTML を使い回したいなら静的サイトジェネレーター (例: Gatsby) を別途使う、という感じになります。

Next.js は **デフォルトでいろいろキャッシュ** してくれます。

- 静的なページの HTML を作って使い回す
- 必要なときだけ再生成する

詳しくは 06章で 「地図」 として扱います。今は **「Next.js は勝手にキャッシュする世界なんだな」** とだけ知っておけば OK。

---

### 5. 画像・フォントなどの最適化

React で `<img src="..." />` を書くと、画像はただそのまま表示されるだけです。
表示サイズに合わせたリサイズや、WebP 変換、遅延読み込み (画面に入ったら読む) などは、必要なら自前で組むことになります。

Next.js は専用のコンポーネント / ヘルパーを用意しています。

- `next/image` の `<Image>`: リサイズ・WebP 変換・遅延読み込みを自動でやる
- `next/font`: Google Fonts などを最適化して読み込む

書くだけで自動で最適化されるので、見ためが速いアプリを作りやすい。
(この研修では深入りしません。「あるんだな」 程度で OK)

---

### まとめ

> **一言で**: 「React にルーティング・サーバー実行・ビルド・キャッシュ・最適化を **セットで** 提供してくれるフレームワーク」

---

## App Router の「ファイル = URL」感覚

App Router の一番の特徴は、**フォルダの構造がそのまま URL になる** ことです。

```
app/
├── page.tsx              ← URL: /
├── about/
│   └── page.tsx          ← URL: /about
└── posts/
    ├── page.tsx          ← URL: /posts
    └── [id]/
        └── page.tsx      ← URL: /posts/任意のID (例: /posts/42)
```

ルールはたった2つ:

1. **フォルダの階層 = URL の階層**
2. **`page.tsx` を置いたフォルダだけが、実際の URL として開けるようになる** (置いてないフォルダは中継地点)

> 💡 だから「URLを増やす = `page.tsx` を置いたフォルダを作る」だけです。Express のような `app.get('/path', ...)` の登録は **不要**。

---

## 主要なファイル名 (App Router の "予約語")

App Router では、いくつかのファイル名が **特別な意味** を持ちます。
今すぐ全部覚えなくてOK。「こういう名前が予約されている」とだけ把握。

| ファイル名 | 役割 | 必須? | 使い始める章 |
|-----------|------|-------|-------------|
| `page.tsx` | そのURLで表示されるページ本体 | URLを公開するなら必須 | 02 |
| `layout.tsx` | 配下の全ページで共通の枠 (ヘッダーなど) | ルートに1つ必須 | 02 |
| `loading.tsx` | データ取得中の表示 | 任意 | 04 |
| `error.tsx` | エラー時の表示 | 任意 | 06 |
| `not-found.tsx` | 404 のページ | 任意 | 02 (チラ見せ) |
| `route.ts` | HTTPエンドポイント (REST API用) | 任意 | 04 |

**重要**: これらはすべて **小文字** + **正確なファイル名**。
`Page.tsx` や `pages.tsx` ではダメです (大文字小文字も区別)。

---

## 1ページが画面に出るまでの流れ (図のイメージ)

```
[ブラウザ] GET /posts/42
        ↓
[Next.js サーバー] app/posts/[id]/page.tsx を見つける
        ↓
        params = { id: '42' } を渡して呼び出す
        ↓
        Server Component (デフォルト) でレンダリング
        ↓ (中で fetch や DB アクセスもこの段階)
        HTML を生成して返す
        ↓
[ブラウザ] HTML を表示。必要なら追加のJSも読み込む
```

ポイントは **「サーバーで HTML を組み立ててから返す」** こと。

> 詳しくは 03章 (Server/Client) と 04章 (データ取得) で。

---

## サーバーで動く ≠ サーバーサイドのことを全部やる

App Router では、**コンポーネント自体がサーバーで動く** のがデフォルトです (Server Component)。

```tsx
// app/posts/page.tsx
// async 関数として書ける!
export default async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

これがコンポーネントとして動きます。**API 経由じゃなく、その場で DB やAPIを叩いてHTMLを作る** イメージ。

ただし「ボタンを押したらカウントを増やしたい」みたいな **インタラクション** はサーバーではできない (ブラウザで動かす必要がある) ので、その場合は Client Component を使い分けます。

---

## Pages Router のことは忘れてOK

ネット記事には旧来の Pages Router (`pages/` フォルダ) の解説もたくさんあります。
書き方がそこそこ違うので、混乱の元です。

- **業務でも新規は App Router**
- 公式ドキュメントを読むときは URL に `/docs/app/` が入っているかチェック
- Stack Overflow や Qiita で `getServerSideProps` という単語が出てきたら、**それは Pages Router の話なので無視**

---

## ハンズオン (5分、コードは書かない)

スターターを起動した状態で:

1. ブラウザで `http://localhost:3000` を開く
2. エディタで `src/app/page.tsx` を開いて、表示されている文字をどこかから探す
3. その文字を適当に書き換えて保存する
4. ブラウザに戻り、リロードせずに表示が変わるか確認 (HMR = ホットリロード)

---

## チェックリスト

- [ ] 「フォルダ = URL」「page.tsx を置いたとこだけ実際にアクセスできる」が言える
- [ ] `layout.tsx` / `page.tsx` / `loading.tsx` などが「予約された名前」だと知っている
- [ ] Pages Router の話は当面忘れてよいと理解した
- [ ] スターターで `src/app/page.tsx` を編集 → 画面が変わるのを確認した

---

## 次の章へ

[02-routing.md](02-routing.md) では、いよいよ自分でページを追加していきます。
動的ルート (`/posts/[id]`) や Link での画面遷移も扱います。
