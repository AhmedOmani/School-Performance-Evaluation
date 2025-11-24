import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { getPresignedUploadUrl, isS3Configured } from "@/lib/upload";

export async function POST(request: NextRequest) {
    try {
        await requireAuth();

        if (!isS3Configured()) {
            return NextResponse.json(
                { error: "S3 is not configured" },
                { status: 500 }
            );
        }

        const { filename, contentType } = await request.json();

        if (!filename || !contentType) {
            return NextResponse.json(
                { error: "Filename and content type are required" },
                { status: 400 }
            );
        }

        const { uploadUrl, key } = await getPresignedUploadUrl(
            "evidence",
            filename,
            contentType
        );

        return NextResponse.json({ uploadUrl, key });
    } catch (error) {
        console.error("Error generating upload URL:", error);
        return NextResponse.json(
            { error: "Failed to generate upload URL" },
            { status: 500 }
        );
    }
}
