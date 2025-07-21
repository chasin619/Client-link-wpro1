'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Heart, Mail, Phone, MessageSquare, Calendar, MapPin, PartyPopper, Users, DollarSign } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';

const personalDetailsSchema = z.object({
    brideName: z.string().min(2, 'Bride name must be at least 2 characters'),
    groomName: z.string().min(2, 'Partner name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    eventType: z.string().min(1, 'Please select an event type'),
    eventDate: z.string().min(1, 'Please select an event date'),
    location: z.string().min(2, 'Please enter the event location'),
    guestCount: z.string().min(1, 'Please select estimated guest count'),
    budgetRange: z.string().optional(),
});

type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;

export function PersonalDetailsStep() {
    const { data, updateData } = useOnboardingStore();
    const { currentTheme } = useTheme();

    const form = useForm<PersonalDetailsForm>({
        resolver: zodResolver(personalDetailsSchema),
        defaultValues: {
            brideName: data.brideName || '',
            groomName: data.groomName || '',
            email: data.email || '',
            phone: data.phone || '',
            eventType: data.eventType || '',
            eventDate: data.eventDate || '',
            location: data.venue || '',
            guestCount: data.guestCount?.toString() || '',
            budgetRange: data.budgetRange || '',
        },
    });

    // Watch form changes and update store
    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData({
                ...value,
                venue: value.location,
                guestCount: value.guestCount ? parseInt(value.guestCount.split('-')[0]) : undefined,
            });
        });
        return () => subscription.unsubscribe();
    }, [form, updateData]);

    const eventTypes = [
        { value: 'wedding', label: 'Wedding' },
        { value: 'engagement', label: 'Engagement' },
        { value: 'anniversary', label: 'Anniversary' },
        { value: 'birthday', label: 'Birthday' },
        { value: 'corporate', label: 'Corporate Event' },
        { value: 'other', label: 'Other' },
    ];

    const guestCounts = [
        { value: '1-25', label: '1-25 guests' },
        { value: '26-50', label: '26-50 guests' },
        { value: '51-100', label: '51-100 guests' },
        { value: '101-150', label: '101-150 guests' },
        { value: '151-200', label: '151-200 guests' },
        { value: '201-300', label: '201-300 guests' },
        { value: '300+', label: '300+ guests' },
    ];

    const budgetRanges = [
        { value: 'under-2000', label: 'Under $2,000' },
        { value: '2000-5000', label: '$2,000 - $5,000' },
        { value: '5000-10000', label: '$5,000 - $10,000' },
        { value: '10000-20000', label: '$10,000 - $20,000' },
        { value: 'over-20000', label: '$20,000+' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    ];

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form className="space-y-4" autoComplete="on">
                    {/* Basic Information */}
                    <Card className="theme-card" style={{ borderRadius: currentTheme.components.card.borderRadius }}>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="brideName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{"Bride's Name *"}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter bride's name"
                                                    className="theme-input"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    autoComplete="given-name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="groomName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{"Partner's Name *"}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter partner's name"
                                                    className="theme-input"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    autoComplete="family-name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    className="theme-input"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="(555) 123-4567"
                                                    className="theme-input"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    autoComplete="tel"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Details */}
                    <Card className="theme-card" style={{ borderRadius: currentTheme.components.card.borderRadius }}>
                        <CardContent className="p-4">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <PartyPopper className="w-4 h-4" style={{ color: currentTheme.colors.accent }} />
                                Event Details
                            </h4>

                            {/* First row: Event Type, Date, Guest Count */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <FormField
                                    control={form.control}
                                    name="eventType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Type *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="theme-input">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {eventTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="eventDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Date *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    className="theme-input"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    autoComplete="bday"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="guestCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Guest Count *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="theme-input">
                                                        <SelectValue placeholder="Select count" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {guestCounts.map((count) => (
                                                        <SelectItem key={count.value} value={count.value}>
                                                            {count.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Second row: Location and Budget */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Event Location *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Venue, address, or location..."
                                                    className="theme-input"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    autoComplete="address-line1"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="budgetRange"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Floral Budget (Optional)
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="theme-input">
                                                        <SelectValue placeholder="Select budget range" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {budgetRanges.map((budget) => (
                                                        <SelectItem key={budget.value} value={budget.value}>
                                                            {budget.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy Note */}
                    <div
                        className="text-center text-xs text-muted-foreground p-3 rounded-lg"
                        style={{ backgroundColor: `${currentTheme.colors.muted}30` }}
                    >
                        🔒 Your information is secure and will only be used to provide you with the best possible service.
                    </div>
                </form>
            </Form>
        </div>
    );
}