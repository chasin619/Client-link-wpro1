import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Vendor slug is required",
        },
        { status: 400 }
      );
    }

    console.log("Looking for vendor with slug:", slug);

    const vendor = await prisma.vendorUser.findFirst({
      where: {
        OR: [
          {
            business_name: {
              equals: slug.replace(/-/g, " "),
              mode: "insensitive",
            },
          },
          {
            business_name: {
              contains: slug,
              mode: "insensitive",
            },
          },
        ],
        status: "active",
      },
      select: {
        id: true,
        business_name: true,
        business_email: true,
        phone: true,
        business_address: true,
        website: true,
        status: true,
        full_name: true,
      },
    });

    console.log("Found vendor:", vendor);

    if (!vendor) {
      return NextResponse.json(
        {
          success: false,
          message: `Vendor with slug "${slug}" not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vendor: {
        id: vendor.id,
        business_name: vendor.business_name,
        business_email: vendor.business_email,
        phone: vendor.phone,
        business_address: vendor.business_address,
        website: vendor.website,
        status: vendor.status,
        heroTitle: vendor.business_name,
        heroSubtitle: `Creating beautiful floral arrangements for your special occasions`,
        heroImage: "/hero-florist.jpg",
      },
    });
  } catch (error) {
    console.error("Error fetching vendor by slug:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
