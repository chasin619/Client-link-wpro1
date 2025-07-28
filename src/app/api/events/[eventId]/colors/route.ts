import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;

  if (!eventId || isNaN(Number(eventId))) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Valid eventId is required" },
      },
      { status: 400 }
    );
  }

  const eventIdNum = Number(eventId);

  try {
    const { colorScheme, selectedColors } = await request.json();

    // Validate required fields
    if (!colorScheme) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "colorScheme is required" },
        },
        { status: 400 }
      );
    }

    // Validate colorScheme structure
    const { primary, secondary, accent } = colorScheme;
    if (
      !Array.isArray(primary) ||
      !Array.isArray(secondary) ||
      !Array.isArray(accent)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "colorScheme must contain primary, secondary, and accent arrays",
          },
        },
        { status: 400 }
      );
    }

    console.log(eventIdNum);
    const event = await prisma.event.findUnique({
      where: { id: eventIdNum },
      select: { id: true, vendorId: true },
    });
    console.log(event);

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Event not found" },
        },
        { status: 404 }
      );
    }

    const existingDesign = await prisma.eventDesign.findFirst({
      where: { eventId: eventIdNum },
      orderBy: { id: "desc" }, // Get the most recent design
    });

    let eventDesign;

    if (existingDesign) {
      // Update existing design with new colors
      eventDesign = await prisma.eventDesign.update({
        where: { id: existingDesign.id },
        data: {
          eventColors: colorScheme,
        },
        include: {
          event: {
            select: {
              id: true,
              clientId: true,
              vendorId: true,
              status: true,
            },
          },
          eventType: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } else {
      // Create a new EventDesign if none exists
      try {
        // First, let's get a default event type - you might want to adjust this logic
        const defaultEventType = await prisma.eventType.findFirst({
          orderBy: { id: "asc" }, // Get the first event type as default
        });

        if (!defaultEventType) {
          return NextResponse.json(
            {
              success: false,
              error: {
                message:
                  "No event types available. Please create an event type first.",
              },
            },
            { status: 400 }
          );
        }

        eventDesign = await prisma.eventDesign.create({
          data: {
            eventId: eventIdNum,
            eventTypeId: defaultEventType.id,
            eventColors: colorScheme,
            designCost: 0.0,
          },
          include: {
            event: {
              select: {
                id: true,
                clientId: true,
                vendorId: true,
                status: true,
              },
            },
            eventType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      } catch (createError) {
        console.error("Error creating event design:", createError);
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Failed to create event design. Please try again.",
            },
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        eventId: eventIdNum,
        updatedAt: new Date().toISOString(),
        colorScheme: eventDesign.eventColors,
        selectedColors: selectedColors || [],
        designId: eventDesign.id,
        isNewDesign: !existingDesign, // Flag to indicate if this is a newly created design
      },
      message: existingDesign
        ? "Colors updated successfully"
        : "Event design created and colors saved successfully",
    });
  } catch (error) {
    console.error("Error updating event colors:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve current colors
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;

  if (!eventId || isNaN(Number(eventId))) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Valid eventId is required" },
      },
      { status: 400 }
    );
  }

  const eventIdNum = Number(eventId);

  try {
    // Get the most recent design for this event
    const eventDesign = await prisma.eventDesign.findFirst({
      where: { eventId: eventIdNum },
      orderBy: { id: "desc" },
      select: {
        id: true,
        eventColors: true,
        eventId: true,
        eventTypeId: true,
      },
    });

    if (!eventDesign) {
      // Return empty color scheme if no design exists yet
      return NextResponse.json({
        success: true,
        data: {
          eventId: eventIdNum,
          colorScheme: {
            primary: [],
            secondary: [],
            accent: [],
          },
          selectedColors: [],
          designId: null,
        },
      });
    }

    // Extract selected colors from the colorScheme
    const colorScheme = eventDesign.eventColors as any;
    const selectedColors = [
      ...(colorScheme?.primary || []),
      ...(colorScheme?.secondary || []),
      ...(colorScheme?.accent || []),
    ];

    // Remove duplicates
    const uniqueSelectedColors = [...new Set(selectedColors)];

    return NextResponse.json({
      success: true,
      data: {
        eventId: eventIdNum,
        colorScheme: eventDesign.eventColors,
        selectedColors: uniqueSelectedColors,
        designId: eventDesign.id,
      },
    });
  } catch (error) {
    console.error("Error fetching event colors:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}
