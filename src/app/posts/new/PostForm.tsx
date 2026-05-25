"use client";

import { useActionState } from "react";
import { createPost, type State } from "../actions";

const initialState: State = { ok: true };

export default function PostForm() {
  const [state, formAction] = useActionState(createPost, initialState);

  return (
    <form action={formAction}>
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      <label>
        タイトル
        <input name="title" placeholder="タイトル" />
      </label>
      <label>
        本文
        <input name="body" placeholder="本文" />
      </label>
      <button type="submit">送信</button>
    </form>
  );
}
