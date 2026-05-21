# 07. テストとデバッグの最低ライン

> **講義 30分 + ハンズオン 30分**
> 「完璧なテスト」ではなく、ハッカソンで動かないときに **自分で切り分けられる手段** を渡します。

## この章のゴール

- Vitest + React Testing Library で Client Component を1つテストできる
- Server Component のテスト方針を理解する (主に E2E)
- Hydration mismatch / 境界エラーなど、よくあるエラーの読み方がわかる
- ハッカソン中に詰まったときの「切り分けの順番」を持っている

---

## なぜこの章があるか

ハッカソンで一番怖いのは **「動かない、でも理由がわからない」** 状態です。
完璧なテスト網は要りません。「1つでもテストがある」「エラーを読める」「自分で切り分けられる」を満たせれば、Day 3〜5 を乗り切る武器になります。

---

## この章で出てくる用語

| 用語 | ざっくり |
|------|---------|
| **Vitest** | 軽量で速いテストランナー。Next.js 16 では公式推奨に近い |
| **React Testing Library (RTL)** | コンポーネントを「ユーザー視点」でテストするライブラリ |
| **Playwright** | ブラウザ自動操作の E2E テストツール |
| **Hydration mismatch** | サーバーで出した HTML と、ブラウザでの初回レンダリングが食い違うと出るエラー |

詳しくは [glossary.md](glossary.md)。

---

## テストの3層 (Next.js で現実的なもの)

| 層 | 何をテストする | 使う道具 | 研修での扱い |
|----|--------------|---------|------------|
| ユニット | 純粋関数、Client Component | Vitest + RTL | **必須** 1個書く |
| 統合 | Server Action や Route Handler | Vitest (モック多め) | 余裕があれば |
| E2E | ページの実際の挙動 | Playwright | ストレッチ目標 |

> 💡 「全部書く」を目指さない。**ユニット1個、できれば E2E 1本** で十分。

---

## Vitest をセットアップする

Next.js のプロジェクトに Vitest を入れる最小手順。

### 1. インストール

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

### 2. `vitest.config.ts` を作る

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3. `vitest.setup.ts` を作る

```ts
// vitest.setup.ts
import '@testing-library/jest-dom';
```

### 4. `package.json` にスクリプトを追加

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

---

## ハンズオン1: Client Component に Vitest テストを書く

03章で作った `FavoriteButton` をテストしてみます。

**作るファイル**: `src/app/components/FavoriteButton.test.tsx`

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton', () => {
  it('初期表示は「お気に入りに追加」', () => {
    render(<FavoriteButton />);
    expect(
      screen.getByRole('button', { name: /お気に入りに追加/ })
    ).toBeInTheDocument();
  });

  it('クリックすると「お気に入り済み」に切り替わる', async () => {
    const user = userEvent.setup();
    render(<FavoriteButton />);

    await user.click(screen.getByRole('button'));

    expect(
      screen.getByRole('button', { name: /お気に入り済み/ })
    ).toBeInTheDocument();
  });
});
```

> `userEvent` を別途入れる場合: `npm install -D @testing-library/user-event`

実行:

```bash
npm test
```

緑が出ればOK!

---

## React Testing Library の基本

| やりたいこと | 書き方 |
|------------|-------|
| レンダリング | `render(<Comp />)` |
| 要素を取る (推奨) | `screen.getByRole('button', { name: '送信' })` |
| 要素を取る (テキスト) | `screen.getByText('こんにちは')` |
| クリック | `await user.click(要素)` |
| 入力 | `await user.type(要素, '入力文字')` |
| 存在を確認 | `expect(要素).toBeInTheDocument()` |
| 不在を確認 | `expect(screen.queryByRole(...)).not.toBeInTheDocument()` |

> 💡 `getBy...` は見つからないとエラー、`queryBy...` は見つからないと `null`。「ある」確認なら `getBy`、「ない」確認なら `queryBy`。

---

## Server Component のテスト方針

**Server Component を直接 RTL でテストするのは難しい** です (async + サーバー前提なので)。
現実的には:

1. **ロジックを切り出す** → `lib/posts.ts` などに純粋関数として置く → そっちをテスト
2. **ページ全体の挙動は E2E (Playwright) で** 確認

```ts
// src/lib/posts.ts
export function filterPosts(posts: Post[], q: string) {
  if (!q) return posts;
  return posts.filter((p) => p.title.includes(q));
}
```

```ts
// src/lib/posts.test.ts
import { describe, it, expect } from 'vitest';
import { filterPosts } from './posts';

describe('filterPosts', () => {
  it('空文字なら全件返す', () => {
    const posts = [{ id: 1, title: 'a' }, { id: 2, title: 'b' }];
    expect(filterPosts(posts, '')).toHaveLength(2);
  });
  it('部分一致で絞り込む', () => {
    const posts = [{ id: 1, title: 'hello' }, { id: 2, title: 'world' }];
    expect(filterPosts(posts, 'wor')).toEqual([{ id: 2, title: 'world' }]);
  });
});
```

> 💡 「Server Component の中身は薄く、ロジックは外に切り出す」 が結果的に良い設計になります。

---

## Playwright (スモークテスト) — 余裕があれば

ハッカソンで余裕があれば、トップページが落ちないことだけ確認する E2E を1本書きましょう。

### セットアップ

```bash
npm init playwright@latest
```

途中の質問はデフォルト (TypeScript, `e2e/` フォルダ, etc.) でOK。

### 最初の1本: `e2e/smoke.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('トップページが開ける', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

実行 (別ターミナルで `npm run dev` 起動中に):

```bash
npx playwright test
```

「ホームページが開いて、h1 が見える」 だけのテスト。これだけでも、デプロイ直前に「最低限動くか」を10秒で確認できます。

---

## デバッグ手段一覧

### Hydration mismatch

- **症状**: コンソールに "Hydration failed because the server rendered HTML didn't match the client" と出る
- **よくある原因**:
  - `Date.now()` / `Math.random()` を JSX に直接書いた
  - `localStorage` を SSR 中に読もうとした
  - HTML的に不正なネスト (`<p>` の中に `<div>` など)
- **対処**:
  - 該当部分を Client Component にして `useEffect` で扱う
  - HTML の構造を見直す

### Server / Client 境界エラー

- "You're importing a component that needs `useState`..." → `"use client"` を追加
- "Functions cannot be passed directly to Client Components" → 関数渡しをやめるか Server Action にする
- **エラーメッセージは比較的親切**。まず読んでから検索する習慣を

### キャッシュ起因で更新されない

→ 06章の切り分け手順を参照

### Next.js のデバッグ便利機能

- `next dev` 中、ブラウザのコンソールエラーが **ターミナルにも転送** される (Next.js 16の新機能)
- React DevTools のブラウザ拡張を入れておくと、コンポーネント階層が見える
- `console.log` は Server Component なら **ターミナル**、Client Component なら **ブラウザのコンソール** に出る

---

## 詰まったときの切り分け手順 (重要)

ハッカソン中、「動かない!」となったら **この順番** で確認してください。

1. **ブラウザのコンソールにエラー出ていない?** → 出ていたら読む
2. **ターミナルにエラー出ていない?** → 出ていたら読む
3. **エラーが無いけど期待通り動かない**:
   - `console.log` を入れて値を見る
   - 「Server で動いてる? Client で動いてる?」 を確認 (どちらに log が出るか)
4. **画面が更新されない**:
   - 06章の手順
5. **何も分からない**:
   - **5分悩んだら聞く!**

---

## ハンズオン (30分)

### 1. Vitest セットアップ
- 上のコマンドで Vitest 一式入れる
- `vitest.config.ts` / `vitest.setup.ts` を作る

### 2. Client Component のテストを1つ
- `FavoriteButton` のテスト (サンプルそのまま) を書く
- `npm test` で緑になることを確認

### 3. ロジック関数のテストを1つ
- 04章の `filterPosts` のような純粋関数を作って、テストを書く

### 4. (発展) Playwright で1本
- `npm init playwright@latest`
- トップページが開ける、を1つテストする

### 5. (発展) 意図的に Hydration mismatch を起こす
- どこかに `<p>今: {new Date().toISOString()}</p>` を Server Component で書く
- ブラウザのコンソールでエラーを読む
- Client Component + `useEffect` で正しく直す

---

## 詰まったら (Q&A)

**Q. テストが落ちる、現在の DOM が見たい**
A. `screen.debug()` を呼ぶと、その時点の DOM が出力されます。

**Q. E2E が flaky (たまに落ちる)**
A. `await expect(...).toBeVisible()` で待つこと。即座にチェックすると、まだ要素が出ていないことがある。

**Q. `vi.mock()` が効かない**
A. ファイルの上部 (import 文と同じ階層) で呼ぶこと。 関数の中に書くと巻き上げが効かない。

**Q. テスト書く時間ない!**
A. 必須は1つだけです (`FavoriteButton` のテストでも、純粋関数のテストでもOK)。完璧主義より「1つ存在する」が大事。

---

## チェックリスト

- [ ] Vitest を入れて、Client Component のテストが緑になる
- [ ] Server Component のテスト方針 (ロジック切り出し + E2E) を理解した
- [ ] Hydration mismatch の典型原因を3つ言える
- [ ] 「動かないとき」 の切り分け手順 (1〜5) を覚えた

---

## 次の章へ

[08-hackathon-prep.md](08-hackathon-prep.md) ── いよいよハッカソンです。
お題決めと、3日で完成させるためのコツを話します。
