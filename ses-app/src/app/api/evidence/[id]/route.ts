import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { deleteFileFromS3 } from "@/lib/upload";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // 1. Find the evidence
        const evidence = await prisma.evidence.findUnique({
            where: { id },
            include: {
                submittedBy: true,
            },
        });

        if (!evidence) {
            return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
        }

        // 2. Authorization check (Owner or System Manager)
        const isOwner = evidence.submittedBy.email === session.user.email;
        const isSystemManager = session.user.role === "SYSTEM_MANAGER";

        if (!isOwner && !isSystemManager) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 3. Delete file from S3 if applicable
        if (evidence.type === "FILE" && evidence.filePath) {
            // Extract key from filePath if it's stored as a full URL, or use it directly if it's a key
            // Based on our upload logic, we store the key in filePath? No, we store the key in filePath.
            // Let's double check upload logic.
            // In upload route:
            // const evidence = await prisma.evidence.create({ data: { ..., filePath: filePath, ... } })
            // So filePath IS the key.

            try {
                await deleteFileFromS3(evidence.filePath);
            } catch (s3Error) {
                console.error("Failed to delete file from S3:", s3Error);
                // We continue to delete the record even if S3 fails, to avoid orphaned records.
                // Or should we fail? Usually better to clean up DB and log S3 error.
            }
        }

        // 4. Delete from Database
        await prisma.evidence.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting evidence:", error);
        return NextResponse.json(
            { error: "Failed to delete evidence" },
            { status: 500 }
        );
    }
}
