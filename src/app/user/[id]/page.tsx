import { getUserById } from "./action";
import Image from "next/image";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getUserById(id);
  return (
    <div>
      <Image
        src={`/images/${data.imgUrl}`}
        width={200}
        height={200}
        alt="image"
      />
      <p>{data.name}</p>
      <p>{data.age}</p>
      <p>{data.introduction_text}</p>
    </div>
  );
}
