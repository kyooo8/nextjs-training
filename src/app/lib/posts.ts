import { Post } from "../posts/[id]/page";

export function filterPosts(posts: Post[], q: string) {
  if (!q) return posts;
  return posts.filter((p) => p.title.includes(q));
}
