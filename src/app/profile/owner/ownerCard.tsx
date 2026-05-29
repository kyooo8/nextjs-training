import { db } from "@/lib/drizzle";
import Image from "next/image";
import { ownersTable } from "@/db/schema";
import { EditProfileBtn } from "../[id]/edit/editProfileBtn";
import { EditOwner } from "./editOwner";
import { eq } from "drizzle-orm";

export async function OwnerCard() {
  const meProfileResult = await db
    .select()
    .from(ownersTable)
    .where(eq(ownersTable.id, "1"));
  const meData = meProfileResult[0];

  return (
    <div className="rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-xl p-8 mb-10">
      <div className="flex items-center gap-6">
        {meData.img_url && (
          <div className="rounded-2xl overflow-hidden shadow-md flex-shrink-0">
            <Image
              src={`/api/image?url=${encodeURIComponent(meData.img_url)}`}
              width={100}
              height={100}
              className="object-cover"
              alt="img"
            />
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs text-gray-400">ID: {meData.id}</p>
          <p className="text-xl font-bold text-gray-800">{meData.name}</p>
          <p className="text-gray-500 mt-1">{meData.introduction}</p>
        </div>
        <EditProfileBtn>
          <EditOwner data={meData} />
        </EditProfileBtn>
      </div>
    </div>
  );
}
