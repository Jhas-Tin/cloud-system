// @ts-nocheck
import { NextResponse } from "next/server";
import { replaceImageFile } from "~/server/queries";
import { utapi } from "~/server/uploadthing";

export async function POST(request, context) {
  const { params } = context;
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const uploadRes = await utapi.uploadFiles(file);
    if (!uploadRes || !uploadRes.data || !uploadRes.data.url) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
    await replaceImageFile(Number(params.id), uploadRes.data.url);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to replace image file";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}