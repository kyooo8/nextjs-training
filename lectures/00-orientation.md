# 00. オリエンテーション

## この章のゴール

- 5日間の流れと、ゴールが何かを理解する
- 自分の PC で Next.js を動かせる状態になる

---

## なぜ Next.js をやるのか (1分だけ)

会社の Web プロダクトの多くが Next.js (App Router) で書かれています。React だけだとできない、

- ファイルを置くだけでルーティング
- サーバー側で動くコンポーネント (= DB を直接触れる)
- フォーム送信を関数呼び出しっぽく書ける

といった機能を全部担ってくれるのが Next.js です。
**「React + サーバー + ルーティング + ビルド」をまとめて面倒見てくれるフレームワーク** くらいに思ってOK。

---

### スターターを動かす

研修フォルダの直下で:

```bash
npm install      # 1〜2分かかります
npm run dev      # → http://localhost:3000 が立ち上がる
```

ブラウザで `http://localhost:3000` を開いて Next.js のロゴが出れば準備完了。
止めるときは ターミナルで `Ctrl + C`。

---

## React の薄いおさらい

「React 研修やったけど忘れた…」という人向けに、これから使う言葉だけ思い出しておきます。
**全部わかっていれば飛ばしてOK**。1つでも「あれ?」となったら復習しておくと、後がラクです。

### コンポーネント

関数1つ = 部品1つ。JSX (HTMLっぽい記法) を返します。

```tsx
function Hello() {
  return <p>こんにちは</p>;
}
```

### props (プロップス)

部品に渡す「引数」。関数の引数と同じ感覚。

```tsx
function Hello({ name }: { name: string }) {
  return <p>こんにちは, {name}</p>;
}

// 使う側
<Hello name="四条貴音" />
```

### state (ステート)

部品が **覚えておく値**。値が変わると画面が再描画されます。

```tsx
const [count, setCount] = useState(0);
// count を読み、setCount(新しい値) で更新する
```

### children

部品で **タグの中身を受け取る** プロップス。レイアウトを作るときによく使います。

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <div className="border p-4">{children}</div>;
}

<Card>これは中身</Card>
```

### Hooks (フック)

`use〜` で始まる関数。React の機能を取り出す道具。

- `useState` — state を持つ
- `useEffect` — レンダリング後に何かする (DOM 操作・購読など)

> Hooks は **コンポーネント関数の中** でしか呼べません (これだけ覚えておけばOK)。

これらの言葉に「?」が残る人は、 [React 公式チュートリアル](https://ja.react.dev/learn) の最初の数ページに目を通すことをお勧めします。

---

## チェックリスト (次の章に行く前に)

- [ ] `node --version` で v20 以上が表示された
- [ ] `npm run dev` でブラウザに Next.js ロゴが出た
- [ ] `useState` / `props` / `children` の意味を思い出した

全部 ✓ なら、[01-what-is-nextjs.md](01-what-is-nextjs.md) へ進みましょう。

---

## 次の章へ

01章では「そもそも Next.js って何?」と「App Router の全体地図」を見ます。
