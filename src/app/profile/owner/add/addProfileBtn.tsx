"use client";

import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function AddProfileBtn({ children }: Props) {
  const [state, setState] = useState(false);
  return (
    <>
      <button
        onClick={() => setState(true)}
        className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-sm font-medium shadow-md hover:shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
      >
        追加
      </button>

      {state && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setState(false)}
          />
          <div className="relative w-full max-w-sm mx-4 p-6 rounded-2xl bg-white shadow-2xl animate-[fadeSlideUp_0.25s_ease-out]">
            <button
              onClick={() => setState(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ✕
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
