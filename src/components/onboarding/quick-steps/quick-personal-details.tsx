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
import { useQuickOnboardingStore } from '@/store/use-quick-onboarding-store';
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

export function QuickPersonalDetailsStep() {
    const { data, updateData } = useQuickOnboardingStore();
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
        },
        {
            value: 'phone',
            label: 'Phone',
            icon: Phone,
        },
        {
            value: 'text',
            label: 'Text',
            icon: MessageSquare,
        },
    ];

    return (
        <div className="space-y-4">

            <Form {...form}>
                <form className="space-y-4">
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardContent className="p-4">
                            <div className="space-y-3 mb-4">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                    <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: currentTheme.colors.accent }}
                                    />
                                    Couple Information
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="brideName"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-xs">Bride's Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter bride's name"
                                                        className="theme-input h-8"
                                                        style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="groomName"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-xs">Partner's Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter partner's name"
                                                        className="theme-input h-8"
                                                        style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 border-t pt-4">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                    <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: currentTheme.colors.accent }}
                                    />
                                    Contact Details
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-xs">Email *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="your.email@example.com"
                                                        className="theme-input h-8"
                                                        style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-xs">Phone *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="(555) 123-4567"
                                                        className="theme-input h-8"
                                                        style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
}