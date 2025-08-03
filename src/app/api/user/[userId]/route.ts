import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Extract userId from the URL pathname
        const url = new URL(request.url);
        const parts = url.pathname.split("/");
        const userId = parts[parts.length - 1];
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 404 });
        }
        const client = await clerkClient();
        const uploaderInfo = await client.users.getUser(userId);
        return NextResponse.json({
            fullName: uploaderInfo.fullName,
            username: uploaderInfo.username,
            emailAddresses: uploaderInfo.emailAddresses[0]?.emailAddress || "No email",
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        return NextResponse.json({ error: "Failed to fetch user info" }, { status: 500 });
    }
}