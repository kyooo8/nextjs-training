import Image from "next/image";
import { profilesTable } from "../db/schemaa";

type Props = {
  data: typeof profilesTable.$inferSelect;
};

export function ProfileListCard({ data }: Props) {
  const imageSize = 200;
  return (
    <div
      key={data.name}
      className="rounded-2xl overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
    >
      <div className="relative w-full aspect-square">
        <Image
          src={`/images/${data.img_url}`}
          width={imageSize}
          height={imageSize}
          className="object-cover w-full h-full"
          alt="img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-500">{data.age}歳</p>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
          {data.introduction}
        </p>
      </div>
    </div>
  );
}
