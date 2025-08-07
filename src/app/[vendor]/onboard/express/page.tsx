import { OnboardWizard } from '@/components/onboarding/onboard-wizard';
import { getVendorBySlug } from '@/lib/queries';
import { notFound } from 'next/navigation';

interface OnboardPageProps {
    params: Promise<{ vendor: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ vendor: string }> }) {
    const { vendor: vendorSlug } = await params;
    const vendor = await getVendorBySlug(vendorSlug);

    if (!vendor) return {};

    return {
        title: `Wedding Planning - ${vendor.business_name}`,
        description: `Plan your perfect wedding with ${vendor.business_name}. Share your vision and get a customized floral proposal.`,
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function OnboardPage({ params }: OnboardPageProps) {
    const { vendor: vendorSlug } = await params;
    // Verify vendor exists
    const vendor = await getVendorBySlug(vendorSlug);

    if (!vendor) {
        notFound();
    }

    return (
        <div>
            <OnboardWizard vendorSlug={vendorSlug} />
        </div>
    );
}