'use client';

import { useState } from 'react';
import {
    CheckCircle,
    Mail,
    ArrowRight,
    X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

    return (
        <>
            {/* Modal Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                {/* Modal Content */}
                <Card
                    className="theme-card w-full max-w-md mx-auto relative animate-in fade-in zoom-in duration-300"
                    style={{ borderRadius: currentTheme.components.card.borderRadius }}
                >
                    <CardContent className="p-6">
                        {/* Success Icon */}
                        <div className="text-center mb-4">
                            <div
                                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
                                style={{ backgroundColor: `${currentTheme.colors.accent}10` }}
                            >
                                <CheckCircle
                                    className="h-8 w-8"
                                    style={{ color: currentTheme.colors.accent }}
                                />
                            </div>
                            <h3
                                className="text-xl font-bold theme-heading"
                                style={{ fontFamily: currentTheme.fonts.heading }}
                            >
                                Inquiry Created! 🎉
                            </h3>
                        </div>

                        {/* Email Confirmation */}
                        <div
                            className="p-4 rounded-lg mb-4"
                            style={{ backgroundColor: `${currentTheme.colors.primary}05` }}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm mb-1">Check Your Email</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Confirmation sent to <br />
                                        <strong className="text-foreground">{data.email}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <Button
                            className="w-full gap-2 theme-button mb-3"
                            style={{
                                backgroundColor: currentTheme.colors.primary,
                                borderRadius: currentTheme.components.button.borderRadius
                            }}
                            onClick={onContinue}
                        >
                            <ArrowRight className="h-4 w-4" />
                            visit client portal
                        </Button>

                    </CardContent>
                </Card>
            </div>
        </>
    );
}