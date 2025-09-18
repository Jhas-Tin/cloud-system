// src/server/queries.ts
"use server";
import { db } from "./db";
import { images } from "./db/schema";
import { desc, and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { utapi } from "./uploadthing";

// Get all images (for Web B)
export async function getAllImages() {
  return await db.select().from(images).orderBy(desc(images.id));
}

// Get images of logged-in user (for upload page)
export async function getMyImages() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  return await db.query.images.findMany({
    where: (images, { eq }) => eq(images.userId, user.userId),
    orderBy: (images) => desc(images.id),
  });
}

// Delete image
export async function deleteImage(id: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image not found");
  if (image.userId !== user.userId) throw new Error("Permission denied");

  const filekey = image.imageUrl.split("/").pop();
  if (!filekey) throw new Error("Invalid file key");

  await utapi.deleteFiles([filekey]);
  await db.delete(images).where(and(eq(images.id, id)));
}

// Update image name
export async function updateImageName(id: number, newName: string) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image not found");
  if (image.userId !== user.userId) throw new Error("Permission denied");

  await db.update(images).set({ ImageName: newName }).where(and(eq(images.id, id)));
  return { success: true };
}

// Replace image file
export async function replaceImageFile(id: number, fileUrl: string) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image not found");
  if (image.userId !== user.userId) throw new Error("Permission denied");

  const oldFilekey = image.imageUrl.split("/").pop();
  if (oldFilekey) await utapi.deleteFiles([oldFilekey]);

  await db.update(images).set({ imageUrl: fileUrl }).where(and(eq(images.id, id)));
  return { success: true };
}
