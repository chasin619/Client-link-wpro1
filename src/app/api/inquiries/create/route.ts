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
  groomName: z.string().optional(), // Made optional
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventType: z.string().optional(), // Made optional
  eventDate: z.string().min(1, "Please select an event date"),
  location: z.string().optional(), // Made optional
  guestCount: z.string().optional(), // Made optional
  vendorId: z.number().int().positive("Vendor ID is required"),
  referredBy: z.string().optional(),
  message: z.string().optional(),
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
      message,
    } = validatedData;

    // Handle optional guestCount with default value
    const guestCountNumber = guestCount ? parseInt(guestCount) : 0;
    console.log(guestCountNumber);

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
          name: brideName, // Using brideName as default name
          phone,
          password: phone, // Using phone as password
        },
      });
    }

    // Step 3: Handle optional eventType - find or create
    let eventTypeRecord;
    const eventTypeName = eventType || "General Inquiry"; // Default event type

    eventTypeRecord = await prisma.eventType.findFirst({
      where: {
        name: eventTypeName,
        vendorId: vendorId,
      },
    });

    if (!eventTypeRecord) {
      eventTypeRecord = await prisma.eventType.create({
        data: {
          name: eventTypeName,
          vendorId: vendorId,
          isShared: false,
        },
      });
    }

    const event = await prisma.event.create({
      data: {
        clientId: client.id,
        vendorId,
        eventTypeId: eventTypeRecord.id,
        weddingDate: new Date(eventDate),
        brideName,
        groomName: groomName || "",
        location: location || "TBD",
        NumberOfGuests: guestCountNumber,
        referredBy: referredBy || null,
        status: "Inquiry",
        setupPriceId: 1,
        breakdownPriceId: 1,
        transferPriceId: 1,
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

    // Step 5: Apply default design template if available
    let defaultTemplate = await prisma.designTemplate.findFirst({
      where: {
        vendorId: vendorId,
        isDefault: true,
      },
      include: {
        slots: true,
      },
    });

    if (!defaultTemplate) {
      defaultTemplate = await prisma.designTemplate.findFirst({
        where: {
          isShared: true,
          isDefault: true,
        },
        include: {
          slots: true,
        },
      });
    }

    if (defaultTemplate && defaultTemplate.slots.length > 0) {
      await prisma.eventArrangement.createMany({
        data: defaultTemplate.slots.map((slot) => ({
          eventId: event.id,
          section: slot.section,
          slotNo: slot.slotNo,
          slotName: slot.slotName,
          arrangementId: slot.arrangementId,
          defaultArrangementType: slot.defaultArrangementType,
          quantity: 1,
        })),
      });

      console.log(
        `✅ Applied default template "${defaultTemplate.name}" with ${defaultTemplate.slots.length} slots to inquiry ${event.id}`
      );
    } else {
      console.log(
        `⚠️  No default design template found for vendor ${vendorId}`
      );
    }

    // Step 6: Create vendor-client relationship
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

    // Step 7: Create chat

    await prisma.chat.create({
      data: {
        vendorId: vendor.id,
        clientId: client.id,
        isActive: true,
        lastMessageAt: new Date(),
      },
    });

    // Step 8: Send beautiful emails using your nodemailer function
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
          clientName: client.name || brideName,
          vendorName: vendor.business_name,
          email: client.email,
          password: phone,
          eventDate: eventDateFormatted,
          eventType: eventTypeName,
          location: location || "TBD",
          guestCount: guestCountNumber,
          inquiryId: event.id,
          brideName,
          groomName: groomName || "",
          // Add the new parameters for auto-login URL
          eventId: event.id.toString(),
          vendorId: vendor.id.toString(),
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
          clientName: client.name || brideName,
          clientEmail: client.email,
          clientPhone: phone,
          eventDate: eventDateFormatted,
          eventType: eventTypeName,
          location: location || "",
          guestCount: guestCountNumber || 0,
          inquiryId: event.id,
          brideName,
          groomName: groomName || "",
          // Add the new parameters for client login URL
          eventId: event.id.toString(),
          vendorId: vendor.id.toString(),
        });

        await sendEmailEvent(
          vendor.business_email,
          `🎉 New Wedding Inquiry #${event.id
            .toString()
            .padStart(6, "0")} - ${brideName}${
            groomName ? ` & ${groomName}` : ""
          }`,
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
          designSlotsCreated: defaultTemplate?.slots.length || 0,
          // Add auto-login URL to response for reference
          clientLoginUrl: `https://client.wpro.ai/?email=${encodeURIComponent(
            client.email
          )}&phone=${encodeURIComponent(phone)}&id=${event.id}&vendorId=${
            vendor.id
          }`,
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
