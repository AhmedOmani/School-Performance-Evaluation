import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parallelize all independent queries
        const [
            totalEvidence,
            approvedEvidence,
            underReviewEvidence,
            evidenceByDomainRaw,
            domains
        ] = await Promise.all([
            prisma.evidence.count(),
            prisma.evidence.count({ where: { status: "APPROVED" } }),
            prisma.evidence.count({ where: { status: "UNDER_REVIEW" } }),
            prisma.evidence.groupBy({
                by: ["domainId"],
                _count: {
                    id: true,
                },
            }),
            prisma.domain.findMany({
                select: {
                    id: true,
                    nameEn: true,
                    nameAr: true,
                },
            })
        ]);

        // Map counts to domain names
        const evidenceByDomain = domains.map((domain) => {
            const stat = evidenceByDomainRaw.find((d) => d.domainId === domain.id);
            return {
                domainId: domain.id,
                nameEn: domain.nameEn,
                nameAr: domain.nameAr,
                count: stat?._count.id || 0,
            };
        });

        // Sort by count descending
        evidenceByDomain.sort((a, b) => b.count - a.count);

        return NextResponse.json({
            totalEvidence,
            approvedEvidence,
            underReviewEvidence,
            evidenceByDomain,
        });
    } catch (error) {
        console.error("Error fetching report stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch report statistics" },
            { status: 500 }
        );
    }
}
