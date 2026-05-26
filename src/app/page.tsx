import Link from "next/link";
import Modal from "./components/Modal";
import ServerChart from "./components/ServerChart";

export default function Home() {
  return (
    <>
      <h1>タイトル</h1>
      <ul>
        <li>
          <Link href="/about">aboutへ</Link>
          <Link href="/posts">postsへ</Link>
        </li>
        <Modal>
          <ServerChart />
        </Modal>
      </ul>
    </>
  );
}
