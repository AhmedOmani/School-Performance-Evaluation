import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSystemManager } from "@/lib/auth/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSystemManager();
    const { id } = await params;

    const body = await request.json();
    const { status, notes } = body;

    // Validate status
    if (!["APPROVED", "REJECTED", "UNDER_REVIEW"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Fetch evidence to ensure it exists
    const evidence = await prisma.evidence.findUnique({
      where: { id },
    });

    if (!evidence) {
      return NextResponse.json(
        { error: "Evidence not found" },
        { status: 404 }
      );
    }

    // Update evidence status
    const updatedEvidence = await prisma.evidence.update({
      where: { id },
      data: {
        status,
        notes: notes || null,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
      include: {
        domain: {
          select: {
            nameEn: true,
            nameAr: true,
          },
        },
        standard: {
          select: {
            code: true,
            nameEn: true,
            nameAr: true,
          },
        },
        submittedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "EVIDENCE_REVIEWED",
        metadata: {
          evidenceId: evidence.id,
          title: evidence.title,
          oldStatus: evidence.status,
          newStatus: status,
          notes: notes || null,
        },
      },
    });

    return NextResponse.json({
      message: "Evidence status updated successfully",
      evidence: updatedEvidence,
    });
  } catch (error) {
    console.error("Error reviewing evidence:", error);
    
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Access denied. System Manager role required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update evidence status" },
      { status: 500 }
    );
  }
}