"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { profilesTable } from "@/db/schema";
import { saveReaction } from "./actions";

type Profile = typeof profilesTable.$inferSelect;

const THRESHOLD = 100;

export function SwipeDeck({ profiles }: { profiles: Profile[] }) {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const current = profiles[index];
  const next = profiles[index + 1];

  if (!current) {
    return (
      <div className="flex items-center justify-center h-[500px] text-gray-400">
        プロフィールがありません
      </div>
    );
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handlePointerUp = async () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(offset.x) > THRESHOLD) {
      const liked = offset.x > 0;
      setIsLeaving(true);
      setOffset({ x: liked ? 600 : -600, y: offset.y });

      if (liked) await saveReaction(current.id);

      setTimeout(() => {
        setIndex((i) => i + 1);
        setOffset({ x: 0, y: 0 });
        setIsLeaving(false);
      }, 300);
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const rotation = offset.x * 0.08;
  const liked = offset.x > THRESHOLD;
  const disliked = offset.x < -THRESHOLD;

  return (
    <div className="relative flex items-center justify-center h-[680px]">
      <p className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 text-red-400 font-bold text-sm pr-3">← なし</p>
      <p className="absolute right-0 translate-x-full top-1/2 -translate-y-1/2 text-green-500 font-bold text-sm pl-3">いいね →</p>

      {next && (
        <div className="absolute w-72 rounded-3xl bg-white border border-gray-200 shadow-lg overflow-hidden scale-95 opacity-60">
          <Image
            src={`/images/${next.img_url}`}
            width={288}
            height={400}
            className="object-cover w-full h-96"
            alt={next.name}
          />
          <div className="p-4">
            <p className="font-bold text-gray-800">{next.name}</p>
            <p className="text-sm text-gray-500">{next.age}歳</p>
          </div>
        </div>
      )}

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          transform: `translateX(${offset.x}px) translateY(${offset.y}px) rotate(${rotation}deg)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        className="absolute w-72 rounded-3xl bg-white border border-gray-200 shadow-xl overflow-hidden select-none"
      >
        <div className="relative">
          <Image
            src={`/images/${current.img_url}`}
            width={288}
            height={400}
            className="object-cover w-full h-96 pointer-events-none"
            alt={current.name}
          />
          {liked && (
            <div className="absolute top-4 left-4 border-4 border-green-400 text-green-400 font-bold text-2xl px-3 py-1 rounded-xl rotate-[-20deg]">
              いいね
            </div>
          )}
          {disliked && (
            <div className="absolute top-4 right-4 border-4 border-red-400 text-red-400 font-bold text-2xl px-3 py-1 rounded-xl rotate-[20deg]">
              なし
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="font-bold text-gray-800">{current.name}</p>
          <p className="text-sm text-gray-500">{current.age}歳</p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {current.introduction}
          </p>
        </div>
      </div>
    </div>
  );
}
