import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { uploadImageToS3 } from "@/lib/s3";
const inspirationSchema = z.object({
  imageUrls: z.array(z.string().url()).optional(),
});

export async function POST(
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

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        inspirations: true,
        vendor: true,
      },
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

    // Check inspiration limit
    if (event.inspirations.length >= 20) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "LIMIT_EXCEEDED",
            message: "Maximum 20 inspiration images allowed",
          },
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    const imageUrls = JSON.parse((formData.get("imageUrls") as string) || "[]");

    const validatedUrls = inspirationSchema.parse({ imageUrls });
    const createdInspirations = [];

    // Process uploaded files
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        continue; // Skip oversized files
      }

      if (!file.type.startsWith("image/")) {
        continue; // Skip non-image files
      }

      try {
        const uploadResult = await uploadImageToS3(
          file,
          `inspirations/${eventId}`
        );

        const inspiration = await prisma.inspiration.create({
          data: {
            eventId: eventId,
            imageUrl: uploadResult.url,
            uploadDate: new Date(),
          },
        });

        createdInspirations.push(inspiration);
      } catch (uploadError) {
        console.error("Failed to upload file:", uploadError);
        // Continue with other files
      }
    }

    // Process URL-based inspirations
    for (const url of validatedUrls.imageUrls || []) {
      const inspiration = await prisma.inspiration.create({
        data: {
          eventId: eventId,
          imageUrl: url,
          uploadDate: new Date(),
        },
      });

      createdInspirations.push(inspiration);
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        eventId: eventId,
        inspirations: createdInspirations,
        totalInspirations:
          event.inspirations.length + createdInspirations.length,
      },
      message: `${createdInspirations.length} inspiration images added successfully`,
    });
  } catch (error) {
    console.error("Error adding inspirations:", error);

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
          message: "Failed to add inspiration images",
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(
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

    const inspirations = await prisma.inspiration.findMany({
      where: { eventId: eventId },
      orderBy: { uploadDate: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: { inspirations },
      message: "Inspirations retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching inspirations:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch inspirations",
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = parseInt(params.eventId);
    const { searchParams } = new URL(request.url);
    const inspirationId = parseInt(searchParams.get("inspirationId") || "");

    if (isNaN(eventId) || isNaN(inspirationId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid event or inspiration ID",
          },
        },
        { status: 400 }
      );
    }

    const deleted = await prisma.inspiration.deleteMany({
      where: {
        id: inspirationId,
        eventId: eventId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Inspiration not found" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { deletedCount: deleted.count },
      message: "Inspiration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inspiration:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to delete inspiration",
        },
      },
      { status: 500 }
    );
  }
}
