import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { uploadFileToS3 , isS3Configured } from "@/lib/upload" ;

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();

        const formData = await request.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string | null;
        const domainId = formData.get("domainId") as string;
        const standardId = formData.get("standardId") as string;
        const indicatorId = formData.get("indicatorId") as string | null;
        const type = formData.get("type") as "FILE" | "LINK";
        const file = formData.get("file") as File | null;
        const url = formData.get("url") as string | null;

        //validation
        if (!title || !domainId || !standardId || ! indicatorId || !type) {
            return NextResponse.json({
                error: "Missing required fields"
            }, { status: 400 });
        }

        if (type === "FILE" && !file) {
            return NextResponse.json( { error: "File is required when type is FILE" }, { status: 400 });
        }

        if (type === "LINK" && !url) {
            return NextResponse.json(
              { error: "URL is required when type is LINK" },
              { status: 400 }
            );
        }

        // Validate file size
        if (file && file.size > 50 * 1024 * 1024) {
            return NextResponse.json({ error: "File size exceeds 50MB limit" },{ status: 400 });
        }

        // Upload file to S3 if type is FILE
        let filePath:string | null = null;
        if (type === "FILE" && file) {
            if (!isS3Configured()) {
                return NextResponse.json({ error: "S3 is not configured, check environment variables" }, { status: 500 });
            }

            try {
                filePath = await uploadFileToS3(file, "evidence");
            } catch(error) {
                console.error("S3 Upload error: " , error);
                return NextResponse.json(
                    { error: "Failed to upload file to S3" },
                    { status: 500 }
                );
            }

        }
    } catch(error) {

    }
}