'use client';

import { Heart, Sparkles, Crown, Flower2, Gift, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';

const services = [
    {
        icon: Heart,
        title: 'Bridal Bouquets',
        description: 'Stunning hand-crafted bouquets designed to complement your style and wedding theme.',
        features: ['Custom Design', 'Seasonal Flowers', 'Matching Accessories'],
        popular: true,
    },
    {
        icon: Crown,
        title: 'Ceremony Arrangements',
        description: 'Beautiful altar pieces, aisle decorations, and ceremony backdrops.',
        features: ['Altar Arrangements', 'Aisle Petals', 'Arch Decorations'],
        popular: false,
    },
    {
        icon: Sparkles,
        title: 'Reception Centerpieces',
        description: 'Elegant table centerpieces that create the perfect ambiance for your celebration.',
        features: ['Table Centerpieces', 'Ambient Lighting', 'Varied Heights'],
        popular: true,
    },
    {
        icon: Flower2,
        title: 'Personal Flowers',
        description: 'Boutonnieres, corsages, and flower girl arrangements for your wedding party.',
        features: ['Boutonnieres', 'Corsages', 'Flower Crowns'],
        popular: false,
    },
    {
        icon: Gift,
        title: 'Special Occasions',
        description: 'Beautiful arrangements for engagement parties, bridal showers, and anniversaries.',
        features: ['Engagement Parties', 'Bridal Showers', 'Anniversaries'],
        popular: false,
    },
    {
        icon: Camera,
        title: 'Venue Decoration',
        description: 'Complete venue transformation with florals, draping, and decorative elements.',
        features: ['Full Venue Setup', 'Draping & Linens', 'Lighting Design'],
        popular: true,
    },
];

export function ServicesGrid() {
    const { currentTheme, isLoading } = useTheme();

    if (isLoading) {
        return <ServicesGridSkeleton />;
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        Our Services
                    </Badge>
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6 theme-heading"
                        style={{ fontFamily: currentTheme.fonts.heading }}
                    >
                        Complete Wedding Floral Services
                    </h2>
                    <p
                        className="text-xl text-muted-foreground max-w-3xl mx-auto"
                        style={{ fontFamily: currentTheme.fonts.body }}
                    >
                        From intimate bouquets to grand venue transformations, we provide comprehensive
                        floral design services for every aspect of your special day.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.title}
                            service={service}
                            index={index}
                            theme={currentTheme}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ service, index, theme }: {
    service: typeof services[0];
    index: number;
    theme: any;
}) {
    const Icon = service.icon;

    return (
        <Card
            className="theme-card theme-hover group cursor-pointer h-full"
            style={{
                borderRadius: theme.components.card.borderRadius,
                transition: theme.animations.transition,
                animationDelay: `${index * 100}ms`
            }}
        >
            <CardHeader className="text-center">
                {/* Icon */}
                <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${theme.colors.primary}20` }}
                >
                    <Icon
                        className="h-8 w-8"
                        style={{ color: theme.colors.primary }}
                    />
                </div>

                {/* Title with Popular Badge */}
                <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle
                        className="text-xl theme-heading"
                        style={{ fontFamily: theme.fonts.heading }}
                    >
                        {service.title}
                    </CardTitle>
                    {service.popular && (
                        <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{ backgroundColor: `${theme.colors.accent}20`, color: theme.colors.accent }}
                        >
                            Popular
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="text-center">
                {/* Description */}
                <p
                    className="text-muted-foreground mb-6"
                    style={{ fontFamily: theme.fonts.body }}
                >
                    {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                    {service.features.map((feature) => (
                        <div
                            key={feature}
                            className="flex items-center text-sm text-muted-foreground"
                        >
                            <div
                                className="w-1.5 h-1.5 rounded-full mr-3"
                                style={{ backgroundColor: theme.colors.accent }}
                            />
                            {feature}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function ServicesGridSkeleton() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="h-6 w-32 bg-muted animate-pulse rounded mx-auto" />
                    <div className="h-12 w-96 bg-muted animate-pulse rounded mx-auto" />
                    <div className="h-6 w-full max-w-2xl bg-muted animate-pulse rounded mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>
            </div>
        </section>
    );
}