import FavoriteButton from "@/app/components/FavoriteButton";
import { getPostById } from "@/app/posts/actions";
import DeleteButton from "./Deletebutton";

type Props = { params: Promise<{ id: string }> };
export type Post = { id: number; title: string; body: string };

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

  const post: Post | "" = await getPostById(Number(id));

  return (
    <main>
      {post === "" ? (
        "その記事は存在しません"
      ) : (
        <>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <DeleteButton id={post.id} />
          <FavoriteButton />
        </>
      )}
    </main>
  );
}
