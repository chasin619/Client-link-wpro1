import { QuickOnboardWizard } from '@/components/onboarding/quick-onboard-wizard';
import { notFound } from 'next/navigation';
import { getVendorBySlug } from '@/lib/queries';

interface QuickOnboardPageProps {
    params: Promise<{ vendor: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ vendor: string }> }) {
    const { vendor: vendorSlug } = await params;
    const vendor = await getVendorBySlug(vendorSlug);

    if (!vendor) return {};

    return {
        title: `Quick Inquiry - ${vendor.business_name}`,
        description: `Fast track your wedding planning inquiry with ${vendor.business_name}. Get a proposal in minutes.`,
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function QuickOnboardPage({ params }: QuickOnboardPageProps) {
    const { vendor: vendorSlug } = await params;
    const vendor = await getVendorBySlug(vendorSlug);

    if (!vendor) {
        notFound();
    }

    return (
        <div>
            <QuickOnboardWizard vendorSlug={vendorSlug} />
        </div>
    );
}