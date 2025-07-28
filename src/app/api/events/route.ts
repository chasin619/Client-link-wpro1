import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const colorSchemeSchema = z.object({
  colorScheme: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  }),
  selectedColors: z.array(z.number()).max(10, "Too many colors selected"),
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
    const validatedData = colorSchemeSchema.parse(body);

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

    // Validate selected colors belong to vendor
    if (validatedData.selectedColors.length > 0) {
      const validColors = await prisma.color.findMany({
        where: {
          id: { in: validatedData.selectedColors },
          vendorId: event.vendorId,
        },
      });

      if (validColors.length !== validatedData.selectedColors.length) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_COLORS",
              message: "Some colors do not belong to this vendor",
            },
          },
          { status: 400 }
        );
      }
    }

    // Update event with color scheme
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        colorScheme: validatedData.colorScheme,
        lastAutoSavedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create or update EventDesign with selected colors
    await prisma.eventDesign.upsert({
      where: { eventId: eventId },
      update: {
        eventColors: validatedData.selectedColors,
      },
      create: {
        eventId: eventId,
        eventTypeId: event.eventTypeId || 1, // Default event type if none
        eventColors: validatedData.selectedColors,
        designCost: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        eventId: updatedEvent.id,
        updatedAt: updatedEvent.updatedAt.toISOString(),
        colorScheme: validatedData.colorScheme,
        selectedColors: validatedData.selectedColors,
      },
      message: "Colors updated successfully",
    });
  } catch (error) {
    console.error("Error updating colors:", error);

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
        error: { code: "INTERNAL_ERROR", message: "Failed to update colors" },
      },
      { status: 500 }
    );
  }
}
