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
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground">Loading vendor information...</p>
                </div>
            </div>
        );
    }

    if (vendorError) {
        return (
            <div className="min-h-[400px] flex items-center justify-center px-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>
                        Unable to load vendor information. Please try refreshing the page.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-[500px] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {inquiryCreated && (
                            <Alert className="border-green-200 bg-green-50/50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800 font-medium">
                                    ✨ Thank you! We'll contact you within 24 hours.
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
                                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                                            <span>Full Name</span>
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your full name"
                                                className="h-11 focus:ring-2 focus:ring-primary/20 transition-all"
                                                autoComplete="name"
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
                                        <FormLabel className="text-sm font-medium flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            Email
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="your@email.com"
                                                className="h-11 focus:ring-2 focus:ring-primary/20 transition-all"
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
                                        <FormLabel className="text-sm font-medium flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            Phone
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="(555) 123-4567"
                                                className="h-11 focus:ring-2 focus:ring-primary/20 transition-all"
                                                autoComplete="tel"
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
                                name="eventDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Event Date
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="h-11 focus:ring-2 focus:ring-primary/20 transition-all"
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
                                        <FormLabel className="text-sm font-medium flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            Message
                                            <span className="text-muted-foreground font-normal text-xs ml-1">(Optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about your special day..."
                                                className="min-h-[80px] resize-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                style={{
                                    backgroundColor: currentTheme.colors.primary,
                                    color: 'white'
                                }}
                            >
                                {createInquiryMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending Inquiry...
                                    </>
                                ) : (
                                    <>
                                        <Heart className="w-4 h-4 mr-2" />
                                        Send Inquiry
                                    </>
                                )}
                            </Button>
                        )}

                        <div className="text-center">
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                🔒 Your information is secure and private
                            </p>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}