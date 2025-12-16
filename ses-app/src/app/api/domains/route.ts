import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const axisId = searchParams.get("axisId");

        if (!axisId) {
            return NextResponse.json({ error: "Axis ID is required" }, { status: 400 });
        }

        const domains = await prisma.domain.findMany({
            where: axisId ? { axisId } : undefined,
            include: {
                axis: {
                    select: {
                        id: true,
                        nameEn: true,
                        nameAr: true,
                    },
                },
            },
            orderBy: {
                nameEn: "asc"
            },
        });

        //console.log("Domains fetched successfully:", domains);

        return NextResponse.json({ domains });
    } catch (error) {
        console.error("Error fetching domains: ", error);
        return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
    }
}