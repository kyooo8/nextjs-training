"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex items-center gap-2 px-6 py-4 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-sm">
      <button
        className="px-4 py-1.5 rounded-full bg-white/50 text-gray-600 text-sm hover:bg-white/80 transition-all duration-200"
        onClick={() => router.back()}
      >
        ← 戻る
      </button>
      <Link
        className="px-4 py-1.5 rounded-full text-gray-700 text-sm hover:bg-white/50 transition-all duration-200"
        href="/profile/owner"
      >
        プロフィール
      </Link>
      <Link
        className="px-4 py-1.5 rounded-full text-gray-700 text-sm hover:bg-white/50 transition-all duration-200"
        href="/"
      >
        一覧
      </Link>
      <Link
        className="px-4 py-1.5 rounded-full text-gray-700 text-sm hover:bg-white/50 transition-all duration-200"
        href="/slide"
      >
        スワイプ
      </Link>
    </header>
  );
}
