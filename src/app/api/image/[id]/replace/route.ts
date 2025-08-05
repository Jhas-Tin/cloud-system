import { NextRequest, NextResponse } from "next/server";
import { replaceImageFile } from "~/server/queries";
import { utapi } from "~/server/uploadthing";

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    // Upload the file using utapi (UploadThing)
    const uploadRes = await utapi.uploadFiles(file);
    if (!uploadRes || !uploadRes.data || !uploadRes.data.url) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
    // Update the image record in the database
    await replaceImageFile(Number(context.params.id), uploadRes.data.url);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to replace image file" }, { status: 500 });
  }
}
