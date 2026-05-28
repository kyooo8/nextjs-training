import { ProfileListCard } from "@/app/profileListCard";
import Link from "next/link";
import { db } from "../lib/drizzlee";
import { profilesTable } from "../db/schema";

export default async function Home() {
  const profiles = await db.select().from(profilesTable);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {profiles.map((o) => (
        <Link key={o.name} href={`/profile/${o.id}`}>
          <ProfileListCard data={o} />
        </Link>
      ))}
    </div>
  );
}
