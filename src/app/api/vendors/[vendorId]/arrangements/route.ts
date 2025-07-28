import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    const vendorId = parseInt(params.vendorId);
    const { searchParams } = new URL(request.url);
    const typeId = searchParams.get("typeId");

    if (isNaN(vendorId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid vendor ID is required",
        },
        { status: 400 }
      );
    }

    const whereClause: any = {
      OR: [{ vendorId: vendorId }, { isShared: true }],
    };

    if (typeId && !isNaN(parseInt(typeId))) {
      whereClause.AND = {
        typeId: parseInt(typeId),
      };
    }

    const arrangements = await prisma.arrangement.findMany({
      where: whereClause,
      include: {
        type: {
          select: {
            id: true,
            name: true,
            vendorId: true,
            isShared: true,
          },
        },
        colors: {
          select: {
            id: true,
            name: true,
            hexCode: true,
            vendorId: true,
            isShared: true,
          },
        },
        ArrangementIngredient: {
          include: {
            flower: {
              select: {
                id: true,
                name: true,
                imageFilename: true,
                userId: true,
                isShared: true,
              },
            },
          },
          take: 5,
        },
        _count: {
          select: {
            ArrangementIngredient: true,
          },
        },
      },
      orderBy: [
        { vendorId: "desc" },
        { type: { name: "asc" } },
        { name: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      arrangements: arrangements.map((arrangement) => ({
        id: arrangement.id,
        name: arrangement.name,
        description: arrangement.description,
        price: arrangement.price,
        imageFilename: arrangement.imageFilename,
        labourTime: arrangement.labourTime,
        labourCost: arrangement.labourCost,
        itemCost: arrangement.itemCost,
        profit: arrangement.profit,
        margin: arrangement.margin,
        vendorId: arrangement.vendorId, // Added to identify ownership
        isShared: arrangement.isShared,
        type: arrangement.type,
        colors: arrangement.colors,
        ingredientCount: arrangement._count.ArrangementIngredient,
        previewIngredients: arrangement.ArrangementIngredient.map(
          (ingredient) => ({
            quantity: ingredient.quantity,
            flower: ingredient.flower,
          })
        ),
      })),
    });
  } catch (error) {
    console.error("Error fetching arrangements:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
