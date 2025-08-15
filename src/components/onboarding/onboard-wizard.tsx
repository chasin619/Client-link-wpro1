'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useTheme } from '@/hooks/use-theme';
import { useVendorBySlug } from '@/hooks/useVendor';
import { AutoSaveIndicator } from './auto-save-indicator';
import { PersonalDetailsStep } from './steps/personal-details';
import { ExpressContactStep } from '../onboarding/express-form';
import { InquiryConfirmation } from './inquiry-confirmation';
import { Flower2, AlertCircle, Zap, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OnboardWizardProps {
    vendorSlug: string;
}

export function OnboardWizard({ vendorSlug }: OnboardWizardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { data, setSessionId, setVendorSlug, markCompleted, clearData } = useOnboardingStore();
    const { currentTheme, isLoading: themeLoading } = useTheme();

    const isExpressForm = pathname.endsWith('/express');

    const {
        data: vendorData,
        isLoading: isVendorLoading,
        error: vendorError
    } = useVendorBySlug(vendorSlug);

    const [sessionId, setSessionIdState] = useState<string>('');
    const [showInquiryConfirmation, setShowInquiryConfirmation] = useState(false);
    const [inquiryCreated, setInquiryCreated] = useState(false);
    const [hasShownConfirmation, setHasShownConfirmation] = useState(false);

    useEffect(() => {
        const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionIdState(id);
        setSessionId(id);
        setVendorSlug(vendorSlug);
    }, [vendorSlug, setSessionId, setVendorSlug]);

    const { isSaving, lastSavedAt, saveError } = useAutoSave({
        vendorSlug,
        sessionId,
        enabled: false,
    });

    useEffect(() => {
        if (data.inquiryId) {
            setInquiryCreated(true);
        }
    }, [data.inquiryId]);

    const handleInquiryCreated = (inquiryId: number) => {
        setInquiryCreated(true);
        if (!hasShownConfirmation) {
            setShowInquiryConfirmation(true);
            setHasShownConfirmation(true);
        }
    };

    const handleSubmit = async () => {
        if (!inquiryCreated && !data.inquiryId) {
            return;
        }

        if ((inquiryCreated || data.inquiryId) && !hasShownConfirmation) {
            setShowInquiryConfirmation(true);
            setHasShownConfirmation(true);
            return;
        }
        // localStorage.clear()

        markCompleted();
        clearData();
        router.push(`https://client.wpro.ai?email=${data.email}&password=${data.phone}`);
    };

    const handleContinueFromInquiry = () => {
        setShowInquiryConfirmation(false);
        markCompleted();

        const email = data.email;
        const phone = data.phone;
        // localStorage.clear()
        clearData();
        router.push(`https://client.wpro.ai?email=${email}&password=${phone}`);
    };

    const renderCurrentStep = () => {
        if (isVendorLoading) {
            return <div className="text-center py-8">Loading vendor information...</div>;
        }

        if (vendorError || !vendorData?.vendor) {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Unable to load vendor information. Please try refreshing the page.
                    </AlertDescription>
                </Alert>
            );
        }

        if (isExpressForm) {
            return (
                <ExpressContactStep
                    vendorSlug={vendorSlug}
                    onInquiryCreated={handleInquiryCreated}
                />
            );
        }

        return (
            <PersonalDetailsStep
                vendorSlug={vendorSlug}
                onInquiryCreated={handleInquiryCreated}
            />
        );
    };

    const formInfo = isExpressForm
        ? { title: 'Express Contact', description: 'Quick and easy way to get in touch', icon: Zap }
        : { title: 'Personal & Event Details', description: 'Tell us about your special day', icon: FileText };

    if (themeLoading || isVendorLoading) {
        return <OnboardingWizardSkeleton />;
    }

    if (vendorError) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-6">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Unable to find vendor information for "{vendorSlug}".
                                Please check the URL and try again.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                                <Flower2 className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1
                                    className="text-xl font-bold"
                                    style={{ fontFamily: currentTheme.fonts.heading }}
                                >
                                    {vendorData?.vendor?.business_name || 'Wedding Planning'}
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    {formInfo.description}
                                </p>
                            </div>
                        </div>

                        <AutoSaveIndicator
                            isSaving={isSaving}
                            lastSavedAt={lastSavedAt}
                            error={saveError}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-4">
                <Card className="theme-card">


                    <CardContent className="p-4">
                        {renderCurrentStep()}

                        {!isExpressForm && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        !(inquiryCreated || data.inquiryId) ||
                                        showInquiryConfirmation ||
                                        !canProgressFromStep(data)
                                    }
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                    Submit Inquiry
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {showInquiryConfirmation && (
                <InquiryConfirmation
                    vendorSlug={vendorSlug}
                    onContinue={handleContinueFromInquiry}
                    onSkipToReview={() => handleContinueFromInquiry()}
                />
            )}
        </div>
    );
}

function canProgressFromStep(data: any): boolean {
    return !!(data.email && (data.brideName || data.fullName));
}

function OnboardingWizardSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                            <div className="space-y-1">
                                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                            </div>
                        </div>
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-4">
                <div className="h-80 bg-muted animate-pulse rounded-lg" />
            </div>
        </div>
    );
}