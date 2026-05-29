"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "一覧" },
  { href: "/slide", label: "スワイプ" },
  { href: "/profile/owner", label: "プロフィール" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 h-screen w-56 flex-shrink-0 flex flex-col gap-2 px-4 py-8 bg-white/30 backdrop-blur-md border-r border-white/40 shadow-sm">
      <p className="px-4 mb-4 text-lg font-bold text-gray-700">❤ Match</p>
      {links.map(({ href, label }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
              isActive
                ? "bg-white/60 text-purple-600 font-semibold"
                : "text-gray-700 hover:bg-white/60"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </header>
  );
}
