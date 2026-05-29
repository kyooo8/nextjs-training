"use server";

import { db } from "@/lib/drizzle";
import { ownersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { uploadAsWebP, deleteBlob } from "@/lib/blob";
import { z } from "zod";

const OwnerFormSchema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
  age: z.coerce.number({ message: "数字を入力してください" }).min(18, { message: "未成年は使用できません" }),
  introduction: z.string().max(500, { message: "500文字以下にしてください" }).optional(),
});

type FieldError = { name?: string; age?: string; introduction?: string };
export type OwnerEditState = { ok: boolean; error?: FieldError };

export async function editOwner(
  _prevState: OwnerEditState,
  formData: FormData,
): Promise<OwnerEditState> {
  const parsed = OwnerFormSchema.safeParse({
    name: formData.get("name"),
    age: formData.get("age"),
    introduction: formData.get("introduction"),
  });

  if (!parsed.success) {
    const fieldErrors: FieldError = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof FieldError;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, error: fieldErrors };
  }

  const file = formData.get("img_file") as File | null;
  const currentImgUrl = formData.get("current_img_url") as string | null;

  let img_url = currentImgUrl ?? undefined;
  if (file && file.size > 0) {
    await deleteBlob(currentImgUrl);
    img_url = await uploadAsWebP(file, "owner");
  }

  await db
    .update(ownersTable)
    .set({
      name: parsed.data.name,
      age: parsed.data.age,
      introduction: parsed.data.introduction ?? null,
      ...(img_url !== undefined && { img_url }),
    })
    .where(eq(ownersTable.id, "1"));

  updateTag("owner");
  return { ok: true };
}
