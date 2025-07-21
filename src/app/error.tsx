'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    const { currentTheme, isLoading } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    const handleReset = async () => {
        setIsRetrying(true);
        setTimeout(() => {
            reset();
            setIsRetrying(false);
        }, 1000);
    };

    const goHome = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    };

    const reportError = () => {
        const subject = encodeURIComponent('Error Report - Client Portal');
        const body = encodeURIComponent(`
Error Details:
- Message: ${error.message}
- Digest: ${error.digest || 'N/A'}
- URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
- Timestamp: ${new Date().toISOString()}
- User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}

Please describe what you were doing when this error occurred:

        `);

        window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
    };

    if (isLoading || !mounted) {
        return <ErrorSkeleton />;
    }

    return (
        <>
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .pulse-icon {
                    animation: pulse 2s ease-in-out infinite;
                }

                .shake-icon {
                    animation: shake 0.5s ease-in-out;
                }

                .content-animate {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .gradient-bg {
                    background: linear-gradient(135deg, ${currentTheme.colors.primary}05, ${currentTheme.colors.accent}05);
                }

                .error-gradient {
                    background: linear-gradient(45deg, #ef4444, #f59e0b);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-lg w-full text-center"
                >
                    <Card
                        className="theme-card shadow-xl"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardContent className="p-8">
                            {/* Error Icon */}
                            <motion.div
                                className="mb-6"
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <div
                                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center pulse-icon"
                                    style={{ backgroundColor: '#ef444410' }}
                                >
                                    <AlertTriangle className="h-12 w-12 text-red-500" />
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                className="text-3xl font-bold mb-4 theme-heading error-gradient"
                                style={{ fontFamily: currentTheme.fonts.heading }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                Oops! Something went wrong
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                className="text-muted-foreground mb-6"
                                style={{ fontFamily: currentTheme.fonts.body }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                We're sorry, but something unexpected happened.
                                Don't worry, our team has been notified and is working on it.
                            </motion.p>

                            {/* Error Details (Development) */}
                            {process.env.NODE_ENV === 'development' && (
                                <motion.div
                                    className="mb-6 p-4 bg-muted/50 rounded-lg text-left"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    <h3 className="font-semibold text-sm mb-2">Error Details:</h3>
                                    <code className="text-xs text-red-600 break-all">
                                        {error.message}
                                    </code>
                                    {error.digest && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Error ID: {error.digest}
                                        </p>
                                    )}
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                            >
                                <Button
                                    onClick={handleReset}
                                    disabled={isRetrying}
                                    className="w-full theme-button"
                                    style={{
                                        backgroundColor: currentTheme.colors.primary,
                                        borderRadius: currentTheme.components.button.borderRadius
                                    }}
                                >
                                    {isRetrying ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Retrying...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Try Again
                                        </>
                                    )}
                                </Button>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={goHome}
                                        variant="outline"
                                        className="flex-1"
                                        style={{ borderRadius: currentTheme.components.button.borderRadius }}
                                    >
                                        <Home className="mr-2 h-4 w-4" />
                                        Go Home
                                    </Button>
                                    <Button
                                        onClick={reportError}
                                        variant="outline"
                                        className="flex-1"
                                        style={{ borderRadius: currentTheme.components.button.borderRadius }}
                                    >
                                        <Bug className="mr-2 h-4 w-4" />
                                        Report Issue
                                    </Button>
                                </div>
                            </motion.div>
                        </CardContent>
                    </Card>

                    {/* Help Text */}
                    <motion.div
                        className="mt-6 text-sm text-muted-foreground"
                        style={{ fontFamily: currentTheme.fonts.body }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        <p className="mb-2">If this problem persists, please contact our support team:</p>
                        <a
                            href="mailto:support@example.com"
                            className="inline-flex items-center gap-2 hover:underline"
                            style={{ color: currentTheme.colors.primary }}
                        >
                            <Mail className="h-4 w-4" />
                            support@example.com
                        </a>
                    </motion.div>
                </motion.div>
            </div >
        </>
    );
}

function ErrorSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center space-y-6">
                <div className="w-24 h-24 bg-muted animate-pulse rounded-full mx-auto" />
                <div className="h-8 w-80 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-4 w-96 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
                <div className="flex gap-3">
                    <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
                    <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
                </div>
            </div>
        </div>
    );
}