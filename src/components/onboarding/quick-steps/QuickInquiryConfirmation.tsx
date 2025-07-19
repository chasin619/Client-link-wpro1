'use client';

import { useState } from 'react';
import {
    CheckCircle2,
    Palette,
    SkipForward,
    Clock,
    Mail
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useQuickOnboardingStore } from '@/store/use-quick-onboarding-store';

interface QuickInquiryConfirmationProps {
    onContinueToDesign: () => void;
    onSkipForNow: () => void;
}

export function QuickInquiryConfirmation({
    onContinueToDesign,
    onSkipForNow
}: QuickInquiryConfirmationProps) {
    const { currentTheme } = useTheme();
    const { data } = useQuickOnboardingStore();
    const [isSkipping, setIsSkipping] = useState(false);

    const handleSkip = async () => {
        setIsSkipping(true);
        setTimeout(() => {
            onSkipForNow();
        }, 800);
    };

    return (
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
                    onClick={onContinueToDesign}
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
                    onClick={handleSkip}
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

            <div className="text-center">
                <p className="text-xs text-muted-foreground">
                    💡 Adding event details helps us prepare a more accurate proposal
                </p>
            </div>
        </div>
    );
}