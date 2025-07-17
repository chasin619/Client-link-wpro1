import { ThemeProvider } from '@/providers/theme-provider';
import { ReactQueryProvider } from '@/providers/query-provider';
import { use } from 'react';

interface OnboardLayoutProps {
    children: React.ReactNode;
    params: Promise<{ vendor: string }>;
}

export default function OnboardLayout({ children, params }: OnboardLayoutProps) {
    const { vendor } = use(params);

    return (
        <ThemeProvider vendorSlug={vendor} context="onboarding">
            <ReactQueryProvider>
                <div className="min-h-screen bg-background">
                    {children}
                </div>
            </ReactQueryProvider>
        </ThemeProvider>
    );
}