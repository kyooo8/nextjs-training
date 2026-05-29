import { db } from "@/lib/drizzle";
import { Suspense } from "react";

import { ownersTable, profilesTable } from "../../../db/schema";
import { AddProfile } from "./add/addProfile";
import { ProfileList } from "./profileList";
import { OwnerCard } from "./ownerCard";
import { eq } from "drizzle-orm";

async function ProfileCount() {
  const profiles = await db.select().from(profilesTable);
  return (
    <span className="ml-2 text-sm font-normal text-gray-400">
      ({profiles.length})
    </span>
  );
}

async function AddProfileSection() {
  const [owner] = await db
    .select({ name: ownersTable.name, age: ownersTable.age })
    .from(ownersTable)
    .where(eq(ownersTable.id, "1"));

  return <AddProfile defaultName={owner?.name} defaultAge={owner?.age} />;
}

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Suspense fallback={<div className="h-40 mb-10" />}>
        <OwnerCard />
      </Suspense>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          公開プロフィール
          <Suspense fallback={null}>
            <ProfileCount />
          </Suspense>
        </h2>
        <Suspense fallback={null}>
          <AddProfileSection />
        </Suspense>
      </div>

      <ProfileList />
    </div>
  );
}
