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

            <div className="relative pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

                        {/* Business Info Column - Takes 5 columns */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Logo and Name */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                    <Flower2 className="h-6 w-6 text-white" />
                                </div>
                                <h3
                                    className="text-3xl font-bold theme-heading text-foreground"
                                    style={{ fontFamily: currentTheme.fonts.heading }}
                                >
                                    {vendor.business_name}
                                </h3>
                            </div>

                            {/* Description */}
                            <p
                                className="text-muted-foreground leading-relaxed text-base max-w-md"
                                style={{ fontFamily: currentTheme.fonts.body }}
                            >
                                Creating beautiful, memorable floral arrangements for life's most precious moments.
                                Let us help you tell your love story through the timeless language of flowers.
                            </p>


                        </div>

                        {/* Contact Info Column - Takes 4 columns */}
                        <div className="lg:col-span-4 space-y-6">
                            <h4
                                className="font-bold text-foreground text-xl theme-heading mb-8"
                                style={{ fontFamily: currentTheme.fonts.heading }}
                            >
                                Get in Touch
                            </h4>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1"
                                        style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
                                    >
                                        <MapPin
                                            className="h-5 w-5"
                                            style={{ color: currentTheme.colors.primary }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground">Visit Us</p>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {vendor.business_address}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1"
                                        style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
                                    >
                                        <Phone
                                            className="h-5 w-5"
                                            style={{ color: currentTheme.colors.primary }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground">Call Us</p>
                                        <a
                                            href={`tel:${vendor.phone}`}
                                            className="text-muted-foreground hover:text-primary transition-colors font-medium"
                                        >
                                            {vendor.phone}
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1"
                                        style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
                                    >
                                        <Mail
                                            className="h-5 w-5"
                                            style={{ color: currentTheme.colors.primary }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground">Email Us</p>
                                        <a
                                            href={`mailto:${vendor.business_email}`}
                                            className="text-muted-foreground hover:text-primary transition-colors font-medium break-all"
                                        >
                                            {vendor.business_email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours Column - Takes 3 columns */}
                        <div className="lg:col-span-3 space-y-6">
                            <h4
                                className="font-bold text-foreground text-xl theme-heading mb-8"
                                style={{ fontFamily: currentTheme.fonts.heading }}
                            >
                                Business Hours
                            </h4>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
                                    >
                                        <Clock
                                            className="h-5 w-5"
                                            style={{ color: currentTheme.colors.primary }}
                                        />
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Monday - Friday</span>
                                            <span className="font-semibold text-foreground">9AM - 6PM</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Saturday</span>
                                            <span className="font-semibold text-foreground">10AM - 4PM</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Sunday</span>
                                            <span className="font-semibold text-foreground">By Appointment</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Divider */}
                    <Separator className="mb-12" />

                    {/* Bottom Footer */}
                    <div className="space-y-8">
                        {/* Social Links and Trust Badges */}
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                            {/* Social Links */}
                            <div className="flex items-center gap-6">
                                <span className="text-muted-foreground font-medium">Follow Us</span>
                                <div className="flex gap-4">
                                    {[
                                        { icon: Instagram, href: '#', label: 'Instagram' },
                                        { icon: Facebook, href: '#', label: 'Facebook' },
                                        { icon: Twitter, href: '#', label: 'Twitter' },
                                    ].map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                                            style={{
                                                backgroundColor: `${currentTheme.colors.primary}15`,
                                                color: currentTheme.colors.primary
                                            }}
                                            aria-label={social.label}
                                        >
                                            <social.icon className="h-5 w-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6 text-sm text-muted-foreground">
                                {[
                                    'Professional Florist Association Member',
                                    'Licensed & Insured',
                                    'Satisfaction Guaranteed'
                                ].map((badge) => (
                                    <div key={badge} className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: currentTheme.colors.accent }}
                                        />
                                        <span className="whitespace-nowrap">{badge}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-center py-6 border-t border-muted-foreground/10">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-muted-foreground">
                                <span>© {currentYear} {vendor.business_name}. All rights reserved.</span>
                                <div className="flex items-center gap-2">
                                    <span>Made with</span>
                                    <Heart
                                        className="h-4 w-4"
                                        style={{ color: currentTheme.colors.primary }}
                                        fill="currentColor"
                                    />
                                    <span>for beautiful weddings.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
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
        <footer className="bg-muted/30 border-t pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    {/* Business Info Skeleton - 5 columns */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted animate-pulse rounded-full" />
                            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-muted animate-pulse rounded" />
                            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                            <div className="flex gap-3 max-w-sm">
                                <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
                                <div className="h-10 w-10 bg-muted animate-pulse rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Skeleton - 4 columns */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Business Hours Skeleton - 3 columns */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
                            <div className="space-y-3 flex-1">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
                                ))}
                            </div>
                        </div>
                        <div className="h-10 w-full bg-muted animate-pulse rounded" />
                    </div>
                </div>

                <div className="border-t pt-12 space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                        <div className="flex gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                            ))}
                        </div>
                    </div>
                    <div className="text-center py-6 border-t">
                        <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto" />
                    </div>
                </div>
            </div>
        </footer>
    );
}