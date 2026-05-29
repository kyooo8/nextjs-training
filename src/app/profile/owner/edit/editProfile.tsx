"use client";

import Image from "next/image";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { profilesTable } from "@/db/schema";
import { deleteProfile, editProfile, EditState } from "../actions";

type Props = {
  data: typeof profilesTable.$inferSelect;
};

const initialState: EditState = { ok: true };

export function EditProfile({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [state, actionEdit, isPending] = useActionState(editProfile, initialState);
  const wasPending = useRef(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
  }, []);

  useEffect(() => {
    if (wasPending.current && !isPending && state.ok) setOpen(false);
    wasPending.current = isPending;
  }, [isPending, state.ok]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full px-4 py-1.5 rounded-full bg-white/60 border border-white/80 text-gray-600 text-xs hover:bg-white/90 transition-all duration-200"
      >
        編集
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm mx-4 p-6 rounded-2xl bg-white shadow-2xl animate-[fadeSlideUp_0.25s_ease-out]">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            <p className="text-sm font-semibold text-gray-700 mb-3">プロフィール編集</p>
            <form action={actionEdit} className="flex flex-col gap-2">
              <input type="number" name="id" defaultValue={data.id} hidden />
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
                defaultValue={data.introduction}
                className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
              />
              {state.error?.introduction && <p className="text-xs text-red-500">{state.error.introduction}</p>}

              <input type="hidden" name="current_img_url" value={data.img_url} />
              <input
                type="file"
                name="img_file"
                accept="image/*"
                onChange={handleFile}
                className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-purple-300 transition"
              />
              {state.error?.img_url && <p className="text-xs text-red-500">{state.error.img_url}</p>}

              <div className="rounded-xl overflow-hidden mt-1">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} className="object-cover w-full rounded-xl" alt="プレビュー" />
                ) : (
                  <Image
                    src={`/api/image?url=${encodeURIComponent(data.img_url)}`}
                    height={120}
                    width={120}
                    className="object-cover w-full"
                    alt="image"
                  />
                )}
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="mt-1 px-6 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-medium shadow hover:shadow-md hover:from-purple-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-50"
              >
                {isPending ? "編集中..." : "編集"}
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
        </div>,
        document.body
      )}
    </>
  );
}
