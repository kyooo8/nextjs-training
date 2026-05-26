"use server";

import { User, users } from "@/app/data/data";

export async function getUserById(id: string): Promise<User> {
  const current_user = users.filter((u) => u.id === id);
  return current_user[0];
}
