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

        // 1. Get total evidence count
        const totalEvidence = await prisma.evidence.count();

        // 2. Get approved evidence count
        const approvedEvidence = await prisma.evidence.count({
            where: { status: "APPROVED" },
        });

        // 3. Get under review evidence count
        const underReviewEvidence = await prisma.evidence.count({
            where: { status: "UNDER_REVIEW" },
        });

        // 4. Get evidence count by domain
        // We need to group by domainId and then join with Domain table to get names
        // Prisma's groupBy is good for this.
        const evidenceByDomainRaw = await prisma.evidence.groupBy({
            by: ["domainId"],
            _count: {
                id: true,
            },
        });

        // Fetch domain details to map names
        const domains = await prisma.domain.findMany({
            select: {
                id: true,
                nameEn: true,
                nameAr: true,
            },
        });

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
