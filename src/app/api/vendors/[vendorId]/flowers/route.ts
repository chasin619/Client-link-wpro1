import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    const vendorId = parseInt(params.vendorId);

    if (isNaN(vendorId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid vendor ID is required",
        },
        { status: 400 }
      );
    }

    const flowers = await prisma.flower.findMany({
      where: {
        OR: [{ userId: vendorId }, { isShared: true }],
      },
      include: {
        color: {
          select: {
            id: true,
            name: true,
            hexCode: true,
          },
        },
        flowerCategory: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: [
        { userId: "desc" }, // Vendor-specific flowers first
        { flowerCategory: { name: "asc" } },
        { name: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      flowers: flowers.map((flower) => ({
        id: flower.id,
        name: flower.name,
        stemsPerBunch: flower.stemsPerBunch,
        costPerStem: flower.costPerStem,
        costPerBunch: flower.costPerBunch,
        supplier: flower.supplier,
        imageFilename: flower.imageFilename,
        isShared: flower.isShared,
        userId: flower.userId, // Added to identify ownership
        color: flower.color,
        category: flower.flowerCategory,
      })),
    });
  } catch (error) {
    console.error("Error fetching flowers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
