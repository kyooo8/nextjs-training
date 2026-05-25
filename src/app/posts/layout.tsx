import Link from "next/link";
import { getPosts } from "./actions";

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPosts();

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <aside
        style={{ width: 160, borderRight: "1px solid #ddd", paddingRight: 16 }}
      >
        <h2>メニュー</h2>
        <ul>
          <li>
            <Link href="/posts">一覧</Link>
          </li>
          <li>
            <Link href="/posts/new">新規記事</Link>
          </li>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <section style={{ flex: 1 }}>{children}</section>
    </div>
  );
}
