"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cacheTag } from "next/cache";
import { Post } from "./[id]/page";

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

export type State = { ok: boolean; error?: string };

export async function createPost(
  prevState: State,
  formData: FormData,
): Promise<State> {
  "use server";
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (title.length === 0 || body.length === 0) {
    return { ok: false, error: "タイトルか本文は必須です" };
  }
  if (title.length > 100) {
    return { ok: false, error: "タイトルは100文字以下にしてください" };
  }
  if (body.length > 200) {
    return { ok: false, error: "本文は200文字以下にしてください" };
  }

  posts.push({ id: Date.now(), title, body });

  updateTag("posts");
  return { ok: true };
}

export async function getPosts() {
  "use cache";
  cacheTag("posts");
  return posts;
}

export async function getPostById(id: number): Promise<Post | ""> {
  const post = posts.find((p) => p.id === id);
  return post ?? "";
}

export async function deletePost(id: number) {
  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex !== -1) posts.splice(postIndex, 1);

  updateTag("posts");
  redirect("/posts");
}
