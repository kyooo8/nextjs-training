import { db } from "@/lib/drizzle";
import Link from "next/link";
import { profilesTable } from "@/db/schema";
import { ProfileListCard } from "./profileListCard";

export async function ProfileGrid() {
  const profiles = await db.select().from(profilesTable);

  return (
    <>
      {profiles.map((o) => (
        <Link key={o.name} href={`/profile/${o.id}`}>
          <ProfileListCard data={o} />
        </Link>
      ))}
    </>
  );
}
