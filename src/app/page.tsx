import { notFound } from 'next/navigation';
import { HeroSection } from '@/components/vendor/hero-section';
import { ServicesGrid } from '@/components/vendor/services-grid';
import { PortfolioGallery } from '@/components/vendor/portfolio-gallery';
import { getVendorBySlug } from '@/lib/queries';

interface VendorPageProps {
  params: Promise<{ vendor: string }>;
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { vendor: vendorSlug } = await params;
  const vendor = await getVendorBySlug(vendorSlug);

  if (!vendor) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <HeroSection vendor={vendor} />
      <ServicesGrid />
      <PortfolioGallery />
    </main>
  );
}