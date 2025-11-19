import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { getPresignedUrl } from "@/lib/upload";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    try {
        await requireAuth();
        const { id } = await params;

        const evidence = await prisma.evidence.findUnique({
            where: { id } ,
            select: {
                id: true,
                type: true,
                filePath: true,
                url: true, 
            },
        });

        if (!evidence) {
            return NextResponse.json(
                { error: "Evidence not found"} ,
                { status: 404}
            );
        }

        if (evidence.type === "LINK" && evidence.url) {
            return NextResponse.json({ downloadUrl: evidence.url});
        }

        if (evidence.type === "FILE" && evidence.filePath) {
            try {
                const downloadUrl = await getPresignedUrl(evidence.filePath, 3600);
                return NextResponse.json({ downloadUrl });
            } catch (error) {
                console.error("Error getting presigned URL: " , error);
                return NextResponse.json(
                    { error: "Failed to get download URL"},
                    { status: 500 }
                )
            }
        }

        return NextResponse.json(
            { error: "No file or URL available" },
            { status: 400 }
        );
    } catch(error) {
        console.error("Error getting download URL: " , error);
        return NextResponse.json(
            { error: "Failed to get download URL"},
            { status: 500 }
        )
    }
}