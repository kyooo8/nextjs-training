import { profilesTable } from "@/app/db/schema";
import { db } from "@/app/lib/drizzle";
import { eq } from "drizzle-orm";
import Image from "next/image";

type Props = {
  params: Promise<{ id: number }>;
};

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  const profileResult = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, id));

  const profile = profileResult[0];

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <div className="rounded-3xl overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 shadow-xl">
        <div className="relative w-full aspect-square">
          <Image
            src={`/images/${profile.img_url}`}
            width={200}
            height={200}
            className="object-cover w-full h-full"
            alt="image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-2xl font-bold">{profile.name}</p>
            <p className="text-sm opacity-80">{profile.age}歳</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">
            {profile.introduction}
          </p>
        </div>
      </div>
    </div>
  );
}
