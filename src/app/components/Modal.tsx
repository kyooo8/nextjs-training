"use client";

import { useState } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!open)}>{open ? "閉じる" : "開く"}</button>
      {open && <div className="modal">{children}</div>}
    </>
  );
}
