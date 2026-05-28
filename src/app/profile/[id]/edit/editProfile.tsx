"use client";

import Image from "next/image";
import { profilesTable } from "../../../db/schema";
import { deleteProfile, editProfile, EditState } from "../../actions";
import { useActionState } from "react";

type Props = {
  data: typeof profilesTable.$inferSelect;
};

const initialState: EditState = { ok: true };

export function EditProfile({ data }: Props) {
  const [state, actionEdit] = useActionState(editProfile, initialState);

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-3">
        プロフィール編集
      </p>
      <form action={actionEdit} className="flex flex-col gap-2">
        <input type="number" name="id" defaultValue={data.id} hidden />
        <input
          type="text"
          name="name"
          placeholder="名前"
          defaultValue={data.name}
          className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
        />
        {state.error?.name && <p>{state.error.name}</p>}

        <input
          type="text"
          name="age"
          placeholder="年齢"
          defaultValue={data.age}
          className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
        />
        {state.error?.age && <p>{state.error.age}</p>}

        <input
          type="text"
          name="introduction"
          placeholder="自己紹介"
          defaultValue={data.introduction}
          className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
        />
        {state.error?.introduction && <p>{state.error.introduction}</p>}

        <input
          type="text"
          name="img_url"
          placeholder="画像ファイル名"
          defaultValue={data.img_url}
          className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
        />
        {state.error?.img_url && <p>{state.error.img_url}</p>}

        <div className="rounded-xl overflow-hidden mt-1">
          <Image
            src={`/images/${data.img_url}`}
            height={120}
            width={120}
            className="object-cover w-full"
            alt="image"
          />
        </div>
        <button
          type="submit"
          className="mt-1 px-6 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-medium shadow hover:shadow-md hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
        >
          編集
        </button>
      </form>
      <form action={deleteProfile}>
        <input type="text" name="id" defaultValue={data.id} hidden />
        <button
          type="submit"
          className="mt-1 px-6 py-2 rounded-full bg-gradient-to-r from-purple-400 to-red-400 text-white text-sm font-medium shadow hover:shadow-md hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
        >
          削除
        </button>
      </form>
    </div>
  );
}
