'use client';

import { useState } from 'react';
import {
    CheckCircle,
    Mail,
    ArrowRight,
    SkipForward,
    Clock,
    Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { useOnboardingStore } from '@/store/use-onboarding-store';

interface InquiryConfirmationProps {
    vendorSlug: string;
    onContinue: () => void;
    onSkipToReview: () => void;
}

export function InquiryConfirmation({
    vendorSlug,
    onContinue,
    onSkipToReview
}: InquiryConfirmationProps) {
    const { currentTheme } = useTheme();
    const { data } = useOnboardingStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSkipToReview = async () => {
        setIsLoading(true);
        // Small delay for better UX
        setTimeout(() => {
            onSkipToReview();
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="space-y-8">
            {/* Success Message */}
            <div className="text-center space-y-4">
                <div
                    className="w-20 h-20 mx-auto rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: `${currentTheme.colors.accent}10` }}
                >
                    <CheckCircle
                        className="h-10 w-10"
                        style={{ color: currentTheme.colors.accent }}
                    />
                </div>

                <div>
                    <h3
                        className="text-3xl font-bold theme-heading mb-2"
                        style={{ fontFamily: currentTheme.fonts.heading }}
                    >
                        Your Inquiry is Created! 🎉
                    </h3>
                    <p
                        className="text-lg text-muted-foreground"
                        style={{ fontFamily: currentTheme.fonts.body }}
                    >
                        Thank you, {data.brideName}! We've received your information.
                    </p>
                </div>
            </div>

            {/* Email Confirmation Card */}
            <Card
                className="theme-card"
                style={{
                    borderRadius: currentTheme.components.card.borderRadius,
                    backgroundColor: `${currentTheme.colors.primary}05`
                }}
            >
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: currentTheme.colors.primary }}
                        >
                            <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold mb-2">Check Your Email</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                We've sent a confirmation email to <strong>{data.email}</strong> with:
                            </p>
                            <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-2">
                                    <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: currentTheme.colors.accent }}
                                    />
                                    Your inquiry details and reference number
                                </li>
                                <li className="flex items-center gap-2">
                                    <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: currentTheme.colors.accent }}
                                    />
                                    What to expect next in the process
                                </li>
                                <li className="flex items-center gap-2">
                                    <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: currentTheme.colors.accent }}
                                    />
                                    Direct contact information for questions
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Next Steps Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option 1: Continue with Details */}
                <Card
                    className="theme-card cursor-pointer transition-all hover:shadow-lg"
                    style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    onClick={onContinue}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                            >
                                <Sparkles
                                    className="h-5 w-5"
                                    style={{ color: currentTheme.colors.primary }}
                                />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Continue Planning</h4>
                                <p className="text-sm text-muted-foreground font-normal">
                                    Recommended for better proposals
                                </p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Share more details about your event, services needed, and design preferences
                            to help us create a more accurate and personalized proposal.
                        </p>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Takes 3-5 more minutes</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>More accurate pricing</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Personalized recommendations</span>
                            </div>
                        </div>

                        <Button
                            className="w-full gap-2 theme-button"
                            style={{
                                backgroundColor: currentTheme.colors.primary,
                                borderRadius: currentTheme.components.button.borderRadius
                            }}
                            onClick={onContinue}
                        >
                            <ArrowRight className="h-4 w-4" />
                            Continue with Details
                        </Button>
                    </CardContent>
                </Card>

                {/* Option 2: Skip to Review */}
                <Card
                    className="theme-card cursor-pointer transition-all hover:shadow-lg"
                    style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    onClick={handleSkipToReview}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${currentTheme.colors.secondary}50` }}
                            >
                                <SkipForward
                                    className="h-5 w-5"
                                    style={{ color: currentTheme.colors.primary }}
                                />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Submit Now</h4>
                                <p className="text-sm text-muted-foreground font-normal">
                                    Quick submission option
                                </p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Submit your inquiry now with just your contact information.
                            We'll follow up to gather additional details during our consultation.
                        </p>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Submit immediately</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                <span>Fast consultation booking</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                <span>Personal discussion of details</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleSkipToReview}
                            disabled={isLoading}
                            style={{ borderColor: currentTheme.colors.primary }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <SkipForward className="h-4 w-4" />
                                    Submit My Inquiry
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Information */}
            <Card
                className="theme-card"
                style={{ borderRadius: currentTheme.components.card.borderRadius }}
            >
                <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">What Happens Next?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                                style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                                <span className="text-white font-semibold">1</span>
                            </div>
                            <p className="font-medium">Review</p>
                            <p className="text-muted-foreground">We review your inquiry within 2-4 hours</p>
                        </div>
                        <div className="text-center">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                                style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                                <span className="text-white font-semibold">2</span>
                            </div>
                            <p className="font-medium">Contact</p>
                            <p className="text-muted-foreground">We'll reach out via your preferred method</p>
                        </div>
                        <div className="text-center">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                                style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                                <span className="text-white font-semibold">3</span>
                            </div>
                            <p className="font-medium">Proposal</p>
                            <p className="text-muted-foreground">Receive your custom floral proposal</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}