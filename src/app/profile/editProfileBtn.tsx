"use client";

import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function EditProfileBtn({ children }: Props) {
  const [state, setState] = useState(false);
  return (
    <>
      <button
        onClick={() => setState(!state)}
        className="w-full px-4 py-1.5 rounded-full bg-white/60 border border-white/80 text-gray-600 text-xs hover:bg-white/90 transition-all duration-200"
      >
        {state ? "閉じる" : "編集"}
      </button>
      {state && (
        <div className="mt-3 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 shadow-md">
          {children}
        </div>
      )}
    </>
  );
}
