// lib/vendor.ts
import { prisma } from "@/lib/prisma";

export interface VendorData {
  id: number;
  business_name: string;
  business_email: string;
  phone: string;
  business_address: string;
  website: string;
  status: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}

export async function getVendorBySlug(
  slug: string
): Promise<VendorData | null> {
  if (!slug) {
    return null;
  }

  try {
    const businessName = slug.replace(/-/g, " ");

    const vendor = await prisma.vendorUser.findFirst({
      where: {
        OR: [
          {
            business_name: {
              equals: businessName,
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

    if (!vendor) {
      return null;
    }

    return {
      id: vendor.id,
      business_name: vendor.business_name,
      business_email: vendor.business_email,
      phone: vendor.phone,
      business_address: vendor.business_address,
      website: vendor.website,
      status: vendor.status,
      // Computed hero section data
      heroTitle: vendor.business_name,
      heroSubtitle: `Creating beautiful floral arrangements for your special occasions`,
      heroImage: "/hero-florist.jpg", // Default image, you can add this to schema later
    };
  } catch (error) {
    console.error("Error fetching vendor by slug:", error);
    return null;
  }
}
