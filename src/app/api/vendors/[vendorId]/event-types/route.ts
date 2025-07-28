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

    const eventTypes = await prisma.eventType.findMany({
      where: {
        vendorId: vendorId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // If vendor has no custom event types, return default ones
    if (eventTypes.length === 0) {
      const defaultEventTypes = [
        { id: null, name: "wedding" },
        { id: null, name: "engagement" },
        { id: null, name: "anniversary" },
        { id: null, name: "birthday" },
        { id: null, name: "corporate" },
        { id: null, name: "other" },
      ];

      return NextResponse.json({
        success: true,
        eventTypes: defaultEventTypes,
        isDefault: true,
      });
    }

    return NextResponse.json({
      success: true,
      eventTypes,
      isDefault: false,
    });
  } catch (error) {
    console.error("Error fetching event types:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
