import { z } from "zod";

export const AddFormSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(1, { message: "名前を入力してください" }),
  age: z.coerce
    .number({ message: "数字を入力してください" })
    .min(18, { message: "未成年は使用できません " }),
  introduction: z
    .string()
    .min(1, { message: "自己紹介を入力してください" })
    .max(500, { message: "500文字以下にしてください" }),
});

export type AddFormType = z.infer<typeof AddFormSchema>;
