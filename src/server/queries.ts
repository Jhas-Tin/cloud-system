"use server";
import "server-only"; 
import { auth } from "@clerk/nextjs/server";

import { db } from "./db";
import { images } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { utapi } from "./uploadthing";



export async function getMyImages() {
    const user = await auth();

    if (!user.userId) {
        throw new Error("Unauthorized");
    }

    const images = await db.query.images.findMany({
        where: (images, { eq }) => eq(images.userId, user.userId),
        orderBy: (images, { desc }) => desc(images.id),
    });

    

    return images;
}

export async function deleteImage(id: number) {
    const user = await auth();

    if (!user.userId) {
        throw new Error("Unauthorized");
    }

    const image = await db.query.images.findFirst({
        where: (model, { eq }) => eq(model.id, id),
    });
    if (!image) {
        throw new Error("Image not found");
    }
    if (image.userId !== user.userId) {
        throw new Error("You do not have permission to delete this image");
    }

    const filekey = image.imageUrl.split("/").pop();
    if (!filekey)  throw new Error("Invalid file key");
    await utapi.deleteFiles([filekey]);
    

    await db.delete(images)
    .where(and(eq(images.id, id)));
}