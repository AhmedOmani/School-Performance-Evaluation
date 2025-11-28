import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { z } from "zod";
import { ratelimit } from "@/lib/ratelimit";

const uploadSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional().nullable(),
    domainId: z.string().min(1, "Domain is required"),
    standardId: z.string().min(1, "Standard is required"),
    indicatorId: z.string().optional().nullable(),
    type: z.enum(["FILE", "LINK"]),
    filePath: z.string().optional().nullable(),
    url: z.string().url("Invalid URL format").optional().nullable(),
}).refine((data) => {
    if (data.type === "FILE" && !data.filePath) return false;
    if (data.type === "LINK" && !data.url) return false;
    return true;
}, {
    message: "File path is required for FILE type, URL is required for LINK type",
    path: ["type"], // Error will be attached to the 'type' field
});

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();

        // Rate Limiting
        const identifier = user.id;
        const { success } = await ratelimit.limit(identifier);

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        let formData;
        try {
            formData = await request.formData();
        } catch (error) {
            console.error("Error parsing form data:", error);
            return NextResponse.json(
                { error: "Failed to parse form data." },
                { status: 400 }
            );
        }

        const rawData = {
            title: formData.get("title"),
            description: formData.get("description"),
            domainId: formData.get("domainId"),
            standardId: formData.get("standardId"),
            indicatorId: formData.get("indicatorId"),
            type: formData.get("type"),
            filePath: formData.get("filePath"),
            url: formData.get("url"),
        };

        const validationResult = uploadSchema.safeParse(rawData);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validationResult.error.flatten() },
                { status: 400 }
            );
        }

        const { data } = validationResult;

        const evidence = await prisma.evidence.create({
            data: {
                title: data.title,
                description: data.description || null,
                domainId: data.domainId,
                standardId: data.standardId,
                indicatorId: data.indicatorId || null,
                type: data.type,
                filePath: data.type === "FILE" ? data.filePath : null,
                url: data.type === "LINK" ? data.url : null,
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