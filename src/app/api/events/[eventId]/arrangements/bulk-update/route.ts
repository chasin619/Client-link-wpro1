// app/api/events/[eventId]/arrangements/bulk-update/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;
    const { updates } = await request.json();

    if (!eventId || isNaN(Number(eventId))) {
      return NextResponse.json(
        { error: "Valid eventId is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "updates must be an array" },
        { status: 400 }
      );
    }

    const eventIdNum = Number(eventId);
    console.log(eventIdNum);

    const event = await prisma.event.findUnique({
      where: { id: eventIdNum },
    });
    console.log(event);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Process updates in transaction
    const results = await prisma.$transaction(async (tx) => {
      const results = [];

      for (const update of updates) {
        const {
          arrangementId,
          section,
          slotNo,
          quantity,
          action = "upsert", // 'upsert' or 'delete'
        } = update;

        if (action === "delete") {
          await tx.eventArrangement.deleteMany({
            where: {
              eventId: eventIdNum,
              arrangementId: Number(arrangementId),
              section,
              ...(slotNo && { slotNo: Number(slotNo) }),
            },
          });
          results.push({ action: "deleted", arrangementId, section });
        } else {
          const result = await tx.eventArrangement.upsert({
            where: {
              eventId_section_slotNo: {
                eventId: eventIdNum,
                section,
                slotNo: slotNo || 1,
              },
            },
            update: {
              arrangementId: Number(arrangementId),
              quantity: quantity || 1,
            },
            create: {
              eventId: eventIdNum,
              arrangementId: Number(arrangementId),
              section,
              slotNo: slotNo || 1,
              quantity: quantity || 1,
            },
          });
          results.push({ action: "upserted", ...result });
        }
      }

      return results;
    });

    return NextResponse.json({
      success: true,
      results,
      message: `${results.length} updates processed successfully`,
    });
  } catch (error) {
    console.error("Error bulk updating arrangements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
