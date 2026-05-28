import { ProfileCard } from "./profileCard";
import { db } from "../../lib/drizzlezle";
import { profilesTable } from "../../db/schema";
import { cacheTag } from "next/cache";

export async function ProfileList() {
  "use cache";
  cacheTag("profile");

  const profiles = await db.select().from(profilesTable);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {profiles.map((p) => (
        <ProfileCard key={p.id} id={p.id} />
      ))}
    </div>
  );
}
