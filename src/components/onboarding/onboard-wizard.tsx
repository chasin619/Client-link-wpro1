'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useTheme } from '@/hooks/use-theme';
import { AutoSaveIndicator } from './auto-save-indicator';
import { StepNavigation } from './step-navigation';
import { PersonalDetailsStep } from './steps/personal-details';
import { EventDetailsStep } from './steps/event-details';
import { ServiceSelectionStep } from './steps/service-selection';
import { DesignPreferencesStep } from './steps/design-preferences';
import { AdditionalInfoStep } from './steps/additional-info';
import { PreviewSummary } from './steps/preview-summary';
import { InquiryConfirmation } from './inquiry-confirmation';
import { Flower2, Sparkles } from 'lucide-react';

interface OnboardWizardProps {
    vendorSlug: string;
}

export function OnboardWizard({ vendorSlug }: OnboardWizardProps) {
    const router = useRouter();
    const { data, setSessionId, setVendorSlug, nextStep, prevStep, markCompleted, goToStep } = useOnboardingStore();
    const { currentTheme, isLoading: themeLoading } = useTheme();
    const [sessionId, setSessionIdState] = useState<string>('');
    const [showInquiryConfirmation, setShowInquiryConfirmation] = useState(false);

    // Generate session ID on mount
    useEffect(() => {
        const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionIdState(id);
        setSessionId(id);
        setVendorSlug(vendorSlug);
    }, [vendorSlug]);

    // Auto-save functionality
    const { isSaving, lastSavedAt, saveError } = useAutoSave({
        vendorSlug,
        sessionId,
        enabled: false,
    });

    const progress = (data.currentStep / data.totalSteps) * 100;

    const stepTitles = [
        'Personal Details',
        'Event Information',
        'Service Selection',
        'Design Preferences',
        'Additional Information',
        'Review & Submit'
    ];

    const handleNext = async () => {
        // Show inquiry confirmation after completing personal details
        if (data.currentStep === 1 && canProgressFromStep(1, data)) {
            setShowInquiryConfirmation(true);
            return;
        }

        if (data.currentStep < data.totalSteps) {
            if (data.currentStep === 6) {
                // Complete onboarding from preview
                markCompleted();
                router.push(`/${vendorSlug}/onboard/complete`);
            } else {
                nextStep();
            }
        }
    };

    const handlePrev = () => {
        if (showInquiryConfirmation) {
            setShowInquiryConfirmation(false);
            return;
        }

        if (data.currentStep > 1) {
            prevStep();
        }
    };

    const handleContinueFromInquiry = () => {
        setShowInquiryConfirmation(false);
        nextStep(); // Go to step 2
    };

    const handleSkipToReview = () => {
        setShowInquiryConfirmation(false);
        goToStep(6); // Jump directly to review
    };

    const renderCurrentStep = () => {
        if (showInquiryConfirmation) {
            return (
                <InquiryConfirmation
                    vendorSlug={vendorSlug}
                    onContinue={handleContinueFromInquiry}
                    onSkipToReview={handleSkipToReview}
                />
            );
        }

        switch (data.currentStep) {
            case 1:
                return <PersonalDetailsStep />;
            case 2:
                return <EventDetailsStep />;
            case 3:
                return <ServiceSelectionStep />;
            case 4:
                return <DesignPreferencesStep />;
            case 5:
                return <AdditionalInfoStep />;
            case 6:
                return <PreviewSummary vendorSlug={vendorSlug} />;
            default:
                return <PersonalDetailsStep />;
        }
    };

    if (themeLoading) {
        return <OnboardingWizardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                                <Flower2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1
                                    className="text-2xl font-bold theme-heading"
                                    style={{ fontFamily: currentTheme.fonts.heading }}
                                >
                                    Wedding Planning
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {showInquiryConfirmation
                                        ? "Your inquiry has been created!"
                                        : "Tell us about your special day"
                                    }
                                </p>
                            </div>
                        </div>

                        {!showInquiryConfirmation && (
                            <AutoSaveIndicator
                                isSaving={isSaving}
                                lastSavedAt={lastSavedAt}
                                error={saveError}
                            />
                        )}
                    </div>

                    {/* Progress - hide during inquiry confirmation */}
                    {!showInquiryConfirmation && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Step {data.currentStep} of {data.totalSteps}
                                </span>
                                <span
                                    className="font-medium"
                                    style={{ color: currentTheme.colors.primary }}
                                >
                                    {Math.round(progress)}% Complete
                                </span>
                            </div>
                            <Progress
                                value={progress}
                                className="h-2"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card
                    className="theme-card"
                    style={{ borderRadius: currentTheme.components.card.borderRadius }}
                >
                    {!showInquiryConfirmation && (
                        <CardHeader className="text-center border-b">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Sparkles
                                    className="h-5 w-5"
                                    style={{ color: currentTheme.colors.accent }}
                                />
                                <Badge
                                    variant="secondary"
                                    style={{
                                        backgroundColor: `${currentTheme.colors.primary}10`,
                                        color: currentTheme.colors.primary
                                    }}
                                >
                                    {stepTitles[data.currentStep - 1]}
                                </Badge>
                            </div>
                            <h2
                                className="text-3xl font-bold theme-heading"
                                style={{ fontFamily: currentTheme.fonts.heading }}
                            >
                                {getStepDescription(data.currentStep)}
                            </h2>
                        </CardHeader>
                    )}

                    <CardContent className="p-8">
                        <div className="animate-theme-fade-in">
                            {renderCurrentStep()}
                        </div>

                        {/* Only show navigation if not on preview step and not showing inquiry confirmation */}
                        {data.currentStep !== 6 && !showInquiryConfirmation && (
                            <StepNavigation
                                currentStep={data.currentStep}
                                totalSteps={data.totalSteps}
                                onNext={handleNext}
                                onPrev={handlePrev}
                                canProgress={canProgressFromStep(data.currentStep, data)}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function getStepDescription(step: number): string {
    switch (step) {
        case 1:
            return "Let's start with your basic information";
        case 2:
            return "Tell us about your special event";
        case 3:
            return "What floral services do you need?";
        case 4:
            return "Share your design vision with us";
        case 5:
            return "Just a few more details to finish";
        case 6:
            return "Review and submit your information";
        default:
            return "Wedding Planning Form";
    }
}

function canProgressFromStep(step: number, data: any): boolean {
    switch (step) {
        case 1:
            return !!(data.email && data.brideName);
        case 2:
        case 3:
        case 4:
        case 5:
            return true;
        case 6:
            return true;
        default:
            return true;
    }
}

function OnboardingWizardSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="border-b">
                <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                            <div className="space-y-2">
                                <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            </div>
                        </div>
                        <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-2 w-full bg-muted animate-pulse rounded" />
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="h-96 bg-muted animate-pulse rounded-lg" />
            </div>
        </div>
    );
}