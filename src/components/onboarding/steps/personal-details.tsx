'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Heart, Mail, Phone, MessageSquare } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';

const personalDetailsSchema = z.object({
    brideName: z.string().min(2, 'Bride name must be at least 2 characters'),
    groomName: z.string().min(2, 'Partner name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    preferredContact: z.enum(['email', 'phone', 'text'], {
        required_error: 'Please select your preferred contact method',
    }),
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
            preferredContact: data.preferredContact || undefined,
        },
    });

    // Watch form changes and update store
    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData(value);
        });
        return () => subscription.unsubscribe();
    }, [form, updateData]);

    const contactMethods = [
        {
            value: 'email',
            label: 'Email',
            icon: Mail,
            description: 'Receive updates via email'
        },
        {
            value: 'phone',
            label: 'Phone Call',
            icon: Phone,
            description: 'Prefer phone conversations'
        },
        {
            value: 'text',
            label: 'Text Message',
            icon: MessageSquare,
            description: 'Quick updates via SMS'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Message */}
            <div className="text-center space-y-3">
                <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                >
                    <Heart
                        className="h-8 w-8"
                        style={{ color: currentTheme.colors.primary }}
                    />
                </div>
                <h3
                    className="text-2xl font-semibold theme-heading"
                    style={{ fontFamily: currentTheme.fonts.heading }}
                >
                    {"Welcome! Let's get to know you"}
                </h3>
                <p
                    className="text-muted-foreground max-w-md mx-auto"
                    style={{ fontFamily: currentTheme.fonts.body }}
                >
                    {"We're excited to help create the perfect floral arrangements for your special day. Let's start with some basic information."}
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-6">
                    {/* Names Section */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardContent className="p-6">
                            <h4 className="font-semibold mb-4 flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: currentTheme.colors.accent }}
                                />
                                Couple Information
                            </h4>

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

                    {/* Contact Information */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardContent className="p-6">
                            <h4 className="font-semibold mb-4 flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: currentTheme.colors.accent }}
                                />
                                Contact Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Preferred Contact Method */}
                            <FormField
                                control={form.control}
                                name="preferredContact"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel>How would you prefer to be contacted? *</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                            >
                                                {contactMethods.map((method) => (
                                                    <FormItem key={method.value}>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value={method.value}
                                                                id={method.value}
                                                                className="sr-only"
                                                            />
                                                            <label
                                                                htmlFor={method.value}
                                                                className={`flex-1 cursor-pointer rounded-lg border-2 p-4 transition-all ${field.value === method.value
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-muted hover:border-primary/50'
                                                                    }`}
                                                                style={{
                                                                    borderRadius: currentTheme.components.card.borderRadius,
                                                                    borderColor: field.value === method.value
                                                                        ? currentTheme.colors.primary
                                                                        : undefined,
                                                                    backgroundColor: field.value === method.value
                                                                        ? `${currentTheme.colors.primary}05`
                                                                        : undefined
                                                                }}
                                                            >
                                                                <div className="flex flex-col items-center text-center space-y-2">
                                                                    <method.icon
                                                                        className="h-6 w-6"
                                                                        style={{
                                                                            color: field.value === method.value
                                                                                ? currentTheme.colors.primary
                                                                                : undefined
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <div className="font-medium">{method.label}</div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            {method.description}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Privacy Note */}
                    <div
                        className="text-center text-sm text-muted-foreground p-4 rounded-lg"
                        style={{ backgroundColor: `${currentTheme.colors.muted}50` }}
                    >
                        🔒 Your information is secure and will only be used to provide you with the best possible service.
                        We never share your details with third parties.
                    </div>
                </form>
            </Form>
        </div>
    );
}