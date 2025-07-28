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

    const categories = await prisma.flowerCategory.findMany({
      where: {
        OR: [{ vendorId: vendorId }, { isShared: true }],
      },
      include: {
        flowers: {
          where: {
            OR: [{ userId: vendorId }, { isShared: true }],
          },
          select: {
            id: true,
            name: true,
            imageFilename: true,
          },
          take: 5, // Show first 5 flowers as preview
        },
        _count: {
          select: {
            flowers: {
              where: {
                OR: [{ userId: vendorId }, { isShared: true }],
              },
            },
          },
        },
      },
      orderBy: [
        { vendorId: "desc" }, // Vendor-specific categories first
        { name: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        isShared: category.isShared,
        vendorId: category.vendorId, // Added to identify ownership
        flowerCount: category._count.flowers,
        previewFlowers: category.flowers,
      })),
    });
  } catch (error) {
    console.error("Error fetching flower categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
