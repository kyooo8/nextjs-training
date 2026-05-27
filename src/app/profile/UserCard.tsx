import { User } from "@/app/data/data";
import Image from "next/image";

type Props = {
  data: User;
};

export async function UserCard({ data }: Props) {
  const imageSize = 200;
  return (
    <div
      key={data.name}
      className={`m-2 flex flex-col justify-center items-center w-[${imageSize}px] rounded-xl bg-gray-800`}
    >
      <div className={`h-[${imageSize}px] relative`}></div>
      <Image
        src={`/images/${data.imgUrl}`}
        width={imageSize}
        height={imageSize}
        className="object-cover"
        alt="img"
      />
      <div className="w-full h-full mt-4 text-white">
        <p>{data.name}</p>
        <p>{data.age}</p>
        <p>{data.introduction_text}</p>
      </div>
    </div>
  );
}
