import { Suspense } from "react";
import { cookies } from "next/headers";

export default function DashboadPage() {
  return (
    <main>
      <h1>ダッシュボード</h1>
      <Suspense fallback={<p>読み込み中...</p>}>
        <UserGreeting />
      </Suspense>
    </main>
  );
}

async function UserGreeting() {
  const theme = (await cookies()).get("theme")?.value || "light";
  return <p>あなたのテーマ:{theme}</p>;
}
