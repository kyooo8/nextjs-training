import { deletePost } from "../actions";

export default function DeleteButton({ id }: { id: number }) {
  const action = deletePost.bind(null, id);
  return (
    <form action={action}>
      <button type="submit">削除</button>
    </form>
  );
}
