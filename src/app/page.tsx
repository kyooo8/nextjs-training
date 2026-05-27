import { UserCard } from "@/app/userCard";
import { users } from "./data/data";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-5 container mx-auto">
      {users.map((o) => (
        <Link key={o.name} href={`/user/${o.id}`}>
          <UserCard data={o} />
        </Link>
      ))}
      {users.map((o) => (
        <Link key={o.name} href={`/user/${o.id}`}>
          <UserCard data={o} />
        </Link>
      ))}
      {users.map((o) => (
        <Link key={o.name} href={`/user/${o.id}`}>
          <UserCard data={o} />
        </Link>
      ))}
      {users.map((o) => (
        <Link key={o.name} href={`/user/${o.id}`}>
          <UserCard data={o} />
        </Link>
      ))}
      {users.map((o) => (
        <Link key={o.name} href={`/user/${o.id}`}>
          <UserCard data={o} />
        </Link>
      ))}
    </div>
  );
}
