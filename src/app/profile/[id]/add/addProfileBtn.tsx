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
        onClick={() => setState(!state)}
        className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-sm font-medium shadow-md hover:shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
      >
        {state ? "閉じる" : "開く"}
      </button>
      {state && (
        <div className="mt-4 p-6 rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 shadow-lg">
          {children}
        </div>
      )}
    </>
  );
}
