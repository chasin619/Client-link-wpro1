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

    const arrangementTypes = await prisma.arrangementType.findMany({
      where: {
        OR: [{ vendorId: vendorId }, { isShared: true }],
      },
      include: {
        _count: {
          select: {
            Arrangement: {
              where: {
                OR: [{ vendorId: vendorId }, { isShared: true }],
              },
            },
          },
        },
        Arrangement: {
          where: {
            OR: [{ vendorId: vendorId }, { isShared: true }],
          },
          select: {
            id: true,
            name: true,
            price: true,
            imageFilename: true,
            isShared: true,
          },
          take: 3, // Preview arrangements
        },
      },
      orderBy: [{ vendorId: "desc" }, { name: "asc" }],
    });

    return NextResponse.json({
      success: true,
      arrangementTypes: arrangementTypes.map((type) => ({
        id: type.id,
        name: type.name,
        vendorId: type.vendorId,
        isShared: type.isShared,
        arrangementCount: type._count.Arrangement,
        previewArrangements: type.Arrangement,
      })),
    });
  } catch (error) {
    console.error("Error fetching arrangement types:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
