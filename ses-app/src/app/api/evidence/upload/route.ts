import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { uploadFileToS3, isS3Configured } from "@/lib/upload";

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();
        // const user = { id: "cmi7x0qxg0000f11x5h34znt7" }; // Mock user for testing

        let formData;
        try {
            formData = await request.formData();
        } catch (error) {
            console.error("Error parsing form data:", error);
            return NextResponse.json(
                { error: "Failed to parse form data. The file might be too large or corrupted." },
                { status: 400 }
            );
        }
        const title = formData.get("title") as string;
        const description = formData.get("description") as string | null;
        const domainId = formData.get("domainId") as string;
        const standardId = formData.get("standardId") as string;
        const indicatorId = formData.get("indicatorId") as string | null;
        const type = formData.get("type") as "FILE" | "LINK";
        const filePath = formData.get("filePath") as string | null;
        const url = formData.get("url") as string | null;

        //validation
        if (!title || !domainId || !standardId || !type) {
            return NextResponse.json({
                error: "Missing required fields"
            }, { status: 400 });
        }

        if (type === "FILE" && !filePath) {
            return NextResponse.json({ error: "File path is required when type is FILE" }, { status: 400 });
        }

        if (type === "LINK" && !url) {
            return NextResponse.json(
                { error: "URL is required when type is LINK" },
                { status: 400 }
            );
        }

        const evidence = await prisma.evidence.create({
            data: {
                title,
                description: description || null,
                domainId,
                standardId,
                indicatorId: indicatorId || null,
                type,
                filePath: type === "FILE" ? filePath : null,
                url: type === "LINK" ? url : null,
                status: "UNDER_REVIEW",
                submittedById: user.id,
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: "EVIDENCE_UPLOADED",
                metadata: {
                    evidenceId: evidence.id,
                    title: evidence.title,
                    type: evidence.type,
                },
            },
        });

        return NextResponse.json(
            { message: "Evidence uploaded successfully", evidence },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error uploading evidence:", error);
        return NextResponse.json(
            { error: "Failed to upload evidence" },
            { status: 500 }
        );
    }
}