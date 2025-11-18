import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const standardId = searchParams.get("standardId");

        if (!standardId) {
            return NextResponse.json({error: "standardId is required"}, { status: 400});
        }

        
        const indicators = await prisma.indicator.findMany({
            where: { standardId },
            include: {
              standard: {
                select: {
                  id: true,
                  code: true,
                  nameEn: true,
                  nameAr: true,
                },
              },
            },
            orderBy: {
              code: "asc",
            },
        });
        return NextResponse.json({ indicators });
    } catch (error) {
        console.error("Error fetching indicators: " , error);
        return NextResponse.json({error: "Failed to fetch indicators"}, { status: 500});
    }
}