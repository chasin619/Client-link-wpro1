'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, MessageSquare, Loader2, Heart, Clock, CheckCircle, Star } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';
import { useVendorBySlug } from '@/hooks/useVendor';
import { useCreateInquiry } from '@/hooks/useInquiry';
import { toast } from 'sonner';

const expressContactSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    eventDate: z.string().min(1, 'Please select an event date'),
    message: z.string().optional(),
});

type ExpressContactForm = z.infer<typeof expressContactSchema>;

interface ExpressContactStepProps {
    vendorSlug: string;
    onInquiryCreated?: (inquiryId: number) => void;
}

export function ExpressContactStep({
    vendorSlug,
    onInquiryCreated
}: ExpressContactStepProps) {
    const { data, updateData } = useOnboardingStore();
    const { currentTheme } = useTheme();

    const {
        data: vendorData,
        isLoading: isVendorLoading,
        error: vendorError
    } = useVendorBySlug(vendorSlug);

    const createInquiryMutation = useCreateInquiry();
    const [inquiryCreated, setInquiryCreated] = useState(false);

    const form = useForm<ExpressContactForm>({
        resolver: zodResolver(expressContactSchema),
        defaultValues: {
            fullName: data.brideName || '',
            email: data.email || '',
            phone: data.phone || '',
            eventDate: data.eventDate || '',
            message: data.additionalInfo || '',
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData({
                brideName: value.fullName,
                groomName: '',
                email: value.email,
                phone: value.phone,
                eventDate: value.eventDate,
                additionalInfo: value.message,
                eventType: 'wedding',
                venue: 'TBD',
                guestCount: 50,
            });
        });
        return () => subscription.unsubscribe();
    }, [form, updateData]);

    useEffect(() => {
        if (createInquiryMutation.isSuccess && createInquiryMutation.data) {
            setInquiryCreated(true);
            toast.success(createInquiryMutation.data.message);

            if (onInquiryCreated) {
                onInquiryCreated(createInquiryMutation.data.data.inquiryId);
            }
        }
    }, [createInquiryMutation.isSuccess, createInquiryMutation.data, onInquiryCreated]);

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

    const onSubmit = async (formData: ExpressContactForm) => {
        if (!vendorData?.vendor) {
            toast.error('Vendor information not available');
            return;
        }

        if (inquiryCreated || data.inquiryId) {
            return;
        }

        createInquiryMutation.mutate({
            brideName: formData.fullName,
            groomName: '',
            email: formData.email,
            phone: formData.phone,
            eventType: 'wedding',
            eventDate: formData.eventDate,
            location: 'TBD',
            guestCount: '50',
            vendorId: vendorData.vendor.id,
            referredBy: data.referredBy,
            additionalInfo: formData.message,
        });
    };

    if (isVendorLoading) {
        return (
            <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading...</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            {/* Left Side - Information */}
            <div className="space-y-6 flex flex-col justify-center">
                <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                        Quick Contact
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Get in touch with us in under 60 seconds. We'll reach out to discuss your special event.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                            <div className="font-medium text-sm">Quick Response</div>
                            <div className="text-xs text-muted-foreground">We'll contact you within 2 hours</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                            <div className="font-medium text-sm">No Pressure</div>
                            <div className="text-xs text-muted-foreground">Just friendly conversation about your event</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                            <div className="font-medium text-sm">Personalized Service</div>
                            <div className="text-xs text-muted-foreground">Tailored solutions for your special day</div>
                        </div>
                    </div>
                </div>

                {vendorData?.vendor && (
                    <div className="mt-8 p-4 rounded-lg border bg-card">
                        <div className="text-sm font-medium mb-1">You're contacting:</div>
                        <div className="text-lg font-bold" style={{ color: currentTheme.colors.primary }}>
                            {vendorData.vendor.business_name}
                        </div>
                        {vendorData.vendor.rating && (
                            <div className="flex items-center gap-1 mt-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{vendorData.vendor.rating} rating</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {inquiryCreated && (
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    ✅ Thank you! We'll contact you soon!
                                </AlertDescription>
                            </Alert>
                        )}

                        {createInquiryMutation.error && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {createInquiryMutation.error.message || 'Failed to send inquiry. Please try again.'}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Full Name *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your full name"
                                                className="h-11"
                                                autoComplete="name"
                                                disabled={createInquiryMutation.isPending || inquiryCreated}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Email *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    className="h-11"
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
                                            <FormLabel className="text-sm font-medium">
                                                Phone *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="(555) 123-4567"
                                                    className="h-11"
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

                            <FormField
                                control={form.control}
                                name="eventDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Event Date *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="h-11"
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
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Message <span className="text-muted-foreground font-normal">(Optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about your event..."
                                                className="min-h-[80px] resize-none"
                                                disabled={createInquiryMutation.isPending || inquiryCreated}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {!inquiryCreated && (
                            <Button
                                type="submit"
                                disabled={createInquiryMutation.isPending || !form.formState.isValid}
                                className="w-full h-12 text-base font-medium"
                                style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                                {createInquiryMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Inquiry'
                                )}
                            </Button>
                        )}

                        <p className="text-xs text-muted-foreground text-center mt-3">
                            🔒 Your information is secure and will only be used to contact you about your event.
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    );
}