"use client";

import { useActionState } from "react";
import { addProfile, AddState } from "../../actions";

const initialState: AddState = { ok: true };

export function AddProfile() {
  const [state, actionAdd] = useActionState(addProfile, initialState);
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-4">
        プロフィール追加
      </p>
      <form action={actionAdd} className="flex flex-col gap-3">
        <input type="text" name="id" hidden />
        <input
          type="text"
          name="name"
          placeholder="名前"
          className="w-full px-4 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
        />
        {state.error?.name && <p>{state.error.name}</p>}

        <input
          type="text"
          name="age"
          placeholder="年齢"
          className="w-full px-4 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
        />
        {state.error?.age && <p>{state.error.age}</p>}

        <input
          type="text"
          name="introduction"
          placeholder="自己紹介"
          className="w-full px-4 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
        />
        {state.error?.introduction && <p>{state.error.introduction}</p>}

        <input
          type="text"
          name="img_url"
          placeholder="画像ファイル名"
          className="w-full px-4 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
        />
        {state.error?.img_url && <p>{state.error.img_url}</p>}

        <button
          type="submit"
          className="mt-1 px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-sm font-medium shadow hover:shadow-md hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
        >
          追加
        </button>
      </form>
    </div>
  );
}
