'use client';

import { ChevronLeft, ChevronRight, Eye, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onPrev: () => void;
    onSkip?: () => void;
    canProgress: boolean;
    canSkip?: boolean;
}

export function StepNavigation({
    currentStep,
    onNext,
    onPrev,
    onSkip,
    canProgress,
    canSkip = true
}: StepNavigationProps) {
    const { currentTheme } = useTheme();

    const isFirstStep = currentStep === 1;
    const isLastFormStep = currentStep === 5;
    const formSteps = 5;
    const isPersonalDetailsStep = currentStep === 1;

    return (
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
                variant="outline"
                onClick={onPrev}
                disabled={isFirstStep}
                className="gap-2"
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </Button>

            {/* Progress dots - only show form steps */}
            <div className="flex gap-2">
                {Array.from({ length: formSteps }, (_, i) => (
                    <div
                        key={i}
                        className="w-3 h-3 rounded-full transition-all"
                        style={{
                            backgroundColor: i < currentStep
                                ? currentTheme.colors.primary
                                : i === currentStep - 1
                                    ? currentTheme.colors.accent
                                    : `${currentTheme.colors.primary}20`
                        }}
                    />
                ))}
            </div>

            <div className="flex gap-3">
                {/* Skip button - show for all steps except personal details and preview */}
                {!isPersonalDetailsStep && canSkip && onSkip && (
                    <Button
                        variant="ghost"
                        onClick={onSkip}
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <SkipForward className="h-4 w-4" />
                        Skip
                    </Button>
                )}

                {/* Next/Review button */}
                <Button
                    onClick={onNext}
                    disabled={!canProgress}
                    className="gap-2 theme-button"
                    style={{
                        backgroundColor: currentTheme.colors.primary,
                        borderRadius: currentTheme.components.button.borderRadius
                    }}
                >
                    {isLastFormStep ? (
                        <>
                            <Eye className="h-4 w-4" />
                            Review
                        </>
                    ) : (
                        <>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}