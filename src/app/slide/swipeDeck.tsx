"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { profilesTable } from "@/db/schema";
import { saveReaction } from "./actions";

type Profile = typeof profilesTable.$inferSelect;

const THRESHOLD = 100;

function SwipeCard({
  profile,
  onSwipe,
}: {
  profile: Profile;
  onSwipe: (liked: boolean) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const likeOpacity = useTransform(x, [0, THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-THRESHOLD, 0], [1, 0]);

  const handleDragEnd = async (_: unknown, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > THRESHOLD) {
      const liked = info.offset.x > 0;
      await animate(x, liked ? 600 : -600, { duration: 0.3 });
      onSwipe(liked);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate }}
      onDragEnd={handleDragEnd}
      className="absolute w-72 rounded-3xl bg-white border border-gray-200 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative">
        <Image
          src={`/images/${profile.img_url}`}
          width={288}
          height={400}
          className="object-cover w-full h-96 pointer-events-none"
          alt={profile.name}
        />
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-4 left-4 border-4 border-green-400 text-green-400 font-bold text-2xl px-3 py-1 rounded-xl -rotate-12"
        >
          いいね
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-4 right-4 border-4 border-red-400 text-red-400 font-bold text-2xl px-3 py-1 rounded-xl rotate-12"
        >
          なし
        </motion.div>
      </div>
      <div className="p-4">
        <p className="font-bold text-gray-800">{profile.name}</p>
        <p className="text-sm text-gray-500">{profile.age}歳</p>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{profile.introduction}</p>
      </div>
    </motion.div>
  );
}

export function SwipeDeck({ profiles }: { profiles: Profile[] }) {
  const [index, setIndex] = useState(0);

  const current = profiles[index];
  const next = profiles[index + 1];

  const handleSwipe = async (liked: boolean) => {
    if (liked) await saveReaction(current.id);
    setIndex((i) => i + 1);
  };

  if (!current) {
    return (
      <div className="flex items-center justify-center h-[680px] text-gray-400">
        プロフィールがありません
      </div>
    );
  }

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

      <SwipeCard key={index} profile={current} onSwipe={handleSwipe} />
    </div>
  );
}
