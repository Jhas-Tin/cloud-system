// src/app/api/images/route.ts
import { NextResponse } from "next/server";
import { getAllImages } from "~/server/queries"; // function to fetch all images

export async function GET() {
  try {
    const images = await getAllImages(); // get all images from DB
    return NextResponse.json({ items: images });
  } catch (error: any) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
