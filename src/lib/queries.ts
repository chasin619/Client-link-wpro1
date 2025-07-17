export async function getVendorBySlug(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const businessName = slug?.replace(/-/g, " ");

  return {
    id: 1,
    business_name: businessName,
    business_email: "contact@rosesanddreams.com",
    phone: "(555) 123-4567",
    business_address: "Beverly Hills, CA",
    heroTitle: "Roses & Dreams Florals",
    heroSubtitle:
      "Creating enchanting floral experiences that tell your love story through the language of flowers",
    heroImage: "/hero-florist.jpg",
  };
}
