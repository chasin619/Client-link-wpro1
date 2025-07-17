import { OnboardWizard } from '@/components/onboarding/onboard-wizard';
import { getVendorBySlug } from '@/lib/queries';
import { notFound } from 'next/navigation';

interface OnboardPageProps {
    params: { vendor: string };
}

export async function generateMetadata({ params }: { params: { vendor: string } }) {
    const vendor = await getVendorBySlug(params.vendor);

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
    // Verify vendor exists
    const vendor = await getVendorBySlug(params.vendor);

    if (!vendor) {
        notFound();
    }

    return (
        <div>
            <OnboardWizard vendorSlug={params.vendor} />
        </div>
    );
}