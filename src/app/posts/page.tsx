import Link from "next/link";
import SearchBox from "../components/SearchBox";
import { getPosts } from "./actions";

type Props = { searchParams: Promise<{ q?: string }> };
type Post = { id: number; title: string };

export default async function PostsPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const posts: Post[] = await getPosts();

  const filtered = q ? posts.filter((p) => p.title.includes(q)) : posts;

  return (
    <main>
      <h1>投稿一覧{q && `(検索: ${q})`}</h1>
      <SearchBox />

      <ul>
        {filtered.slice(0, 10).map((p) => (
          <li key={p.id}>
            <Link href={`/posts/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
