"use client";

import { useActionState, useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { addProfile, AddState } from "../actions";

type Props = {
  defaultName?: string;
  defaultAge?: number;
};

const initialState: AddState = { ok: true };

export function AddProfile({ defaultName, defaultAge }: Props) {
  const [open, setOpen] = useState(false);
  const [state, actionAdd, isPending] = useActionState(addProfile, initialState);
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
        className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-sm font-medium shadow-md hover:shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
      >
        追加
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm mx-4 p-6 rounded-2xl bg-white shadow-2xl animate-[fadeSlideUp_0.25s_ease-out]">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            <p className="text-sm font-semibold text-gray-700 mb-4">プロフィール追加</p>
            <form action={actionAdd} className="flex flex-col gap-3">
              <input type="text" name="id" hidden />
              <input type="text" name="name" placeholder="名前" defaultValue={defaultName}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition" />
              {state.error?.name && <p className="text-xs text-red-500">{state.error.name}</p>}

              <input type="text" name="age" placeholder="年齢" defaultValue={defaultAge}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition" />
              {state.error?.age && <p className="text-xs text-red-500">{state.error.age}</p>}

              <input type="text" name="introduction" placeholder="自己紹介"
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition" />
              {state.error?.introduction && <p className="text-xs text-red-500">{state.error.introduction}</p>}

              <input type="file" name="img_file" accept="image/*" onChange={handleFile}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-white/70 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition" />
              {state.error?.img_url && <p className="text-xs text-red-500">{state.error.img_url}</p>}
              {preview && (
                <div className="rounded-xl overflow-hidden mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} className="object-cover w-full rounded-xl" alt="プレビュー" />
                </div>
              )}

              <button type="submit" disabled={isPending}
                className="mt-1 px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-sm font-medium shadow hover:shadow-md hover:from-pink-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50">
                {isPending ? "追加中..." : "追加"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
