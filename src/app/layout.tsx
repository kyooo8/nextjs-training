import { Suspense } from "react";
import Header from "@/app/header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen">
        <Suspense fallback={<div className="w-56 flex-shrink-0" />}>
          <Header />
        </Suspense>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
