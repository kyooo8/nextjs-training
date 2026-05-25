"use client";

import { useState } from "react";

export default function FavoriteButton() {
  const [isFav, setIsFav] = useState(false);
  return (
    <button onClick={() => setIsFav(!isFav)}>
      {isFav ? "* お気に入り済み" : "- お気に入り追加"}
    </button>
  );
}
