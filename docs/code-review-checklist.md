# コードレビュー観点表 (Next.js 研修 / ハッカソン用)

このチェックリストは、AI レビュー (`/review-nextjs`) と、受講者のセルフレビュー / ピアレビューの両方で使えます。
**「全部 ◎ にする」 ことは目指しません**。Must の項目を満たし、Should をできるだけ守る、を目標に。

## 重要度の凡例

- **Must** — 守れていないとそもそも壊れている / セキュリティ事故になる
- **Should** — 守るべき。違反していたら指摘して修正する
- **Nice to have** — 余裕があれば。研修中は深追いしなくてもよい

---

## 1. Next.js 16 の現行 API を使えているか (Must)

学習データが古い AI / ブログ記事の影響で、**旧 API のまま書かれていないか** をチェック。

| Bad ❌ | Good ✅ |
|--------|---------|
| `params.id` を直接読む | `const { id } = await params;` |
| `searchParams.q` を直接読む | `const { q } = await searchParams;` |
| 書き込み後に `revalidatePath` だけ | `updateTag('posts')` を使う (読み込み側に `cacheTag` 必須) |
| `fetch(url, { next: { revalidate: 60 } })` | `'use cache'` + `cacheLife('hours')` |
| `unstable_cache` / `unstable_noStore` | `'use cache'` ディレクティブ |

参照: [01章](../lectures/01-what-is-nextjs.md), [06章](../lectures/06-rendering-cache.md)

---

## 2. Server / Client の境界が適切か (Must)

App Router の核。境界の置き場所を間違えると、パフォーマンス / セキュリティ / バンドルサイズに直撃する。

| Bad ❌ | Good ✅ |
|--------|---------|
| `src/app/layout.tsx` に `"use client"` を書く | ルート layout は Server のまま、Client は葉っぱ側で |
| Server から Client に関数 (`onClick` など) を props で渡す | Client 側でハンドラを定義 / Server Action を渡す |
| Server Component で `useState` / `useEffect` | Client Component に切り出す |
| Client Component を `async function` で書く | Client は async にできない、`use` フックを使う |
| Server Component に `"use client"` を「念のため」 付ける | 必要なときだけ付ける (バンドルが膨れる) |

参照: [03章](../lectures/03-server-client.md)

---

## 3. データ取得の置き場所 (Should)

「コロケーション」 を守れているか。

| Bad ❌ | Good ✅ |
|--------|---------|
| Server で取れるデータを `useEffect + fetch` でクライアント取得 | Server Component で `await fetch(...)` |
| 取得結果を上から下に props でバケツリレー | 欲しい場所で `await fetch` する (コロケーション) |
| API キーや DB 接続文字列を Client に props で渡している | Server Component の中だけで使う |
| Client から Route Handler を叩いてページ表示用データを取る | Server Component で直接取る (Route Handler は Webhook / 外部公開用) |

参照: [04章](../lectures/04-data-fetching.md)

---

## 4. キャッシュの整合性 (Must)

書き込み → 反映のチェーンが切れていないか。これが切れているとユーザーから見て「壊れている」 状態。

- [ ] **Server Action の最後で `updateTag` (または `revalidateTag` / `revalidatePath`) を呼んでいる**
- [ ] **読み込み側 (Server Component / cached 関数) に対応する `cacheTag` が付いている**
- [ ] **動的データ (cookies / headers / searchParams / params 等) が `<Suspense>` で囲われている** (Cache Components 有効時)
- [ ] **動的データを page の上で `await` していない** (ある場合は末端コンポーネントに押し込む)
- [ ] **`'use cache'` の中で `cookies()` / `headers()` を直接呼んでいない** (引数として渡す)

参照: [05章](../lectures/05-server-actions.md), [06章](../lectures/06-rendering-cache.md)

---

## 5. TypeScript の最低ライン (Should)

| Bad ❌ | Good ✅ |
|--------|---------|
| Props 型を書かず `function Comp(props)` | `function Comp({ id }: { id: string })` |
| `any` を使う | 具体的な型 / `unknown` |
| `as` でキャストして型エラーを握りつぶす | 型ガード / バリデーション |
| `formData.get('title') as string` (null チェックなし) | `String(formData.get('title') ?? '')` |

`any` 全面禁止ではないが、**安易な `any` には必ず指摘**。

---

## 6. セキュリティ (Must)

| Bad ❌ | Good ✅ |
|--------|---------|
| `dangerouslySetInnerHTML` でユーザー入力を表示 | サニタイズ (DOMPurify) / そもそも使わない |
| 文字列連結で SQL を組む (Prisma raw query 含む) | パラメータバインディング / ORM の標準API |
| 秘密情報を `NEXT_PUBLIC_*` 環境変数に置く | 通常の環境変数 (Server Component でだけ参照) |
| Server Action でユーザー入力をバリデーションせず DB へ | 長さ / 型 / 形式チェック (zod 推奨、簡易なら if) |
| 認可チェックなしで Server Action から DB を更新 | Action の冒頭でセッション / 権限を確認 |

---

## 7. アクセシビリティの最低ライン (Should)

「凝った A11y」 は目指さず、**初心者がやりがちな見落とし** だけ拾う。

| Bad ❌ | Good ✅ |
|--------|---------|
| `<div onClick={...}>` をボタンとして使う | `<button onClick={...}>` |
| `<img src="...">` に `alt` 属性なし | `alt="説明"` (装飾なら `alt=""`) |
| `<input>` に対応する `<label>` がない | `<label>` で囲うか `htmlFor` で関連付け |
| ボタン文言が「ここをクリック」 のような曖昧 | 「投稿する」 「削除する」 など具体的に |

---

## 8. テストが1つあるか (Must)

ハッカソン必須要件。

- [ ] **Vitest または Playwright のテストが少なくとも1つ存在し、緑になる**
- [ ] テスト内容が「とりあえず assert true」 ではなく、何かしらの実体を検証している

参照: [07章](../lectures/07-test-debug.md)

---

## 9. その他のコード品質 (Nice to have)

研修なので深追い不要。気付いたら一言だけ:

- 不要な `console.log` が残っていないか
- マジックナンバー (`if (x > 86400)`) に名前が付いているか
- 同じ処理がコピペで何箇所にも散らばっていないか
- ファイル名が `kebab-case` で統一されているか
- import 順がぐちゃぐちゃでないか (ESLint 任せでOK)

---

## レビュー結果の出力形式 (AI 向け)

`/review-nextjs` で出力するときは、**この形式** で書く。
そのまま提出物に貼れるようにする。

```markdown
# AI レビュー結果 — <ブランチ名 or PR タイトル>

## 概要
- 変更行数: ○○行
- レビュー対象ファイル数: ○○ファイル
- Must 違反: ○件 / Should 違反: ○件 / Nice to have: ○件

## Must (必ず直す)

### M-1: <観点番号-連番> Server Component で useState を使っている
- ファイル: src/app/dashboard/page.tsx:12
- 該当コード:
  ```tsx
  const [count, setCount] = useState(0);
  ```
- 何がまずいか: Server Component はサーバーで1回実行されるだけなので state を持てない。
- 修正案: `"use client"` を付けるか、ボタン部分だけ Client Component に切り出す。

## Should (時間があれば直す)

### S-1: ...

## Nice to have

### N-1: ...

## 良かった点 (褒める / 学習に効く)
- ...

## 総評
2〜3文で、全体としてどうだったか
```
