"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
};

export function EditProfileBtn({ children }: Props) {
  const [state, setState] = useState(false);
  return (
    <>
      <button
        onClick={() => setState(true)}
        className="w-full px-4 py-1.5 rounded-full bg-white/60 border border-white/80 text-gray-600 text-xs hover:bg-white/90 transition-all duration-200"
      >
        編集
      </button>

      {state && createPortal(
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
        </div>,
        document.body
      )}
    </>
  );
}
