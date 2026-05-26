import Header from "@/app/header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-mist-300 w-full ">
        <Header />
        {children}
      </body>
    </html>
  );
}
