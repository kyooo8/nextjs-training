import Header from "@/app/header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="w-full min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
