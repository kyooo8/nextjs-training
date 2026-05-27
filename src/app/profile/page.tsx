import Image from "next/image";
import { profilesTable } from "../db/schema";
import { db } from "../lib/drizzle";

import { getMe, getMeProfiles } from "./actions";
import { ProfileCard } from "./profileCard";
import { AddProfileBtn } from "./addProfileBtn";
import { AddProfile } from "./addProfile";

export default async function ProfilePage() {
  const meData = await getMe();
  const meProfiles = await getMeProfiles();

  const profiles = await db.select().from(profilesTable);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-xl p-8 mb-10">
        <div className="flex items-center gap-6">
          <div className="rounded-2xl overflow-hidden shadow-md flex-shrink-0">
            <Image
              src={`/images/${meData.imgUrl}`}
              width={100}
              height={100}
              className="object-cover"
              alt="img"
            />
          </div>
          <div>
            <p className="text-xs text-gray-400">ID: {meData.id}</p>
            <p className="text-xl font-bold text-gray-800">{meData.name}</p>
            <p className="text-gray-500 mt-1">{meData.introduction_text}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          公開プロフィール
          <span className="ml-2 text-sm font-normal text-gray-400">({meProfiles.length})</span>
        </h2>
        <AddProfileBtn>
          <AddProfile />
        </AddProfileBtn>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {profiles.map((p) => (
          <ProfileCard key={p.id} id={p.id} />
        ))}
      </div>
    </div>
  );
}
