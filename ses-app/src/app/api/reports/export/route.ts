import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import * as XLSX from "xlsx";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all evidence with relations
        const evidence = await prisma.evidence.findMany({
            include: {
                domain: {
                    include: {
                        axis: true,
                    },
                },
                standard: true,
                indicator: true,
                submittedBy: true,
                reviewedBy: true,
            },
            orderBy: {
                submittedAt: "desc",
            },
        });

        // Transform data for Excel
        const data = evidence.map((item) => ({
            "ID": item.id,
            "Title": item.title,
            "Description": item.description || "",
            "Axis (EN)": item.domain.axis.nameEn,
            "Axis (AR)": item.domain.axis.nameAr,
            "Domain (EN)": item.domain.nameEn,
            "Domain (AR)": item.domain.nameAr,
            "Standard Code": item.standard.code,
            "Standard (EN)": item.standard.nameEn,
            "Standard (AR)": item.standard.nameAr,
            "Type": item.type,
            "Status": item.status,
            "Submitted By": item.submittedBy.name,
            "Submitted Email": item.submittedBy.email,
            "Submitted At": item.submittedAt.toISOString(),
            "Reviewed By": item.reviewedBy?.name || "",
            "Reviewed At": item.reviewedAt?.toISOString() || "",
            "Notes": item.notes || "",
            "File/URL": item.type === "FILE" ? item.filePath : item.url,
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Evidence");

        // Generate buffer
        const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        // Return response
        return new NextResponse(buf, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="evidence-report-${new Date().toISOString().split('T')[0]}.xlsx"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });
    } catch (error) {
        console.error("Error generating Excel report:", error);
        return NextResponse.json(
            { error: "Failed to generate Excel report" },
            { status: 500 }
        );
    }
}
