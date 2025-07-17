'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Edit,
    Check,
    User,
    Calendar,
    MapPin,
    Users,
    Heart,
    Palette,
    DollarSign,
    Clock,
    Phone,
    Mail,
    MessageSquare,
    Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';

interface PreviewSummaryProps {
    vendorSlug: string;
}

export function PreviewSummary({ vendorSlug }: PreviewSummaryProps) {
    const router = useRouter();
    const { data, goToStep, goBackFromPreview, markCompleted } = useOnboardingStore();
    const { currentTheme } = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Mark as completed
            markCompleted();

            // Navigate to completion page
            router.push(`/${vendorSlug}/onboard/complete`);
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getBudgetLabel = (budget?: string) => {
        const budgetMap = {
            'under-2000': 'Under $2,000',
            '2000-5000': '$2,000 - $5,000',
            '5000-10000': '$5,000 - $10,000',
            '10000-20000': '$10,000 - $20,000',
            'over-20000': '$20,000+'
        };
        return budgetMap[budget as keyof typeof budgetMap] || 'Not specified';
    };

    const getTimelineLabel = (timeline?: string) => {
        const timelineMap = {
            'urgent': 'ASAP (Within 1 month)',
            '1-3months': '1-3 months',
            '3-6months': '3-6 months',
            '6-12months': '6-12 months',
            'over-year': 'Over a year'
        };
        return timelineMap[timeline as keyof typeof timelineMap] || 'Not specified';
    };

    const getSelectedServices = () => {
        const services = [];
        if (data.ceremony?.needed) services.push('Ceremony Arrangements');
        if (data.reception?.needed) services.push('Reception Florals');
        if (data.personal?.needed) services.push('Personal Flowers');
        return services;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                >
                    <Check
                        className="h-8 w-8"
                        style={{ color: currentTheme.colors.primary }}
                    />
                </div>
                <h3
                    className="text-2xl font-semibold theme-heading"
                    style={{ fontFamily: currentTheme.fonts.heading }}
                >
                    Review Your Information
                </h3>
                <p
                    className="text-muted-foreground max-w-md mx-auto"
                    style={{ fontFamily: currentTheme.fonts.body }}
                >
                    Please review your information below. You can edit any section by clicking the edit button.
                </p>
            </div>

            {/* Personal Details Section */}
            <Card
                className="theme-card"
                style={{ borderRadius: currentTheme.components.card.borderRadius }}
            >
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User
                                className="h-5 w-5"
                                style={{ color: currentTheme.colors.primary }}
                            />
                            Personal Details
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => goToStep(1)}
                            className="flex items-center gap-1"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3">Couple Information</h4>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">{"Bride's Name"}</p>
                                    <p className="font-medium">{data.brideName || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{"Partner's Name"}</p>
                                    <p className="font-medium">{data.groomName || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3">Contact Information</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{data.email || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{data.phone || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    <Badge variant="outline" className="text-xs">
                                        Prefers {data.preferredContact || 'email'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Event Details Section */}
            <Card
                className="theme-card"
                style={{ borderRadius: currentTheme.components.card.borderRadius }}
            >
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar
                                className="h-5 w-5"
                                style={{ color: currentTheme.colors.primary }}
                            />
                            Event Details
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => goToStep(2)}
                            className="flex items-center gap-1"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Event Date</p>
                            <p className="font-medium">{formatDate(data.eventDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Event Type</p>
                            <Badge
                                variant="secondary"
                                style={{
                                    backgroundColor: `${currentTheme.colors.accent}10`,
                                    color: currentTheme.colors.accent
                                }}
                            >
                                {data.eventType || 'Not specified'}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Venue</p>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{data.venue || 'Not specified'}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Guest Count</p>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{data.guestCount || 'Not specified'} guests</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Venue Type</p>
                            <Badge variant="outline">
                                {data.isOutdoorVenue ? 'Outdoor' : 'Indoor'}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Time</p>
                            <p className="text-sm">{data.eventTime || 'Not specified'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Services Section */}
            <Card
                className="theme-card"
                style={{ borderRadius: currentTheme.components.card.borderRadius }}
            >
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Heart
                                className="h-5 w-5"
                                style={{ color: currentTheme.colors.primary }}
                            />
                            Selected Services
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => goToStep(3)}
                            className="flex items-center gap-1"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {getSelectedServices().length > 0 ? (
                            <>
                                <div className="flex flex-wrap gap-2">
                                    {getSelectedServices().map((service) => (
                                        <Badge
                                            key={service}
                                            variant="secondary"
                                            style={{
                                                backgroundColor: currentTheme.colors.primary,
                                                color: 'white'
                                            }}
                                        >
                                            {service}
                                        </Badge>
                                    ))}
                                </div>

                                <Separator />

                                {/* Detailed Service Breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {data.ceremony?.needed && (
                                        <div>
                                            <h5 className="font-semibold mb-2">Ceremony</h5>
                                            <div className="space-y-1 text-sm">
                                                {data.ceremony.altarArrangements && <p>• Altar Arrangements</p>}
                                                {data.ceremony.aisleDecorations && <p>• Aisle Decorations</p>}
                                                {data.ceremony.archDecorations && <p>• Arch Decorations</p>}
                                                {data.ceremony.petalToss && <p>• Petal Toss</p>}
                                            </div>
                                        </div>
                                    )}

                                    {data.reception?.needed && (
                                        <div>
                                            <h5 className="font-semibold mb-2">Reception</h5>
                                            <div className="space-y-1 text-sm">
                                                {data.reception.centerpieces && <p>• Table Centerpieces</p>}
                                                {data.reception.headTable && <p>• Head Table</p>}
                                                {data.reception.cocktailArea && <p>• Cocktail Area</p>}
                                                {data.reception.danceFloor && <p>• Dance Floor</p>}
                                            </div>
                                        </div>
                                    )}

                                    {data.personal?.needed && (
                                        <div>
                                            <h5 className="font-semibold mb-2">Personal</h5>
                                            <div className="space-y-1 text-sm">
                                                {data.personal.bridalBouquet && <p>• Bridal Bouquet</p>}
                                                {data.personal.bridesmaidsFlowers && <p>• Bridesmaids Flowers</p>}
                                                {data.personal.boutonnieres && <p>• Boutonnieres</p>}
                                                {data.personal.corsages && <p>• Corsages</p>}
                                                {data.personal.flowerGirl && <p>• Flower Girl</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">
                                No services selected yet. Click Edit to add services.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Design Preferences Section */}
            <Card
                className="theme-card"
                style={{ borderRadius: currentTheme.components.card.borderRadius }}
            >
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Palette
                                className="h-5 w-5"
                                style={{ color: currentTheme.colors.primary }}
                            />
                            Design Preferences
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => goToStep(4)}
                            className="flex items-center gap-1"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Style */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Style Preference</p>
                            {data.style ? (
                                <Badge
                                    variant="secondary"
                                    className="text-base px-3 py-1"
                                    style={{
                                        backgroundColor: `${currentTheme.colors.primary}10`,
                                        color: currentTheme.colors.primary
                                    }}
                                >
                                    {data.style.charAt(0).toUpperCase() + data.style.slice(1)}
                                </Badge>
                            ) : (
                                <p className="text-muted-foreground">Not specified</p>
                            )}
                        </div>

                        {/* Colors */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Color Scheme</p>
                            <div className="flex gap-2">
                                {data.colorScheme?.primary && (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: data.colorScheme.primary }}
                                        />
                                        <span className="text-sm">Primary</span>
                                    </div>
                                )}
                                {data.colorScheme?.secondary && (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: data.colorScheme.secondary }}
                                        />
                                        <span className="text-sm">Secondary</span>
                                    </div>
                                )}
                                {data.colorScheme?.accent && (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: data.colorScheme.accent }}
                                        />
                                        <span className="text-sm">Accent</span>
                                    </div>
                                )}
                                {!data.colorScheme?.primary && !data.colorScheme?.secondary && !data.colorScheme?.accent && (
                                    <p className="text-muted-foreground">No colors specified</p>
                                )}
                            </div>
                        </div>

                        {/* Flower Preferences */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Flower Preferences</p>
                            {data.flowerPreferences && data.flowerPreferences.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {data.flowerPreferences.map((flower) => (
                                        <Badge key={flower} variant="outline" className="text-xs">
                                            {flower}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No flower preferences specified</p>
                            )}
                        </div>

                        {/* Inspiration */}
                        {data.inspirationUrls && data.inspirationUrls.length > 0 && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Inspiration Links</p>
                                <div className="space-y-1">
                                    {data.inspirationUrls.map((url, index) => (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline block truncate"
                                        >
                                            {url}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Budget & Timeline Section */}
            <Card
                className="theme-card"
                style={{ borderRadius: currentTheme.components.card.borderRadius }}
            >
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DollarSign
                                className="h-5 w-5"
                                style={{ color: currentTheme.colors.primary }}
                            />
                            Budget & Timeline
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => goToStep(5)}
                            className="flex items-center gap-1"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Budget Range</p>
                            </div>
                            <p className="font-medium">{getBudgetLabel(data.budgetRange)}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Timeline</p>
                            </div>
                            <p className="font-medium">{getTimelineLabel(data.timeline)}</p>
                        </div>
                    </div>

                    {(data.specialRequests || data.allergies || data.consultationPreference) && (
                        <>
                            <Separator className="my-4" />
                            <div className="space-y-3">
                                {data.consultationPreference && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Consultation Preference</p>
                                        <Badge variant="outline">{data.consultationPreference}</Badge>
                                    </div>
                                )}
                                {data.specialRequests && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Special Requests</p>
                                        <p className="text-sm">{data.specialRequests}</p>
                                    </div>
                                )}
                                {data.allergies && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Allergies</p>
                                        <p className="text-sm">{data.allergies}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Submit Section */}
            <Card
                className="theme-card"
                style={{
                    borderRadius: currentTheme.components.card.borderRadius,
                    backgroundColor: `${currentTheme.colors.primary}05`
                }}
            >
                <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                        <div>
                            <h3
                                className="text-2xl font-bold theme-heading mb-2"
                                style={{ fontFamily: currentTheme.fonts.heading }}
                            >
                                Ready to Submit?
                            </h3>
                            <p className="text-muted-foreground">
                                {` Once you submit this information, we'll review it and get back to you with a
                                customized proposal within 24-48 hours.`}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="outline"
                                onClick={goBackFromPreview}
                                className="gap-2"
                                disabled={isSubmitting}
                            >
                                <Edit className="h-4 w-4" />
                                Make Changes
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                size="lg"
                                className="gap-2 theme-button"
                                style={{
                                    backgroundColor: currentTheme.colors.primary,
                                    borderRadius: currentTheme.components.button.borderRadius
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit My Information
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}