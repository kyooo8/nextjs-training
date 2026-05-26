"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="flex bg-white">
      <button className="bg-blue-300  mx-4" onClick={() => router.back()}>
        戻る
      </button>
      <Link className="mx-4" href="/profile">
        プロフィール
      </Link>
      <Link className="mx-4" href="/">
        一覧
      </Link>
    </header>
  );
}
