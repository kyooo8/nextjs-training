import { cacheLife, cacheTag } from "next/cache";
import { Post } from "../posts/[id]/page";

const posts: Post[] = [
  {
    id: 1,
    title: "Next.js入門",
    body: "Next.jsはReactベースのフレームワークです。",
  },
  {
    id: 2,
    title: "TypeScriptの基礎",
    body: "TypeScriptは静的型付けのJavaScriptです。",
  },
  {
    id: 3,
    title: "Server Componentsとは",
    body: "サーバー側でレンダリングされるReactコンポーネントです。",
  },
  {
    id: 4,
    title: "App Routerの使い方",
    body: "app/ディレクトリ配下にpage.tsxを置くとルートになります。",
  },
  {
    id: 5,
    title: "Server Actionsとは",
    body: "サーバー側で実行される非同期関数です。フォームと組み合わせて使います。",
  },
  {
    id: 6,
    title: "キャッシュの仕組み",
    body: "Next.js 16ではuse cacheディレクティブでキャッシュを制御します。",
  },
  {
    id: 7,
    title: "動的ルートの作り方",
    body: "[id]フォルダを作ることで動的なURLに対応できます。",
  },
  {
    id: 8,
    title: "エラーハンドリング",
    body: "error.tsxを作るとエラー発生時に表示されるUIを定義できます。",
  },
];

export async function getPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  return posts;
}
