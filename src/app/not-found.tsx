'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Search, Flower2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';

export default function NotFound() {
    const router = useRouter();
    const { currentTheme, isLoading } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const goHome = () => router.push('/');
    const goBack = () => router.back();

    if (isLoading || !mounted) {
        return <NotFoundSkeleton />;
    }

    return (
        <>
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-20px) rotate(2deg); }
                    66% { transform: translateY(10px) rotate(-1deg); }
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

                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% {
                        transform: translate3d(0,0,0);
                    }
                    40%, 43% {
                        transform: translate3d(0, -15px, 0);
                    }
                    70% {
                        transform: translate3d(0, -7px, 0);
                    }
                    90% {
                        transform: translate3d(0, -3px, 0);
                    }
                }

                .floating-flower {
                    animation: float 6s ease-in-out infinite;
                }

                .content-animate {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .bounce-icon {
                    animation: bounce 2s infinite;
                }

                .gradient-bg {
                    background: linear-gradient(135deg, ${currentTheme.colors.primary}10, ${currentTheme.colors.accent}05);
                }

                .text-gradient {
                    background: linear-gradient(45deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent});
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
                {/* Floating Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="floating-flower absolute top-20 left-20 opacity-20">
                        <Flower2 className="h-16 w-16" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <div className="floating-flower absolute top-40 right-32 opacity-15" style={{ animationDelay: '2s' }}>
                        <Flower2 className="h-12 w-12" style={{ color: currentTheme.colors.accent }} />
                    </div>
                    <div className="floating-flower absolute bottom-32 left-1/3 opacity-10" style={{ animationDelay: '4s' }}>
                        <Flower2 className="h-20 w-20" style={{ color: currentTheme.colors.secondary }} />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 max-w-lg w-full text-center"
                >
                    <Card
                        className="theme-card shadow-xl"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardContent className="p-8">
                            {/* 404 Icon */}
                            <motion.div
                                className="mb-6"
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <div
                                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bounce-icon"
                                    style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                                >
                                    <span
                                        className="text-4xl font-bold text-gradient"
                                        style={{ fontFamily: currentTheme.fonts.heading }}
                                    >
                                        404
                                    </span>
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                className="text-3xl font-bold mb-4 theme-heading"
                                style={{
                                    fontFamily: currentTheme.fonts.heading,
                                    color: currentTheme.colors.primary
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                Page Not Found
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                className="text-muted-foreground mb-6"
                                style={{ fontFamily: currentTheme.fonts.body }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                Sorry, we couldn't find the page you're looking for.
                                It might have been moved, deleted, or you entered the wrong URL.
                            </motion.p>

                            {/* Search Box */}
                            <motion.form
                                onSubmit={handleSearch}
                                className="mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Search for something..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="theme-input flex-1"
                                        style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                    />
                                    <Button
                                        type="submit"
                                        className="theme-button"
                                        style={{
                                            backgroundColor: currentTheme.colors.primary,
                                            borderRadius: currentTheme.components.button.borderRadius
                                        }}
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.form>

                            {/* Action Buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                            >
                                <Button
                                    onClick={goHome}
                                    className="theme-button flex-1"
                                    style={{
                                        backgroundColor: currentTheme.colors.primary,
                                        borderRadius: currentTheme.components.button.borderRadius
                                    }}
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Go Home
                                </Button>
                                <Button
                                    onClick={goBack}
                                    variant="outline"
                                    className="flex-1"
                                    style={{ borderRadius: currentTheme.components.button.borderRadius }}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Go Back
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>

                    {/* Help Text */}
                    <motion.p
                        className="mt-6 text-sm text-muted-foreground"
                        style={{ fontFamily: currentTheme.fonts.body }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        Need help? Contact us at{' '}
                        <a
                            href="mailto:support@example.com"
                            className="hover:underline"
                            style={{ color: currentTheme.colors.primary }}
                        >
                            support@example.com
                        </a>
                    </motion.p>
                </motion.div>
            </div >
        </>
    );
}

function NotFoundSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center space-y-6">
                <div className="w-24 h-24 bg-muted animate-pulse rounded-full mx-auto" />
                <div className="h-8 w-64 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-4 w-80 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
                <div className="flex gap-3">
                    <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
                    <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
                </div>
            </div>
        </div>
    );
}