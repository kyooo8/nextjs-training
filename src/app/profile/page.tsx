import Image from "next/image";
import { db } from "../../lib/drizzle";

import { ownersTable, profilesTable } from "../../db/schema";
import { AddProfileBtn } from "./[id]/add/addProfileBtn";
import { AddProfile } from "./[id]/add/addProfile";
import { eq } from "drizzle-orm";
import { ProfileList } from "./profileList";

export default async function ProfilePage() {
  const meProfileResult = await db
    .select()
    .from(ownersTable)
    .where(eq(ownersTable.id, "1"));
  const meData = meProfileResult[0];

  const profiles = await db.select().from(profilesTable);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-xl p-8 mb-10">
        <div className="flex items-center gap-6">
          <div className="rounded-2xl overflow-hidden shadow-md flex-shrink-0">
            <Image
              src={`/images/${meData.img_url}`}
              width={100}
              height={100}
              className="object-cover"
              alt="img"
            />
          </div>
          <div>
            <p className="text-xs text-gray-400">ID: {meData.id}</p>
            <p className="text-xl font-bold text-gray-800">{meData.name}</p>
            <p className="text-gray-500 mt-1">{meData.introduction}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          公開プロフィール
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({profiles.length})
          </span>
        </h2>
        <AddProfileBtn>
          <AddProfile />
        </AddProfileBtn>
      </div>

      <ProfileList />
    </div>
  );
}
