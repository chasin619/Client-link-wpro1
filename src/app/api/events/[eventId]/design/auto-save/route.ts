import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;

  if (!eventId || isNaN(Number(eventId))) {
    return NextResponse.json(
      { error: "Valid eventId is required" },
      { status: 400 }
    );
  }

  const eventIdNum = Number(eventId);

  try {
    const { designId, eventTypeId, eventColors, designCost } =
      await request.json();

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventIdNum },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    let eventDesign;

    if (designId) {
      // Update existing design
      eventDesign = await prisma.eventDesign.update({
        where: { id: Number(designId) },
        data: {
          ...(eventTypeId && { eventTypeId: Number(eventTypeId) }),
          ...(eventColors && { eventColors }),
          ...(designCost !== undefined && { designCost: Number(designCost) }),
        },
        include: {
          eventType: { select: { id: true, name: true } },
        },
      });
    } else {
      // Create new design or upsert if there's only one design per event
      eventDesign = await prisma.eventDesign.upsert({
        where: {
          // Using a composite unique constraint if you want only one design per event
          eventId_eventTypeId: {
            eventId: eventIdNum,
            eventTypeId: Number(eventTypeId),
          },
        },
        update: {
          eventColors,
          designCost: Number(designCost),
        },
        create: {
          eventId: eventIdNum,
          eventTypeId: Number(eventTypeId),
          eventColors,
          designCost: Number(designCost),
        },
        include: {
          eventType: { select: { id: true, name: true } },
        },
      });
    }

    return NextResponse.json({
      success: true,
      design: eventDesign,
      message: "Design auto-saved successfully",
    });
  } catch (error) {
    console.error("Error auto-saving event design:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
