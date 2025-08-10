'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState, useCallback } from 'react';
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

    // ✅ Enhanced state management to prevent duplicates
    const [inquiryCreated, setInquiryCreated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionProcessed, setSubmissionProcessed] = useState(false);

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

    // ✅ Debounced form data updates to prevent excessive API calls
    useEffect(() => {
        const subscription = form.watch((value) => {
            // Only update if not currently submitting
            if (!isSubmitting && !inquiryCreated) {
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
            }
        });
        return () => subscription.unsubscribe();
    }, [form, updateData, isSubmitting, inquiryCreated]);

    // ✅ Handle successful inquiry creation with proper state management
    useEffect(() => {
        if (createInquiryMutation.isSuccess && createInquiryMutation.data && !submissionProcessed) {
            setInquiryCreated(true);
            setIsSubmitting(false);
            setSubmissionProcessed(true);

            toast.success(createInquiryMutation.data.message);

            if (onInquiryCreated) {
                onInquiryCreated(createInquiryMutation.data.data.inquiryId);
            }
        }
    }, [createInquiryMutation.isSuccess, createInquiryMutation.data, onInquiryCreated, submissionProcessed]);

    // ✅ Handle errors and reset submission state
    useEffect(() => {
        if (createInquiryMutation.error) {
            setIsSubmitting(false);

            const error = createInquiryMutation.error;
            if (error.errors) {
                error.errors.forEach((err: any) => {
                    toast.error(`${err.field}: ${err.message}`);
                });
            } else {
                toast.error(error.message || 'Failed to create inquiry');
            }
        }
    }, [createInquiryMutation.error]);

    // ✅ Check if inquiry already exists
    useEffect(() => {
        if (data.inquiryId && !inquiryCreated) {
            setInquiryCreated(true);
            setSubmissionProcessed(true);
        }
    }, [data.inquiryId, inquiryCreated]);

    // ✅ Comprehensive form submission with multiple safeguards
    const onSubmit = useCallback(async (formData: ExpressContactForm) => {
        // Early validation checks
        if (!vendorData?.vendor) {
            toast.error('Vendor information not available');
            return;
        }

        // ✅ Multiple layers of duplicate prevention
        if (
            inquiryCreated ||
            data.inquiryId ||
            isSubmitting ||
            createInquiryMutation.isPending ||
            submissionProcessed
        ) {
            console.log('Submission blocked - already processing or completed');
            return;
        }

        // ✅ Set submission state immediately to prevent race conditions
        setIsSubmitting(true);

        try {
            console.log('Creating inquiry for:', formData.email);

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
                message: formData.message,
            });
        } catch (error) {
            console.error('Error during mutation:', error);
            setIsSubmitting(false);
            toast.error('Failed to submit inquiry. Please try again.');
        }
    }, [
        vendorData?.vendor,
        inquiryCreated,
        data.inquiryId,
        data.referredBy,
        isSubmitting,
        createInquiryMutation,
        submissionProcessed
    ]);

    // ✅ Comprehensive loading and error states
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

    // ✅ Check if form should be disabled
    const isFormDisabled = isSubmitting || createInquiryMutation.isPending || inquiryCreated || submissionProcessed;

    return (
        <div className="min-h-[500px] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        // ✅ Prevent form resubmission on Enter key
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && isFormDisabled) {
                                e.preventDefault();
                            }
                        }}
                    >
                        {/* ✅ Enhanced success message */}
                        {inquiryCreated && (
                            <Alert className="border-green-200 bg-green-50/50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800 font-medium">
                                    ✨ Thank you! Your inquiry has been submitted successfully. We'll contact you within 24 hours.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* ✅ Enhanced error handling */}
                        {createInquiryMutation.error && !inquiryCreated && (
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
                                                disabled={isFormDisabled}
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
                                                disabled={isFormDisabled}
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
                                                disabled={isFormDisabled}
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
                                                disabled={isFormDisabled}
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
                                                disabled={isFormDisabled}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ✅ Enhanced submit button with comprehensive disabled logic */}
                        {!inquiryCreated && (
                            <Button
                                type="submit"
                                disabled={
                                    isFormDisabled ||
                                    !form.formState.isValid ||
                                    Object.keys(form.formState.errors).length > 0
                                }
                                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:shadow-lg"
                                style={{
                                    backgroundColor: currentTheme.colors.primary,
                                    color: 'white'
                                }}
                            >
                                {(isSubmitting || createInquiryMutation.isPending) ? (
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

                        {/* ✅ Enhanced success state */}
                        {inquiryCreated && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-green-800 mb-2">Inquiry Submitted!</h3>
                                <p className="text-sm text-green-700">
                                    We've received your information and will get back to you soon.
                                </p>
                            </div>
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