'use client';

import { useEffect, useState, useRef } from 'react';
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
import { DesignPreferencesStep } from './steps/DesignPreferencesStep/index';
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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Generate session ID on mount
    useEffect(() => {
        const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionIdState(id);
        setSessionId(id);
        setVendorSlug(vendorSlug);
    }, [vendorSlug]);
    const { isSaving, lastSavedAt, saveError } = useAutoSave({
        vendorSlug,
        sessionId,
        enabled: false,
    });
    useEffect(() => {
        if (cardRef.current && !showInquiryConfirmation) {
            cardRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    }, [data.currentStep]);

    const progress = ((data.currentStep - 1) / (data.totalSteps - 1)) * 100;

    const stepTitles = [
        'Personal & Event Details',
        'Design Preferences & Services',
        'Review & Submit'
    ];

    const handleNext = async () => {
        // Show inquiry confirmation after completing personal details
        if (data.currentStep === 1 && canProgressFromStep(1, data)) {
            setShowInquiryConfirmation(true);
            return;
        }

        if (data.currentStep < data.totalSteps) {
            if (data.currentStep === 3) {
                // Complete onboarding from preview
                markCompleted();
                router.push(`/${vendorSlug}/onboard/complete`);
            } else {
                setIsTransitioning(true);
                setTimeout(() => {
                    nextStep();
                    setIsTransitioning(false);
                }, 150);
            }
        }
    };

    const handlePrev = () => {
        if (data.currentStep > 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                prevStep();
                setIsTransitioning(false);
            }, 150);
        }
    };

    const handleContinueFromInquiry = () => {
        setShowInquiryConfirmation(false);
        setIsTransitioning(true);
        setTimeout(() => {
            nextStep(); // Go to step 2
            setIsTransitioning(false);
        }, 150);
    };

    const handleSkipToReview = () => {
        setShowInquiryConfirmation(false);
        setIsTransitioning(true);
        setTimeout(() => {
            goToStep(3); // Jump directly to review
            setIsTransitioning(false);
        }, 150);
    };

    const renderCurrentStep = () => {
        switch (data.currentStep) {
            case 1:
                return <PersonalDetailsStep />;
            case 2:
                return <DesignPreferencesStep />;
            case 3:
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
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
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
                                <p className="text-sm text-muted-foreground transition-all duration-300">
                                    Tell us about your special day
                                </p>
                            </div>
                        </div>

                        <AutoSaveIndicator
                            isSaving={isSaving}
                            lastSavedAt={lastSavedAt}
                            error={saveError}
                        />
                    </div>
                    <div className="space-y-2 transition-all duration-300">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Step {data.currentStep} of {data.totalSteps}
                            </span>
                            <span
                                className="font-medium transition-colors duration-300"
                                style={{ color: currentTheme.colors.primary }}
                            >
                                {Math.round(progress)}% Complete
                            </span>
                        </div>
                        <Progress
                            value={progress}
                            className="h-2 transition-all duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card
                    ref={cardRef}
                    className="theme-card transition-all duration-300"
                    style={{ borderRadius: currentTheme.components.card.borderRadius }}
                >
                    <CardHeader className="text-center border-b transition-all duration-300 py-4">
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles
                                className="h-5 w-5 transition-colors duration-300"
                                style={{ color: currentTheme.colors.accent }}
                            />
                            <Badge
                                variant="secondary"
                                className="transition-all duration-300"
                                style={{
                                    backgroundColor: `${currentTheme.colors.primary}10`,
                                    color: currentTheme.colors.primary
                                }}
                            >
                                {stepTitles[data.currentStep - 1]}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <div
                            ref={contentRef}
                            className={`transition-all duration-300 ease-in-out ${isTransitioning
                                ? 'opacity-0 transform translate-y-4'
                                : 'opacity-100 transform translate-y-0'
                                }`}
                        >
                            {renderCurrentStep()}
                        </div>

                        {data.currentStep !== 3 && (
                            <div className="transition-all duration-300">
                                <StepNavigation
                                    currentStep={data.currentStep}
                                    totalSteps={data.totalSteps}
                                    onNext={handleNext}
                                    onPrev={handlePrev}
                                    canProgress={canProgressFromStep(data.currentStep, data)}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Inquiry Confirmation Modal */}
            {showInquiryConfirmation && (
                <InquiryConfirmation
                    vendorSlug={vendorSlug}
                    onContinue={handleContinueFromInquiry}
                    onSkipToReview={handleSkipToReview}
                />
            )}
        </div>
    );
}

function canProgressFromStep(step: number, data: any): boolean {
    switch (step) {
        case 1:
            return !!(data.email && data.brideName);
        case 2:
            return true;
        case 3:
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