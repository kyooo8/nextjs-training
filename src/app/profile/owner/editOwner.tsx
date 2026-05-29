"use client";

import Image from "next/image";
import { useActionState } from "react";
import { ownersTable } from "@/db/schema";
import { editOwner, OwnerEditState } from "./actions";

type Props = {
  data: typeof ownersTable.$inferSelect;
};

const initialState: OwnerEditState = { ok: true };

export function EditOwner({ data }: Props) {
  const [state, action] = useActionState(editOwner, initialState);

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-3">プロフィール編集</p>
      <form action={action} className="flex flex-col gap-2">
        <input type="hidden" name="current_img_url" value={data.img_url ?? ""} />

        <input
          type="text"
          name="name"
          placeholder="名前"
          defaultValue={data.name}
          className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
        />
        {state.error?.name && <p className="text-xs text-red-500">{state.error.name}</p>}

        <input
          type="text"
          name="age"
          placeholder="年齢"
          defaultValue={data.age}
          className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
        />
        {state.error?.age && <p className="text-xs text-red-500">{state.error.age}</p>}

        <input
          type="text"
          name="introduction"
          placeholder="自己紹介"
          defaultValue={data.introduction ?? ""}
          className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
        />
        {state.error?.introduction && <p className="text-xs text-red-500">{state.error.introduction}</p>}

        <input
          type="file"
          name="img_file"
          accept="image/*"
          className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
        />

        {data.img_url && (
          <div className="rounded-xl overflow-hidden mt-1">
            <Image
              src={`/api/image?url=${encodeURIComponent(data.img_url)}`}
              height={80}
              width={80}
              className="object-cover rounded-xl"
              alt="現在の画像"
            />
          </div>
        )}

        <button
          type="submit"
          className="mt-1 px-6 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-medium shadow hover:shadow-md hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
        >
          保存
        </button>
      </form>
    </div>
  );
}
