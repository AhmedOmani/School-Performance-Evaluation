import { NextRequest , NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const domainId = searchParams.get("domainId");

        if (!domainId) {
            return NextResponse.json({error: "Domain ID is required"} , { status: 400});
        }

        const standards = await prisma.standard.findMany({
            where: { domainId },
            include: {
              domain: {
                select: {
                  id: true,
                  nameEn: true,
                  nameAr: true,
                },
              },
            },
            orderBy: {
              code: "asc",
            },
        });
      
        return NextResponse.json({ standards });
    } catch (error) {
        console.error("Error fetching standards: " , error);
        return NextResponse.json({error: "Failed to fetch standards"}, { status: 500});
    }
}