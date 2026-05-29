"use server";

import { db } from "../../lib/drizzle";
import { profilesTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { uploadAsWebP, deleteBlob } from "@/lib/blob";
import { EditFormSchema } from "@/validations/editProfile";
import { AddFormSchema } from "@/validations/addProfile";

type Error = {
  name?: string;
  age?: string;
  img_url?: string;
  introduction?: string;
};

export type EditState = { ok: boolean; error?: Error };
export type AddState = { ok: boolean; error?: Error };

export async function addProfile(
  _prevState: EditState,
  formData: FormData,
): Promise<AddState> {
  const file = formData.get("img_file") as File | null;
  if (!file || file.size === 0) {
    return { ok: false, error: { img_url: "画像を選択してください" } };
  }

  const addData = AddFormSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    age: formData.get("age"),
    introduction: formData.get("introduction"),
  });

  if (!addData.success) {
    const fieldErrors: Error = {};
    for (const issue of addData.error.issues) {
      const field = issue.path[0] as keyof Error;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, error: fieldErrors };
  }

  const img_url = await uploadAsWebP(file, "1");

  await db.insert(profilesTable).values({
    name: addData.data.name,
    age: addData.data.age,
    img_url,
    introduction: addData.data.introduction,
    owner_id: "1",
  });

  updateTag("profile");
  return { ok: true };
}

export async function editProfile(
  _prevState: EditState,
  formData: FormData,
): Promise<EditState> {
  const file = formData.get("img_file") as File | null;
  const currentImgUrl = formData.get("current_img_url") as string;

  const editData = EditFormSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    age: formData.get("age"),
    introduction: formData.get("introduction"),
  });

  if (!editData.success) {
    const fieldErrors: Error = {};
    for (const issue of editData.error.issues) {
      const field = issue.path[0] as keyof Error;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, error: fieldErrors };
  }

  let img_url = currentImgUrl;
  if (file && file.size > 0) {
    await deleteBlob(currentImgUrl);
    img_url = await uploadAsWebP(file, "1");
  }

  await db
    .update(profilesTable)
    .set({
      name: editData.data.name,
      age: editData.data.age,
      img_url,
      introduction: editData.data.introduction,
      owner_id: "1",
    })
    .where(eq(profilesTable.id, editData.data.id));

  updateTag("profile");
  return { ok: true };
}

export async function deleteProfile(formData: FormData) {
  const id = Number(formData.get("id"));

  const [profile] = await db
    .select({ img_url: profilesTable.img_url })
    .from(profilesTable)
    .where(eq(profilesTable.id, id));

  await deleteBlob(profile?.img_url);

  await db.delete(profilesTable).where(eq(profilesTable.id, id));

  updateTag("profile");
}
