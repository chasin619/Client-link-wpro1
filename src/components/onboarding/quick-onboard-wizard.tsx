'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuickOnboardingStore } from '@/store/use-quick-onboarding-store';
import { useTheme } from '@/hooks/use-theme';
import { QuickPersonalDetailsStep } from './quick-steps/quick-personal-details';
import { QuickEventDetails } from './quick-steps/quick-event-details';
import {
    Zap,
    Sparkles,
    Send,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Palette,
    SkipForward,
    Mail
} from 'lucide-react';

interface QuickOnboardWizardProps {
    vendorSlug: string;
}

export function QuickOnboardWizard({ vendorSlug }: QuickOnboardWizardProps) {
    const router = useRouter();
    const { data, setSessionId, setVendorSlug, nextStep, prevStep, markCompleted } = useQuickOnboardingStore();
    const { currentTheme, isLoading: themeLoading } = useTheme();
    const [sessionId, setSessionIdState] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inquiryCreated, setInquiryCreated] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);

    // Generate session ID on mount
    useEffect(() => {
        const id = `quick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionIdState(id);
        setSessionId(id);
        setVendorSlug(vendorSlug);
    }, [vendorSlug]);

    const progress = (data.currentStep / data.totalSteps) * 100;
    const stepTitles = ['Personal Details', 'Event Details'];

    const handleNext = async () => {
        if (data.currentStep === 1) {
            // Create basic inquiry after first step
            await createBasicInquiry();
        } else if (data.currentStep === 2) {
            // Submit complete onboarding
            await handleSubmit();
        }
    };

    const createBasicInquiry = async () => {
        setIsSubmitting(true);
        try {
            // Simulate API call to create basic inquiry
            await new Promise(resolve => setTimeout(resolve, 1500));

            setInquiryCreated(true);
            setIsSubmitting(false);
        } catch (error) {
            console.error('Error creating basic inquiry:', error);
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Mark as completed
            markCompleted();

            // Navigate to completion page
            router.push(`/${vendorSlug}/onboard/complete`);
        } catch (error) {
            console.error('Error submitting complete form:', error);
            setIsSubmitting(false);
        }
    };

    const handlePrev = () => {
        if (data.currentStep > 1) {
            prevStep();
        }
    };

    const handleContinueToDesign = () => {
        setInquiryCreated(false);
        nextStep();
    };

    const handleSkipForNow = async () => {
        setIsSkipping(true);
        setTimeout(() => {
            markCompleted();
            router.push(`/${vendorSlug}/onboard/complete`);
        }, 800);
    };

    const renderCurrentStep = () => {
        switch (data.currentStep) {
            case 1:
                return <QuickPersonalDetailsStep />;
            case 2:
                return <QuickEventDetails />;
            default:
                return <QuickPersonalDetailsStep />;
        }
    };

    const canProgress = () => {
        if (data.currentStep === 1) {
            return !!(data.email && data.brideName);
        }
        if (data.currentStep === 2) {
            return !!(data.eventDate && data.eventType);
        }
        return true;
    };

    if (themeLoading) {
        return <QuickOnboardingWizardSkeleton />;
    }

    // Show inquiry created confirmation
    if (inquiryCreated && data.currentStep === 1) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="max-w-md mx-4">
                    <div className="space-y-6">
                        {/* Success Header */}
                        <div className="text-center space-y-3">
                            <div
                                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                            >
                                <CheckCircle2
                                    className="h-8 w-8"
                                    style={{ color: currentTheme.colors.primary }}
                                />
                            </div>

                            <div>
                                <h3
                                    className="text-2xl font-bold theme-heading"
                                    style={{ fontFamily: currentTheme.fonts.heading }}
                                >
                                    Inquiry Created Successfully! 🎉
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Thanks {data.brideName}! Your inquiry has been submitted and we'll be in touch soon.
                                </p>
                            </div>
                        </div>

                        {/* Email Confirmation */}
                        <Card
                            className="theme-card"
                            style={{
                                borderRadius: currentTheme.components.card.borderRadius,
                                backgroundColor: `${currentTheme.colors.primary}05`
                            }}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            Confirmation sent to <strong>{data.email}</strong>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Check your inbox for next steps and contact details
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Options */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleContinueToDesign}
                                className="w-full gap-2 theme-button"
                                style={{
                                    backgroundColor: currentTheme.colors.primary,
                                    borderRadius: currentTheme.components.button.borderRadius
                                }}
                            >
                                <Palette className="h-4 w-4" />
                                Continue with Event Details
                                <span className="text-xs opacity-75">(2 min)</span>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleSkipForNow}
                                disabled={isSkipping}
                                className="w-full gap-2"
                            >
                                {isSkipping ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                                        Finishing up...
                                    </>
                                ) : (
                                    <>
                                        <SkipForward className="h-4 w-4" />
                                        Skip for Now
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Quick Info */}
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                                💡 Adding event details helps us prepare a more accurate proposal
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                                <Zap className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1
                                    className="text-xl font-bold theme-heading"
                                    style={{ fontFamily: currentTheme.fonts.heading }}
                                >
                                    Quick Inquiry
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    Fast track your wedding planning
                                </p>
                            </div>
                        </div>

                        <Badge
                            variant="secondary"
                            className="gap-1 text-xs px-2 py-1"
                            style={{
                                backgroundColor: `${currentTheme.colors.accent}10`,
                                color: currentTheme.colors.accent
                            }}
                        >
                            <Zap className="h-3 w-3" />
                            Quick Mode
                        </Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
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
                            className="h-1.5"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <Card
                    className="theme-card"
                    style={{ borderRadius: currentTheme.components.card.borderRadius }}
                >
                    <CardHeader className="text-center border-b pb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles
                                className="h-4 w-4"
                                style={{ color: currentTheme.colors.accent }}
                            />
                            <Badge
                                variant="secondary"
                                className="text-xs px-2 py-1"
                                style={{
                                    backgroundColor: `${currentTheme.colors.primary}10`,
                                    color: currentTheme.colors.primary
                                }}
                            >
                                {stepTitles[data.currentStep - 1]}
                            </Badge>
                        </div>
                        <h2
                            className="text-2xl font-bold theme-heading"
                            style={{ fontFamily: currentTheme.fonts.heading }}
                        >
                            {getQuickStepDescription(data.currentStep)}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.currentStep === 1
                                ? "Just 2 quick steps to get your inquiry started"
                                : "Add more details to help us create the perfect proposal"
                            }
                        </p>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="animate-theme-fade-in">
                            {renderCurrentStep()}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={handlePrev}
                                disabled={data.currentStep === 1}
                                className="gap-2"
                                size="sm"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            <div className="flex gap-1.5">
                                {Array.from({ length: data.totalSteps }, (_, i) => (
                                    <div
                                        key={i}
                                        className="w-3 h-3 rounded-full transition-all"
                                        style={{
                                            backgroundColor: i < data.currentStep
                                                ? currentTheme.colors.primary
                                                : i === data.currentStep - 1
                                                    ? currentTheme.colors.accent
                                                    : `${currentTheme.colors.primary}20`
                                        }}
                                    />
                                ))}
                            </div>

                            <Button
                                onClick={handleNext}
                                disabled={!canProgress() || isSubmitting}
                                className="gap-2 theme-button"
                                size="sm"
                                style={{
                                    backgroundColor: currentTheme.colors.primary,
                                    borderRadius: currentTheme.components.button.borderRadius
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        {data.currentStep === 1 ? 'Creating...' : 'Submitting...'}
                                    </>
                                ) : data.currentStep === 1 ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Create Inquiry
                                    </>
                                ) : data.currentStep === data.totalSteps ? (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Complete Inquiry
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function getQuickStepDescription(step: number): string {
    switch (step) {
        case 1:
            return "Let's start with your contact details";
        case 2:
            return "Design details for your event";
        default:
            return "Quick Wedding Inquiry";
    }
}

function QuickOnboardingWizardSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                            <div className="space-y-2">
                                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                                <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                            </div>
                        </div>
                        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-1.5 w-full bg-muted animate-pulse rounded" />
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="h-96 bg-muted animate-pulse rounded-lg" />
            </div>
        </div>
    );
}