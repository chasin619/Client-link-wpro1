'use client';

import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';

interface HeroSectionProps {
    vendor: {
        business_name: string;
        business_email: string;
        phone: string;
        business_address: string;
        heroTitle?: string;
        heroSubtitle?: string;
        heroImage?: string;
    };
}

export function HeroSection({ vendor }: HeroSectionProps) {
    const { currentTheme, isLoading } = useTheme();

    if (isLoading) {
        return <HeroSkeleton />;
    }

    const heroStyle = {
        background: currentTheme.patterns.hero,
        fontFamily: currentTheme.fonts.heading,
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-30"
                style={{ background: currentTheme.patterns.hero }}
            />

            {/* Background Image */}
            {vendor.heroImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${vendor.heroImage})` }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="animate-theme-fade-in">
                    {/* Business Badge */}
                    <Badge
                        variant="secondary"
                        className="mb-4 px-4 py-2 text-sm font-medium theme-transition"
                    >
                        Professional Wedding Florist
                    </Badge>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 theme-heading">
                        <span
                            className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                            style={{ fontFamily: currentTheme.fonts.heading }}
                        >
                            {vendor.heroTitle || vendor.business_name}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground"
                        style={{ fontFamily: currentTheme.fonts.body }}
                    >
                        {vendor.heroSubtitle || `Creating beautiful, memorable floral arrangements for your special day. Let us bring your wedding vision to life with stunning, personalized designs.`}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button
                            size="lg"
                            className="theme-button theme-hover px-8 py-6 text-lg font-semibold"
                            style={{
                                borderRadius: currentTheme.components.button.borderRadius,
                                boxShadow: currentTheme.components.button.shadow
                            }}
                        >
                            Start Planning <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="theme-button px-8 py-6 text-lg"
                        >
                            View Portfolio
                        </Button>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{vendor.business_address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{vendor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{vendor.business_email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 320" className="w-full h-auto">
                    <path
                        fill="rgba(var(--color-background), 0.8)"
                        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </svg>
            </div>
        </section>
    );
}

function HeroSkeleton() {
    return (
        <section className="min-h-screen flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-16 w-full bg-muted animate-pulse rounded" />
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded mx-auto" />
                <div className="flex gap-4 justify-center">
                    <div className="h-12 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-12 w-32 bg-muted animate-pulse rounded" />
                </div>
            </div>
        </section>
    );
}