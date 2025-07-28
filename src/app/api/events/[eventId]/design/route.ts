// app/api/events/[eventId]/design/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
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
    const eventDesigns = await prisma.eventDesign.findMany({
      where: { eventId: eventIdNum },
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
      orderBy: { id: "desc" },
    });

    const totalDesignCost = eventDesigns.reduce(
      (total, design) => total + design.designCost,
      0
    );

    return NextResponse.json({
      eventId: eventIdNum,
      designs: eventDesigns,
      totalDesignCost,
      count: eventDesigns.length,
    });
  } catch (error) {
    console.error("Error fetching event designs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const { eventTypeId, eventColors, designCost } = await request.json();

    // Validate required fields
    if (!eventTypeId || !eventColors || designCost === undefined) {
      return NextResponse.json(
        { error: "eventTypeId, eventColors, and designCost are required" },
        { status: 400 }
      );
    }

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventIdNum },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Verify eventType exists
    const eventType = await prisma.eventType.findUnique({
      where: { id: Number(eventTypeId) },
    });

    if (!eventType) {
      return NextResponse.json(
        { error: "Event type not found" },
        { status: 404 }
      );
    }

    // Create new design
    const eventDesign = await prisma.eventDesign.create({
      data: {
        eventId: eventIdNum,
        eventTypeId: Number(eventTypeId),
        eventColors: eventColors,
        designCost: Number(designCost),
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

    return NextResponse.json({
      success: true,
      design: eventDesign,
      message: "Event design created successfully",
    });
  } catch (error) {
    console.error("Error creating event design:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
