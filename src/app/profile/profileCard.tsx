import { EditProfileBtn } from "./editProfileBtn";
import { EditProfile } from "./editProfile";

import Image from "next/image";
import { db } from "../lib/drizzle";
import { profilesTable } from "../db/schema";
import { eq } from "drizzle-orm";

type Props = {
  id: number;
};

export async function ProfileCard({ id }: Props) {
  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, id));

  return (
    <div className="rounded-2xl overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="relative w-full aspect-square">
        <Image
          src={`/images/${profile[0].img_url}`}
          width={200}
          height={200}
          className="object-cover w-full h-full"
          alt="img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-800">{profile[0].name}</p>
        <p className="text-xs text-gray-500">{profile[0].introduction}</p>
        <p className="text-xs text-gray-400 mt-1">{profile[0].created_at}</p>
        <div className="mt-3">
          <EditProfileBtn>
            <EditProfile data={profile[0]} />
          </EditProfileBtn>
        </div>
      </div>
    </div>
  );
}
