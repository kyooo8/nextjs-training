import { db } from "@/lib/drizzle";
import { profilesTable } from "@/db/schema";
import { SwipeDeck } from "./swipeDeck";
import { sql } from "drizzle-orm";
import { Suspense } from "react";

async function SlideContent() {
  const profiles = await db.select().from(profilesTable).orderBy(sql`RANDOM()`);
  return <SwipeDeck profiles={profiles} />;
}

export default function SlidePage() {
  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-xl font-bold text-gray-700 mb-6 text-center">
        スライドいいね
      </h1>
      <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
        <SlideContent />
      </Suspense>
    </div>
  );
}
