'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Heart, Mail, Phone, MessageSquare, Calendar, MapPin, PartyPopper, Users, DollarSign, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';
import { useVendorBySlug, useVendorEventTypes } from '@/hooks/useVendor';
import { useCreateInquiry } from '@/hooks/useInquiry';
import { toast } from 'sonner';

const personalDetailsSchema = z.object({
    brideName: z.string().min(2, 'Bride name must be at least 2 characters'),
    groomName: z.string().min(2, 'Partner name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    eventType: z.string().min(1, 'Please select an event type'),
    eventDate: z.string().min(1, 'Please select an event date'),
    location: z.string().min(2, 'Please enter the event location'),
    guestCount: z.string().min(1, 'Please enter the number of guests').refine((val) => {
        const num = parseInt(val);
        return num > 0 && num <= 1000;
    }, 'Guest count must be between 1 and 1000'),
    budgetRange: z.string().optional(),
});

type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;

interface PersonalDetailsStepProps {
    vendorSlug: string;
    onInquiryCreated?: (inquiryId: number) => void;
}

export function PersonalDetailsStep({
    vendorSlug,
    onInquiryCreated
}: PersonalDetailsStepProps) {
    const { data, updateData } = useOnboardingStore();
    const { currentTheme } = useTheme();

    // React Query hooks
    const {
        data: vendorData,
        isLoading: isVendorLoading,
        error: vendorError
    } = useVendorBySlug(vendorSlug);

    const vendorId = vendorData?.vendor?.id;
    const {
        data: eventTypesData,
        isLoading: isEventTypesLoading
    } = useVendorEventTypes(vendorId!);

    const createInquiryMutation = useCreateInquiry();

    const [inquiryCreated, setInquiryCreated] = useState(false);

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

        },
    });

    // Watch form changes and update store
    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData({
                ...value,
                venue: value.location,
                guestCount: value.guestCount ? parseInt(value.guestCount) : undefined,
            });
        });
        return () => subscription.unsubscribe();
    }, [form, updateData]);

    // Handle successful inquiry creation
    useEffect(() => {
        if (createInquiryMutation.isSuccess && createInquiryMutation.data) {
            setInquiryCreated(true);
            toast.success(createInquiryMutation.data.message);

            if (onInquiryCreated) {
                onInquiryCreated(createInquiryMutation.data.data.inquiryId);
            }
        }
    }, [createInquiryMutation.isSuccess, createInquiryMutation.data, onInquiryCreated]);

    // Handle errors
    useEffect(() => {
        if (createInquiryMutation.error) {
            const error = createInquiryMutation.error;
            if (error.errors) {
                error.errors.forEach((err: any) => {
                    toast.error(`${err.path.join('.')}: ${err.message}`);
                });
            } else {
                toast.error(error.message || 'Failed to create inquiry');
            }
        }
    }, [createInquiryMutation.error]);
    useEffect(() => {
        if (data.inquiryId) {
            setInquiryCreated(true);
        }
    }, [data.inquiryId]);

    const onSubmit = async (formData: PersonalDetailsForm) => {
        if (!vendorData?.vendor) {
            toast.error('Vendor information not available');
            return;
        }

        if (inquiryCreated || data.inquiryId) {
            return; // Already created
        }

        createInquiryMutation.mutate({
            ...formData,
            vendorId: vendorData.vendor.id,
            referredBy: data.referredBy,
        });
    };

    const isLoading = isVendorLoading || isEventTypesLoading;

    // Get event types - use vendor's types or fallback to defaults
    const eventTypes = eventTypesData?.eventTypes || [
        { id: null, name: 'wedding' },
        { id: null, name: 'engagement' },
        { id: null, name: 'anniversary' },
        { id: null, name: 'birthday' },
        { id: null, name: 'corporate' },
        { id: null, name: 'other' },
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

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading vendor information...</p>
                </div>
            </div>
        );
    }

    if (vendorError) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Unable to load vendor information. Please try refreshing the page.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="on">
                    {/* Success Alert */}
                    {inquiryCreated && (
                        <Alert className="border-green-200 bg-green-50">
                            <AlertDescription className="text-green-800">
                                ✅ Your inquiry has been created successfully! You can now continue with your preferences.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {createInquiryMutation.error && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {createInquiryMutation.error.message || 'Failed to create inquiry. Please try again.'}
                            </AlertDescription>
                        </Alert>
                    )}

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
                                                    disabled={createInquiryMutation.isPending || inquiryCreated}
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
                                                    disabled={createInquiryMutation.isPending || inquiryCreated}
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
                                                    disabled={createInquiryMutation.isPending || inquiryCreated}
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
                                                    disabled={createInquiryMutation.isPending || inquiryCreated}
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
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={createInquiryMutation.isPending || inquiryCreated}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="theme-input">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {eventTypes.map((type) => (
                                                        <SelectItem key={type.name} value={type.name}>
                                                            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
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
                                                    disabled={createInquiryMutation.isPending || inquiryCreated}
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
                                            <FormLabel className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Guest Count *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter number of guests"
                                                    min="1"
                                                    max="1000"
                                                    className="theme-input"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    disabled={createInquiryMutation.isPending || inquiryCreated}
                                                    {...field}
                                                />
                                            </FormControl>
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
                                                    disabled={createInquiryMutation.isPending || inquiryCreated}
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
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={createInquiryMutation.isPending || inquiryCreated}
                                            >
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

                    {/* Submit Button */}
                    {!inquiryCreated && (
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={createInquiryMutation.isPending || !form.formState.isValid}
                                className="px-8 py-2"
                                style={{
                                    backgroundColor: currentTheme.colors.primary,
                                    borderRadius: currentTheme.components.button.borderRadius
                                }}
                            >
                                {createInquiryMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating Inquiry...
                                    </>
                                ) : (
                                    'Create Inquiry'
                                )}
                            </Button>
                        </div>
                    )}

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