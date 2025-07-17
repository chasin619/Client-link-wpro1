import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/providers/theme-provider';
import { Footer } from '@/components/layout/footer';
import { getVendorBySlug } from '@/lib/queries';

interface VendorLayoutProps {
    children: React.ReactNode;
    params: Promise<{ vendor: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ vendor: string }> }) {
    const { vendor: vendorSlug } = await params;
    const vendor = await getVendorBySlug(vendorSlug);

    if (!vendor) return {};

    return {
        title: `${vendor.business_name} - Wedding Florist`,
        description: `Beautiful wedding arrangements and floral design by ${vendor.business_name}`,
        openGraph: {
            title: `${vendor.business_name} - Wedding Florist`,
            description: `Professional wedding florals and arrangements`,
            images: [vendor.heroImage || '/default-hero.jpg'],
        },
    };
}

export default async function VendorLayout({ children, params }: VendorLayoutProps) {
    const { vendor: vendorSlug } = await params;
    const vendor = await getVendorBySlug(vendorSlug);

    if (!vendor) {
        notFound();
    }

    return (
        <ThemeProvider vendorSlug={vendorSlug} context="landing">
            <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                    {children}
                </main>
                <Footer vendor={vendor} />
            </div>
        </ThemeProvider>
    );
}