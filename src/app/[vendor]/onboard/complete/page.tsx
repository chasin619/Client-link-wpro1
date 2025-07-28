'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Calendar, Mail, Phone, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';

interface CompletePageProps {
    params: Promise<{ vendor: string }>;
}

export default function CompletePage({ params }: CompletePageProps) {
    const router = useRouter();
    const { data, resetData } = useOnboardingStore();
    const { currentTheme } = useTheme();
    const [vendor, setVendor] = useState<string>('');

    useEffect(() => {
        params.then((resolvedParams) => {
            setVendor(resolvedParams.vendor);
        });
    }, [params]);

    useEffect(() => {
        if (!data.isCompleted && vendor) {
            router.push(`/${vendor}/onboard`);
        }
    }, [data.isCompleted, vendor, router]);

    const handleNewPlanning = () => {
        resetData();
        router.push(`/${vendor}/onboard`);
    };

    const handleBackToHome = () => {
        router.push(`/${vendor}`);
    };

    if (!data.isCompleted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Redirecting...</p>
                </div>
            </div>
        );
    }

    // Rest of your component remains the same...
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div
                        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                        style={{ backgroundColor: `${currentTheme.colors.accent}10` }}
                    >
                        <Check
                            className="h-10 w-10"
                            style={{ color: currentTheme.colors.accent }}
                        />
                    </div>

                    <h1
                        className="text-4xl font-bold mb-4 theme-heading"
                        style={{ fontFamily: currentTheme.fonts.heading }}
                    >
                        {"  Thank You!"}
                    </h1>

                    <p
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        style={{ fontFamily: currentTheme.fonts.body }}
                    >
                        {` Your wedding planning information has been successfully submitted.
                        We're excited to help create your perfect floral arrangements!`}
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Event Summary */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5" />
                                Event Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">{data.eventDate ? new Date(data.eventDate).toLocaleDateString() : 'TBD'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Guests</p>
                                <p className="font-medium">{data.guestCount || 'TBD'} guests</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Style</p>
                                <Badge
                                    variant="secondary"
                                    style={{
                                        backgroundColor: `${currentTheme.colors.primary}10`,
                                        color: currentTheme.colors.primary
                                    }}
                                >
                                    {data.style || 'TBD'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services Summary */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Check className="h-5 w-5" />
                                Services Requested
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {data.ceremony?.needed && (
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Ceremony Arrangements</span>
                                    </div>
                                )}
                                {data.reception?.needed && (
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Reception Florals</span>
                                    </div>
                                )}
                                {data.personal?.needed && (
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Personal Flowers</span>
                                    </div>
                                )}
                                {(!data.ceremony?.needed && !data.reception?.needed && !data.personal?.needed) && (
                                    <p className="text-sm text-muted-foreground">Services to be discussed</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Summary */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Mail className="h-5 w-5" />
                                Contact Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">{data.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-medium">{data.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Preferred Contact</p>
                                <Badge variant="outline">
                                    {data.preferredContact || 'Email'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Next Steps */}
                <Card
                    className="theme-card mb-8"
                    style={{ borderRadius: currentTheme.components.card.borderRadius }}
                >
                    <CardHeader>
                        <CardTitle className="text-xl"> {"What happens next? "}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-1"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                    1
                                </div>
                                <div>
                                    <h4 className="font-semibold">{"Review & Proposal"}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {" We'll review your information and create a customized proposal within 24-48 hours."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-1"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                    2
                                </div>
                                <div>
                                    <h4 className="font-semibold">Consultation</h4>
                                    <p className="text-sm text-muted-foreground">
                                        We will schedule a {data.consultationPreference || 'consultation'} to discuss your vision in detail.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-1"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                    3
                                </div>
                                <div>
                                    <h4 className="font-semibold">Design & Planning</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {" Once approved, we'll begin designing your custom floral arrangements."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={handleBackToHome}
                        variant="outline"
                        size="lg"
                        className="theme-button"
                    >
                        Back to Home
                    </Button>

                    <Button
                        onClick={handleNewPlanning}
                        size="lg"
                        className="theme-button gap-2"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                    >
                        Plan Another Event
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Contact Information */}
                <div className="text-center mt-12 p-6 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold mb-2">Questions?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Feel free to reach out if you have any questions or need to make changes.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>Call us directly</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>Email support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}