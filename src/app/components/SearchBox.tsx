"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/posts?q=${encodeURIComponent(q)}`);
      }}
    >
      <label>
        キーワード
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="検索..."
        />
      </label>
      <button type="submit">検索</button>
    </form>
  );
}
