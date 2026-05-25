# 用語集 (Glossary)

各章から参照される用語のまとめです。
講義中・演習中に「これ何だっけ?」となったら戻ってくる辞書として使ってください。

> 五十音 + アルファベット混在で並べています。`Ctrl + F` (検索) で探すのが速いです。

---

## A〜Z

### App Router
Next.js のルーティング方式。`app/` フォルダ配下にファイルを置いて URL を作る。
**この研修で扱うのはこちら**。

### Client Component
**ブラウザで実行されるコンポーネント**。ファイル冒頭に `"use client"` と書く。
`useState` / `useEffect` / `onClick` / ブラウザAPI が使えるが、DB アクセスや APIキー使用はできない。
注意: 初回表示時はサーバーでもレンダリングされる (Hydration のため)。
→ 詳細: [03-server-client.md](03-server-client.md)

### Cache Components
Next.js 16 の現行キャッシュモデル。`next.config.ts` で `cacheComponents: true` にすると有効になる。
**デフォルトで何もキャッシュせず、`'use cache'` を明示的に書いた部分だけがキャッシュされる** のが特徴。
動的データ (cookies / headers / searchParams / params など) は `<Suspense>` で囲うか、`'use cache'` で包む必要がある。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### `cacheLife`
`'use cache'` の中で、キャッシュの寿命を指定する関数。
`'seconds'` / `'minutes'` / `'hours'` / `'days'` / `'weeks'` / `'max'` のプロファイル、または数値オブジェクトで指定。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### `cacheTag`
`'use cache'` の中で、キャッシュにタグを付ける関数。
後で `updateTag` / `revalidateTag` で「このタグが付いたキャッシュをまとめて破棄」 ができるようになる。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### `children`
React コンポーネントのプロップスの1つ。**タグの中身を受け取る**。
レイアウト系コンポーネントで頻出。
```tsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}
<Card>これが children</Card>
```

### コロケーション (Colocation)
**データ取得を「使う場所のすぐそば」に書く** 設計思想。
従来のように「専用の関数で取得 → props で延々と渡す」のではなく、Server Component の中で `await fetch()` する。
→ 詳細: [04-data-fetching.md](04-data-fetching.md)

### `cookies()` / `headers()`
Next.js の関数。リクエストの Cookie や HTTP ヘッダーを読む。
**呼ぶとそのルートが動的になる** ことに注意。
両方とも Promise を返すので `await` 必須。

### Data Cache (旧モデル)
Next.js 14 までのキャッシュ階層の1つ。`fetch` の結果を永続的にキャッシュする層。
**Next.js 16 の Cache Components モデルでは廃止** され、代わりに `'use cache'` ディレクティブを使う。
古いブログ記事を読むときの参考として記載。

### 動的セグメント (Dynamic Segment)
`[id]` のように **中身が変わる URL 部分**。
フォルダ名を `[名前]` の形にすると、そこに何でもマッチして `params` から取れる。
→ 詳細: [02-routing.md](02-routing.md)

### Dynamic (動的)
レンダリング戦略の1つ。**リクエストのたびに HTML を作る**。
`cookies()` / `searchParams` / `cache: 'no-store'` などを使うと自動でこっちになる。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### Edge Runtime
Next.js のランタイムの1つ (今回の研修では扱いません)。エッジロケーションで動く軽量な実行環境。デフォルトは Node.js ランタイム。

### `error.tsx`
そのルートで例外が投げられたときに表示されるエラーバウンダリ。
**Client Component 必須** (なので `"use client"` が要る)。

### Full Route Cache (旧モデル)
Next.js 14 までのキャッシュ階層の1つ。完成した HTML をまるごとキャッシュする層。
**Next.js 16 の Cache Components モデルでは「Static Shell」 + `'use cache'` でカバー** される形に。

### Hooks (フック)
React の `use〜` で始まる関数。`useState` / `useEffect` などが代表例。
**コンポーネント関数の中** でしか呼べない (= Client Component 限定)。

### Hydration (ハイドレーション)
**サーバーで作った HTML に、ブラウザで JavaScript を「噛ませて」動かす作業**。
これによって、Client Component のボタンがクリックに反応するようになる。
HTML と Client の初回描画が食い違うと "Hydration mismatch" エラーが出る。
→ 詳細: [03-server-client.md](03-server-client.md) / [07-test-debug.md](07-test-debug.md)

### ISR (Incremental Static Regeneration)
「静的だけど、たまに作り直す」 レンダリング方式。
Next.js 16 の Cache Components モデルでは `'use cache'` + `cacheLife('hours')` のような書き方で実現する。
(旧モデルの `fetch(url, { next: { revalidate: 60 } })` 形式は、Cache Components 有効時は非推奨)

### `Link`
`next/link` から import する画面遷移用コンポーネント。
`<a>` の代わりに使うと、ページ全体を再読み込みせず必要な部分だけ差し替える (= 速い)。
→ 詳細: [02-routing.md](02-routing.md)

### `layout.tsx`
**配下のページ全部で共通の枠** を作るファイル。
`children` プロップスを受け取って描画する。ページを切り替えても再レンダリングされない。
→ 詳細: [02-routing.md](02-routing.md)

### `loading.tsx`
データ取得中の表示。内部的に `Suspense` で囲った形になる。
→ 詳細: [04-data-fetching.md](04-data-fetching.md)

### MVP (Minimum Viable Product)
**「これだけ動けば成立する」** 最小機能のセット。
ハッカソンではこれを定義してから着手するのが鉄則。

### `not-found.tsx`
そのルートで存在しないリソースにアクセスされたときの 404 表示。

### OG画像 (Open Graph 画像)
SNSでURL共有したときに見えるサムネ画像。
動的に生成する仕組みも Next.js にある (`opengraph-image.tsx`)。研修では扱いません。

### `page.tsx`
**そのフォルダを URL として公開する** ためのファイル。
これが置かれているフォルダだけが、実際にブラウザでアクセスできる URL になる。
→ 詳細: [01-what-is-nextjs.md](01-what-is-nextjs.md) / [02-routing.md](02-routing.md)

### `params`
動的セグメントから取れる値。`/posts/42` なら `{ id: '42' }`。
**Next.js 15 以降は Promise** なので `await` してから使う。
```tsx
const { id } = await params;
```

### Playwright
**ブラウザ自動操作** の E2E テストツール。
ハッカソンでは「トップページが開く」程度のスモークテストを1本書けば十分。
→ 詳細: [07-test-debug.md](07-test-debug.md)

### props
React コンポーネントの「引数」。
親から子に値を渡す。

### PPR (Partial Prerendering)
**静的シェル + 動的部分のストリーミング** を組み合わせるレンダリング方式。
Cache Components モデルでは、これがデフォルトの動作になる。
`'use cache'` 部分と deterministic な処理は静的シェルへ、動的な部分は `<Suspense>` で囲って後から流す。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### `revalidatePath`
キャッシュを「もう古いから捨てて」と知らせる関数。指定したパス配下のキャッシュをまとめて破棄する。
Cache Components モデルでは、タグベース (`updateTag` / `revalidateTag`) の方が精密で推奨。
パス全体を破棄したいときの保険として残っている。
→ 詳細: [05-server-actions.md](05-server-actions.md) / [06-rendering-cache.md](06-rendering-cache.md)

### `revalidateTag`
指定したタグ (cacheTag で付けたもの) が付いたキャッシュを破棄する関数。
**stale-while-revalidate** 挙動 = 古いキャッシュをそのまま返しつつ、裏で新しいものに更新する。
Server Actions と Route Handlers の両方で使える。
更新が少し遅れても問題ない (ニュース、商品一覧など) 用途向け。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### `updateTag`
指定したタグが付いたキャッシュを **即時破棄** する関数 (Next.js 16 で追加)。
**Server Actions の中だけ** で使える。
「自分が書き込んだ直後に、自分のページでその変更が見える」 = read-your-own-writes が必要な場面で使う。
→ 詳細: [05-server-actions.md](05-server-actions.md) / [06-rendering-cache.md](06-rendering-cache.md)

### Route Handler
`app/api/.../route.ts` の HTTP エンドポイント。
`GET` / `POST` / `PUT` / `DELETE` 関数を export することで、REST API を作れる。
→ 詳細: [04-data-fetching.md](04-data-fetching.md)

### Router Cache
**ブラウザ側に持つ** RSC payload (描画情報) のキャッシュ。
クライアント側ナビゲーション (`<Link>` で遷移) の高速化のために使われる。
Cache Components モデルでは、`x-nextjs-stale-time` ヘッダーで stale time が制御される (デフォルト最低30秒)。

### Static Shell (静的シェル)
ビルド時に作っておくページの "枠" 部分の HTML。
レイアウト、ナビゲーション、`'use cache'` でキャッシュされた部分、`<Suspense>` の fallback などが含まれる。
リクエスト時に CDN から即配信できる = 体感速度が速い。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### RSC (React Server Components)
React 19 の機能で、**サーバー側で実行される** コンポーネント。
App Router の Server Component はこれを利用している。

### `searchParams`
URL のクエリ文字列 (`?q=foo`) を読む props。
**Next.js 15 以降は Promise** なので `await` してから使う。
→ 詳細: [04-data-fetching.md](04-data-fetching.md)

### Server Action
**サーバーで実行される関数を、クライアントから呼べる** 仕組み。
`"use server"` を付けて宣言する。フォームの `action` に直接渡せる。
→ 詳細: [05-server-actions.md](05-server-actions.md)

### Server Component
**サーバーで実行されるコンポーネント**。App Router のデフォルトはこっち。
`async` で書け、DB / APIキー / `fetch` を直接使える。`useState` などは使えない。
→ 詳細: [03-server-client.md](03-server-client.md)

### シリアライズ (Serialize)
**データを「文字列にして送れる形」に変換すること**。
Server から Client に props を渡すときに、関数やクラスインスタンスはシリアライズできないので渡せない。

### Static (静的)
レンダリング戦略の1つ。**ビルド時 or 最初のリクエストで HTML を作って使い回す**。
速い・安いが、リアルタイム性はない。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### Streaming
レンダリングしながら、できた部分から順次ブラウザに送る方式。
`Suspense` 境界 + `loading.tsx` で実現する。

### `Suspense`
React の機能。**「ここの部分は後から届くかも」を示す境界**。
中の非同期処理を待っている間、`fallback` が表示される。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### Tailwind CSS
ユーティリティクラスベースの CSS フレームワーク。
`className="flex items-center gap-2"` のような書き方で素早くスタイリングできる。
研修のスターターに含まれている。

### `useActionState`
React 19 のフック。Server Action の結果をフォーム上に表示するために使う。
旧名: `useFormState`。
→ 詳細: [05-server-actions.md](05-server-actions.md)

### `useEffect`
React のフック。**レンダリング後に何か実行する** ための仕組み。
ブラウザAPIアクセスや購読の開始/解除に使う。Server Component では使えない。

### `useOptimistic`
React 19 のフック。**サーバー応答を待たずに UI を先に更新する** (楽観的更新) ための仕組み。
ハッカソンのストレッチ要件。

### `useState`
React のフック。**コンポーネントが値を覚える** ための仕組み。
値が変わると再レンダリングされる。Server Component では使えない。

### `"use client"`
ファイル冒頭に書くと、そのファイルが **Client Component** として扱われる。
そのファイルから import されるものまで Client になる (= 伝染する)。
→ 詳細: [03-server-client.md](03-server-client.md)

### `"use server"`
**サーバーで実行される関数 (Server Action) を宣言** する1行。
ファイル冒頭か関数内冒頭に書く。
→ 詳細: [05-server-actions.md](05-server-actions.md)

### `'use cache'`
**この関数/コンポーネントの結果をキャッシュして** と Next.js に伝えるディレクティブ (Next.js 16 で安定版)。
ファイル冒頭、コンポーネント冒頭、関数冒頭のいずれでも書ける。
中で `cacheLife()` と `cacheTag()` を呼んで、寿命とタグを指定するのが定型。
Cache Components (`cacheComponents: true`) が有効でないと使えない。
→ 詳細: [06-rendering-cache.md](06-rendering-cache.md)

### Vitest
**軽量で速いテストランナー**。Next.js 16 では公式推奨に近い扱い。
研修ではこれを使う。
→ 詳細: [07-test-debug.md](07-test-debug.md)

### zod
TypeScript で書く **スキーマバリデーションライブラリ**。
Server Action の入力検証に使うのが定番だが、研修では必須ではない。
