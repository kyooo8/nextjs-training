import { put, del } from "@vercel/blob";
import sharp from "sharp";

export async function uploadAsWebP(file: File, ownerId: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
  const pathname = `${ownerId}/${crypto.randomUUID()}.webp`;
  const blob = await put(pathname, webpBuffer, {
    access: "private",
    contentType: "image/webp",
  });
  return blob.url;
}

export async function deleteBlob(url: string | null | undefined): Promise<void> {
  if (url) await del(url);
}
