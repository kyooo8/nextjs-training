import { profilesTable } from "@/db/schema";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: number }>;
};

async function ProfileDetail({ params }: Props) {
  const { id } = await params;

  const profileResult = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, id));

  const profile = profileResult[0];

  return (
    <div className="rounded-3xl overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 shadow-xl">
      <div className="relative w-full aspect-[3/4]">
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
        <p className="text-gray-700 leading-relaxed">{profile.introduction}</p>
      </div>
    </div>
  );
}

export default function ProfileDetailPage({ params }: Props) {
  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
        <ProfileDetail params={params} />
      </Suspense>
    </div>
  );
}
