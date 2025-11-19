import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
    try {
        await requireAuth();

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status");
        const domainId = searchParams.get("domainId");
        const standardId = searchParams.get("standardId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status && ["UNDER_REVIEW", "APPROVED", "REJECTED"].includes(status)) {
            where.status = status;
        }
        if (domainId) {
            where.domainId = domainId;
        }
        if (standardId) {
            where.standardId = standardId;
        }

        const [evidence, total] = await Promise.all([
            prisma.evidence.findMany({
              where,
              include: {
                domain: {
                  select: {
                    id: true,
                    nameEn: true,
                    nameAr: true,
                  },
                },
                standard: {
                  select: {
                    id: true,
                    code: true,
                    nameEn: true,
                    nameAr: true,
                  },
                },
                indicator: {
                  select: {
                    id: true,
                    code: true,
                    descriptionEn: true,
                    descriptionAr: true,
                  },
                },
                submittedBy: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: {
                submittedAt: "desc",
              },
              skip,
              take: limit,
            }),
            prisma.evidence.count({ where }),
        ]);

        return NextResponse.json({
            evidence,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching evidence:", error);
        return NextResponse.json(
            { error: "Failed to fetch evidence" },
            { status: 500 }
        );
    }
}