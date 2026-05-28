import Image from "next/image";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

import { profilesTable } from "../../db/schema";
import { EditProfileBtn } from "./[id]/edit/editProfileBtn";
import { EditProfile } from "./[id]/edit/editProfile";

type Props = {
  id: number;
};

export async function ProfileCard({ id }: Props) {
  const profileResult = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, id));

  const profile = profileResult[0];

  return (
    <div className="rounded-2xl overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="relative w-full aspect-[3/4]">
        <Image
          src={`/images/${profile.img_url}`}
          width={200}
          height={200}
          className="object-cover w-full h-full"
          alt="img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-800">{profile.name}</p>
        <p className="text-xs text-gray-500">{profile.introduction}</p>
        <p className="text-xs text-gray-400 mt-1">{profile.created_at}</p>
        <div className="mt-3">
          <EditProfileBtn>
            <EditProfile data={profile} />
          </EditProfileBtn>
        </div>
      </div>
    </div>
  );
}
