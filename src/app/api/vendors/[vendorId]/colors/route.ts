// /api/vendors/[vendorId]/colors/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    const vendorId = parseInt(params.vendorId);

    // Validate vendorId
    if (isNaN(vendorId)) {
      return NextResponse.json({ error: "Invalid vendor ID" }, { status: 400 });
    }

    const colors = await prisma.color.findMany({
      where: {
        OR: [{ vendorId: vendorId }, { isShared: true }],
      },
      select: {
        id: true,
        name: true,
        hexCode: true,
        vendorId: true,
        isShared: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ colors });
  } catch (error) {
    console.error("Error fetching vendor colors:", error);
    return NextResponse.json(
      { error: "Failed to fetch colors" },
      { status: 500 }
    );
  }
}
