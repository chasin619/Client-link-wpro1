import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const flowerPreferencesSchema = z.object({
  flowerPreferences: z.array(z.string()).max(20, "Too many flower preferences"),
  selectedFlowerIds: z.array(z.number()).max(50, "Too many flowers selected"),
  flowerCategories: z.array(z.number()).max(10, "Too many categories selected"),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = parseInt(params.eventId);
    if (isNaN(eventId)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_EVENT_ID", message: "Invalid event ID" },
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = flowerPreferencesSchema.parse(body);

    // Verify event exists and get vendor info
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { vendor: true },
    });

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "EVENT_NOT_FOUND", message: "Event not found" },
        },
        { status: 404 }
      );
    }

    // Validate selected flowers belong to vendor
    if (validatedData.selectedFlowerIds.length > 0) {
      const validFlowers = await prisma.flower.findMany({
        where: {
          id: { in: validatedData.selectedFlowerIds },
          userId: event.vendorId,
        },
      });

      if (validFlowers.length !== validatedData.selectedFlowerIds.length) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_FLOWERS",
              message: "Some flowers do not belong to this vendor",
            },
          },
          { status: 400 }
        );
      }
    }

    // Validate flower categories belong to vendor
    if (validatedData.flowerCategories.length > 0) {
      const validCategories = await prisma.flowerCategory.findMany({
        where: {
          id: { in: validatedData.flowerCategories },
          vendorId: event.vendorId,
        },
      });

      if (validCategories.length !== validatedData.flowerCategories.length) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_CATEGORIES",
              message: "Some categories do not belong to this vendor",
            },
          },
          { status: 400 }
        );
      }
    }

    // Update event with flower preferences
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        arrangements: {
          preferences: validatedData.flowerPreferences,
          selectedFlowerIds: validatedData.selectedFlowerIds,
          flowerCategories: validatedData.flowerCategories,
        },
        lastAutoSavedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        eventId: updatedEvent.id,
        updatedAt: updatedEvent.updatedAt.toISOString(),
        flowerPreferences: validatedData.flowerPreferences,
        selectedFlowerIds: validatedData.selectedFlowerIds,
        flowerCategories: validatedData.flowerCategories,
      },
      message: "Flower preferences updated successfully",
    });
  } catch (error) {
    console.error("Error updating flowers:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid data",
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to update flower preferences",
        },
      },
      { status: 500 }
    );
  }
}
