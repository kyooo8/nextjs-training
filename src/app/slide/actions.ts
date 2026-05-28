"use server";

import { db } from "@/lib/drizzle";
import { reactionsTable } from "@/db/schema";

export async function saveReaction(profileId: number): Promise<void> {
  await db.insert(reactionsTable).values({
    owner_id: "1",
    profile_id: profileId,
  });
}
