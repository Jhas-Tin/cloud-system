import { NextRequest, NextResponse } from "next/server";
import { updateImageName } from "../../../../server/queries";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { ImageName } = await request.json();
    if (!ImageName) {
      return NextResponse.json({ error: "ImageName is required" }, { status: 400 });
    }
    await updateImageName(Number(params.id), ImageName);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update image name" }, { status: 500 });
  }
}


