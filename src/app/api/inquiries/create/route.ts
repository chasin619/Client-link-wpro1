import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmailEvent } from "@/lib/eventEmail";
import {
  generateClientWelcomeEmail,
  generateVendorNotificationEmail,
} from "@/lib/emailTemplates";

const inquirySchema = z.object({
  brideName: z.string().min(2, "Bride name must be at least 2 characters"),
  groomName: z.string().min(2, "Partner name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Please select an event date"),
  location: z.string().min(2, "Please enter the event location"),
  guestCount: z.string().min(1, "Please select estimated guest count"),
  vendorId: z.number().int().positive("Vendor ID is required"),
  referredBy: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = inquirySchema.parse(body);

    const {
      brideName,
      groomName,
      email,
      phone,
      eventType,
      eventDate,
      location,
      guestCount,
      vendorId,
      referredBy,
    } = validatedData;

    const guestCountNumber = parseInt(guestCount.split("-")[0]);

    // Step 1: Check if vendor exists
    const vendor = await prisma.vendorUser.findUnique({
      where: { id: vendorId },
      select: {
        id: true,
        business_name: true,
        business_email: true,
        full_name: true,
      },
    });

    if (!vendor) {
      return NextResponse.json(
        {
          success: false,
          message: "Vendor not found",
        },
        { status: 404 }
      );
    }

    // Step 2: Find or create client
    let client = await prisma.clientUser.findUnique({
      where: { email },
    });

    let isNewClient = false;
    if (!client) {
      isNewClient = true;
      client = await prisma.clientUser.create({
        data: {
          email,
          name: `${brideName} & ${groomName}`,
          phone,
          password: phone, // Using phone as password
        },
      });
    }

    // Step 3: Find or create event type
    let eventTypeRecord = await prisma.eventType.findFirst({
      where: {
        name: eventType,
        vendorId: vendorId,
      },
    });

    if (!eventTypeRecord) {
      eventTypeRecord = await prisma.eventType.create({
        data: {
          name: eventType,
          vendorId: vendorId,
          isShared: false,
        },
      });
    }

    // Step 4: Create event/inquiry
    const event = await prisma.event.create({
      data: {
        clientId: client.id,
        vendorId,
        eventTypeId: eventTypeRecord.id,
        weddingDate: new Date(eventDate),
        brideName,
        groomName,
        location,
        NumberOfGuests: guestCountNumber,
        referredBy: referredBy || null,
        status: "Inquiry",
      },
      include: {
        client: {
          select: { id: true, email: true, name: true, phone: true },
        },
        vendor: {
          select: {
            id: true,
            business_name: true,
            business_email: true,
            full_name: true,
          },
        },
        eventType: {
          select: { id: true, name: true },
        },
      },
    });

    // Step 5: Create vendor-client relationship
    await prisma.vendorClient.upsert({
      where: {
        vendorId_clientId: {
          vendorId,
          clientId: client.id,
        },
      },
      update: {},
      create: {
        vendorId,
        clientId: client.id,
      },
    });

    // Step 6: Create chat room
    await prisma.chat.upsert({
      where: {
        vendorId_clientId: {
          vendorId,
          clientId: client.id,
        },
      },
      update: {
        isActive: true,
        updatedAt: new Date(),
        lastMessageAt: new Date(),
      },
      create: {
        vendorId,
        clientId: client.id,
        isActive: true,
        lastMessageAt: new Date(),
      },
    });

    // Step 7: Send beautiful emails using your nodemailer function
    const eventDateFormatted = new Date(eventDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let emailsSent = {
      clientEmail: false,
      vendorEmail: false,
    };

    // Send welcome email to client
    if (vendor.business_email) {
      try {
        const clientEmailContent = generateClientWelcomeEmail({
          clientName: client.name || `${brideName} & ${groomName}`,
          vendorName: vendor.business_name,
          email: client.email,
          password: phone,
          eventDate: eventDateFormatted,
          eventType,
          location,
          guestCount: guestCountNumber,
          inquiryId: event.id,
          brideName,
          groomName,
        });

        await sendEmailEvent(
          client.email,
          "🌸 Welcome! Your Wedding Inquiry Has Been Submitted",
          clientEmailContent,
          `${vendor.business_name} <${vendor.business_email}>`
        );

        emailsSent.clientEmail = true;
        console.log(`✅ Welcome email sent to client: ${client.email}`);
      } catch (emailError) {
        console.error("❌ Error sending client welcome email:", emailError);
        // Continue execution even if email fails
      }

      // Send notification email to vendor
      try {
        const vendorEmailContent = generateVendorNotificationEmail({
          vendorName: vendor.business_name,
          clientName: client.name || `${brideName} & ${groomName}`,
          clientEmail: client.email,
          clientPhone: phone,
          eventDate: eventDateFormatted,
          eventType,
          location,
          guestCount: guestCountNumber,
          inquiryId: event.id,
          brideName,
          groomName,
        });

        await sendEmailEvent(
          vendor.business_email,
          `🎉 New Wedding Inquiry #${event.id
            .toString()
            .padStart(6, "0")} - ${brideName} & ${groomName}`,
          vendorEmailContent,
          `wpro.ai Notifications <noreply@wpro.ai>`
        );

        emailsSent.vendorEmail = true;
        console.log(
          `✅ Notification email sent to vendor: ${vendor.business_email}`
        );
      } catch (emailError) {
        console.error(
          "❌ Error sending vendor notification email:",
          emailError
        );
        // Continue execution even if email fails
      }
    }

    // Return success response with email status
    return NextResponse.json(
      {
        success: true,
        message:
          "Inquiry created successfully! " +
          (emailsSent.clientEmail && emailsSent.vendorEmail
            ? "Confirmation emails have been sent to both parties."
            : emailsSent.clientEmail
            ? "Welcome email sent to client."
            : emailsSent.vendorEmail
            ? "Notification sent to vendor."
            : "Inquiry created but emails could not be sent."),
        data: {
          inquiryId: event.id,
          clientId: client.id,
          vendorId: vendor.id,
          eventDate: event.weddingDate,
          status: event.status,
          guestCount: event.NumberOfGuests,
          inquiryNumber: `INQ-${event.id.toString().padStart(6, "0")}`,
          isNewClient,
          emailStatus: emailsSent,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating inquiry:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
