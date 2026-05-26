import { describe, it, expect } from "vitest";
import { filterPosts } from "./posts";
import { Post } from "../posts/[id]/page";

describe("filterPosts", () => {
  it("空文字なら全件返す", () => {
    const posts: Post[] = [
      { id: 1, title: "a", body: "test" },
      { id: 2, title: "b", body: "test" },
    ];
    expect(filterPosts(posts, "")).toHaveLength(2);
  });

  it("部分一致で絞り込む", () => {
    const posts = [
      { id: 1, title: "hello", body: "test" },
      { id: 2, title: "world", body: "test" },
    ];
    expect(filterPosts(posts, "wor")).toEqual([
      { id: 2, title: "world", body: "test" },
    ]);
  });
});
