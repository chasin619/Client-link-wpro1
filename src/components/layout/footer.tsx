'use client';

import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Heart,
    Instagram,
    Facebook,
    Twitter,
    ArrowRight,
    Flower2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/hooks/use-theme';

interface FooterProps {
    vendor: {
        business_name: string;
        business_email: string;
        phone: string;
        business_address: string;
        website?: string;
    };
}

export function Footer({ vendor }: FooterProps) {
    const { currentTheme, isLoading } = useTheme();

    if (isLoading) {
        return <FooterSkeleton />;
    }

    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-muted/30 border-t">
            {/* Decorative Top Wave */}
            <div className="absolute top-0 left-0 right-0">
                <svg viewBox="0 0 1440 80" className="w-full h-auto">
                    <path
                        fill="rgb(var(--color-muted) / 0.3)"
                        d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                    />
                </svg>
            </div>

            <div className="relative pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                        {/* Business Info Column */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                    <Flower2 className="h-5 w-5 text-white" />
                                </div>
                                <h3
                                    className="text-2xl font-bold theme-heading"
                                    style={{ fontFamily: currentTheme.fonts.heading }}
                                >
                                    {vendor.business_name}
                                </h3>
                            </div>

                            <p
                                className="text-muted-foreground mb-6 max-w-md leading-relaxed"
                                style={{ fontFamily: currentTheme.fonts.body }}
                            >
                                {` Creating beautiful, memorable floral arrangements for life's most precious moments.
                                Let us help you tell your love story through the timeless language of flowers.`}
                            </p>

                            {/* Newsletter Signup */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-foreground">Stay Inspired</h4>
                                <div className="flex gap-2 max-w-sm">
                                    <Input
                                        placeholder="Enter your email"
                                        className="theme-input"
                                        style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                    />
                                    <Button
                                        size="icon"
                                        className="theme-button shrink-0"
                                        style={{
                                            borderRadius: currentTheme.components.button.borderRadius,
                                            backgroundColor: currentTheme.colors.primary
                                        }}
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Get wedding inspiration and seasonal flower tips
                                </p>
                            </div>
                        </div>

                        {/* Contact Info Column */}
                        <div>
                            <h4
                                className="font-semibold text-foreground mb-6 theme-heading"
                                style={{ fontFamily: currentTheme.fonts.heading }}
                            >
                                Contact Info
                            </h4>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin
                                        className="h-5 w-5 mt-0.5 shrink-0"
                                        style={{ color: currentTheme.colors.primary }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Address</p>
                                        <p className="text-sm text-muted-foreground">{vendor.business_address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone
                                        className="h-5 w-5 mt-0.5 shrink-0"
                                        style={{ color: currentTheme.colors.primary }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Phone</p>
                                        <a
                                            href={`tel:${vendor.phone}`}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {vendor.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail
                                        className="h-5 w-5 mt-0.5 shrink-0"
                                        style={{ color: currentTheme.colors.primary }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Email</p>
                                        <a
                                            href={`mailto:${vendor.business_email}`}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {vendor.business_email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock
                                        className="h-5 w-5 mt-0.5 shrink-0"
                                        style={{ color: currentTheme.colors.primary }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Business Hours</p>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                                            <p>Sat: 10:00 AM - 4:00 PM</p>
                                            <p>Sun: By Appointment</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div>
                            <h4
                                className="font-semibold text-foreground mb-6 theme-heading"
                                style={{ fontFamily: currentTheme.fonts.heading }}
                            >
                                Quick Links
                            </h4>

                            <div className="space-y-3">
                                {[
                                    { label: 'Wedding Packages', href: '/packages' },
                                    { label: 'Portfolio Gallery', href: '/portfolio' },
                                    { label: 'About Us', href: '/about' },
                                    { label: 'Reviews', href: '/reviews' },
                                    { label: 'Contact', href: '/contact' },
                                    { label: 'Wedding Planning Guide', href: '/guide' },
                                ].map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>

                            {/* Services Badge */}
                            <div className="mt-6">
                                <Badge
                                    variant="outline"
                                    className="mb-3"
                                    style={{ borderColor: currentTheme.colors.primary }}
                                >
                                    Featured Services
                                </Badge>
                                <div className="space-y-2">
                                    {[
                                        'Bridal Bouquets',
                                        'Ceremony Arrangements',
                                        'Reception Centerpieces'
                                    ].map((service) => (
                                        <div key={service} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: currentTheme.colors.accent }}
                                            />
                                            {service}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="mb-8" />

                    {/* Bottom Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        {/* Copyright */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>© {currentYear} {vendor.business_name}.</span>
                            <span>Made with</span>
                            <Heart
                                className="h-4 w-4"
                                style={{ color: currentTheme.colors.primary }}
                                fill="currentColor"
                            />
                            <span>for beautiful weddings.</span>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Follow us:</span>
                            <div className="flex gap-3">
                                {[
                                    { icon: Instagram, href: '#', label: 'Instagram' },
                                    { icon: Facebook, href: '#', label: 'Facebook' },
                                    { icon: Twitter, href: '#', label: 'Twitter' },
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                        style={{
                                            backgroundColor: `${currentTheme.colors.primary}20`,
                                            color: currentTheme.colors.primary
                                        }}
                                        aria-label={social.label}
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 pt-6 border-t border-muted-foreground/20">
                        <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: currentTheme.colors.accent }}
                                />
                                Professional Florist Association Member
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: currentTheme.colors.accent }}
                                />
                                Licensed & Insured
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: currentTheme.colors.accent }}
                                />
                                Satisfaction Guaranteed
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Background Pattern */}
            < div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ background: currentTheme.patterns.section }
                }
            />
        </footer >
    );
}

function FooterSkeleton() {
    return (
        <footer className="bg-muted/30 border-t pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Business Info Skeleton */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-muted animate-pulse rounded" />
                            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                            <div className="flex gap-2">
                                <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
                                <div className="h-10 w-10 bg-muted animate-pulse rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Skeleton */}
                    <div className="space-y-4">
                        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-5 h-5 bg-muted animate-pulse rounded" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Links Skeleton */}
                    <div className="space-y-4">
                        <div className="h-6 w-28 bg-muted animate-pulse rounded" />
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
                        ))}
                    </div>
                </div>

                <div className="border-t pt-8">
                    <div className="flex justify-between items-center">
                        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                        <div className="flex gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}