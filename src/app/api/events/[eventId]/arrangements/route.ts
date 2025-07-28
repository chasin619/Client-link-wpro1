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
    // Verify event exists and get client/vendor info for authorization
    const event = await prisma.event.findUnique({
      where: { id: eventIdNum },
      include: {
        arrangements: {
          include: {
            arrangement: {
              include: {
                type: true,
                colors: true,
                ArrangementIngredient: {
                  include: {
                    flower: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Calculate totals
    const totalEstimatedCost = event.arrangements.reduce((total, ea) => {
      if (ea.arrangement) {
        return total + ea.arrangement.price * (ea.quantity || 1);
      }
      return total;
    }, 0);

    // Group by section
    const groupedArrangements = {
      Personal: event.arrangements.filter((ea) => ea.section === "Personal"),
      Ceremony: event.arrangements.filter((ea) => ea.section === "Ceremony"),
      Reception: event.arrangements.filter((ea) => ea.section === "Reception"),
      Suggestion: event.arrangements.filter(
        (ea) => ea.section === "Suggestion"
      ),
    };

    return NextResponse.json({
      eventId: event.id,
      totalEstimatedCost,
      arrangements: event.arrangements,
      groupedArrangements,
      event: {
        id: event.id,
        clientId: event.clientId,
        vendorId: event.vendorId,
        status: event.status,
      },
    });
  } catch (error) {
    console.error("Error fetching event arrangements:", error);
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
    const { arrangements } = await request.json();

    if (!Array.isArray(arrangements)) {
      return NextResponse.json(
        { error: "arrangements must be an array" },
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

    // Process each arrangement
    const results = [];

    for (const arr of arrangements) {
      const {
        arrangementId,
        section,
        slotName,
        slotNo,
        quantity,
        defaultArrangementType,
      } = arr;

      // Validate required fields
      if (!arrangementId || !section) {
        continue; // Skip invalid entries
      }

      // Upsert arrangement
      const eventArrangement = await prisma.eventArrangement.upsert({
        where: {
          eventId_section_slotNo: {
            eventId: eventIdNum,
            section: section,
            slotNo: slotNo || 1,
          },
        },
        update: {
          arrangementId,
          quantity: quantity || 1,
          slotName,
          defaultArrangementType,
        },
        create: {
          eventId: eventIdNum,
          arrangementId,
          section,
          slotName,
          slotNo: slotNo || 1,
          quantity: quantity || 1,
          defaultArrangementType,
        },
        include: {
          arrangement: {
            include: {
              type: true,
              colors: true,
            },
          },
        },
      });

      results.push(eventArrangement);
    }

    // Calculate updated total
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventIdNum },
      include: {
        arrangements: {
          include: {
            arrangement: true,
          },
        },
      },
    });

    const totalEstimatedCost =
      updatedEvent?.arrangements.reduce((total, ea) => {
        if (ea.arrangement) {
          return total + ea.arrangement.price * (ea.quantity || 1);
        }
        return total;
      }, 0) || 0;

    return NextResponse.json({
      success: true,
      arrangements: results,
      totalEstimatedCost,
      message: `${results.length} arrangements saved successfully`,
    });
  } catch (error) {
    console.error("Error saving arrangements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const { arrangementId, section, slotNo } = await request.json();

    if (!arrangementId || !section) {
      return NextResponse.json(
        { error: "arrangementId and section are required" },
        { status: 400 }
      );
    }

    await prisma.eventArrangement.deleteMany({
      where: {
        eventId: eventIdNum,
        arrangementId: Number(arrangementId),
        section,
        ...(slotNo && { slotNo: Number(slotNo) }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Arrangement removed successfully",
    });
  } catch (error) {
    console.error("Error deleting arrangement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
