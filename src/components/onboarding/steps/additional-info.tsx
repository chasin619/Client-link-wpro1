'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import {
    DollarSign,
    Clock,
    MessageSquare,
    AlertTriangle,
    Users,
    Calendar,
    Video,
    Phone
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';

const additionalInfoSchema = z.object({
    budgetRange: z.enum(['under-2000', '2000-5000', '5000-10000', '10000-20000', 'over-20000'], {
        required_error: 'Please select a budget range',
    }),
    timeline: z.enum(['urgent', '1-3months', '3-6months', '6-12months', 'over-year'], {
        required_error: 'Please select your timeline',
    }),
    referralSource: z.string().optional(),
    specialRequests: z.string().optional(),
    allergies: z.string().optional(),
    previousFlorist: z.boolean().optional(),
    consultationPreference: z.enum(['in-person', 'video', 'phone'], {
        required_error: 'Please select your consultation preference',
    }),
});

type AdditionalInfoForm = z.infer<typeof additionalInfoSchema>;

export function AdditionalInfoStep() {
    const { data, updateData } = useOnboardingStore();
    const { currentTheme } = useTheme();

    const form = useForm<AdditionalInfoForm>({
        resolver: zodResolver(additionalInfoSchema),
        defaultValues: {
            budgetRange: data.budgetRange || undefined,
            timeline: data.timeline || undefined,
            referralSource: data.referralSource || '',
            specialRequests: data.specialRequests || '',
            allergies: data.allergies || '',
            previousFlorist: data.previousFlorist || false,
            consultationPreference: data.consultationPreference || undefined,
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData(value);
        });
        return () => subscription.unsubscribe();
    }, [form, updateData]);

    const budgetRanges = [
        { value: 'under-2000', label: 'Under $2,000', description: 'Perfect for intimate celebrations' },
        { value: '2000-5000', label: '$2,000 - $5,000', description: 'Great for small to medium events' },
        { value: '5000-10000', label: '$5,000 - $10,000', description: 'Ideal for full-service arrangements' },
        { value: '10000-20000', label: '$10,000 - $20,000', description: 'Luxury floral experiences' },
        { value: 'over-20000', label: '$20,000+', description: 'Premium, all-inclusive packages' },
    ];

    const timelines = [
        { value: 'urgent', label: 'ASAP (Within 1 month)', description: 'Rush service available', urgent: true },
        { value: '1-3months', label: '1-3 months', description: 'Perfect planning timeframe' },
        { value: '3-6months', label: '3-6 months', description: 'Ideal for detailed planning' },
        { value: '6-12months', label: '6-12 months', description: 'Excellent for seasonal planning' },
        { value: 'over-year', label: 'Over a year', description: 'Plenty of time for custom designs' },
    ];

    const consultationTypes = [
        {
            value: 'in-person',
            label: 'In-Person Meeting',
            icon: Users,
            description: 'Visit our studio or meet at your venue',
            duration: '60-90 minutes'
        },
        {
            value: 'video',
            label: 'Video Call',
            icon: Video,
            description: 'Convenient virtual consultation',
            duration: '45-60 minutes'
        },
        {
            value: 'phone',
            label: 'Phone Call',
            icon: Phone,
            description: 'Quick discussion of your needs',
            duration: '30-45 minutes'
        },
    ];

    const referralSources = [
        'Google Search',
        'Instagram',
        'Facebook',
        'Pinterest',
        'Wedding Planner',
        'Venue Recommendation',
        'Friend/Family',
        'Previous Client',
        'Wedding Website',
        'Bridal Show',
        'Other'
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                >
                    <MessageSquare
                        className="h-8 w-8"
                        style={{ color: currentTheme.colors.primary }}
                    />
                </div>
                <h3
                    className="text-2xl font-semibold theme-heading"
                    style={{ fontFamily: currentTheme.fonts.heading }}
                >
                    Just a few more details
                </h3>
                <p
                    className="text-muted-foreground max-w-md mx-auto"
                    style={{ fontFamily: currentTheme.fonts.body }}
                >
                    These final details help us prepare the perfect proposal and consultation experience for you.
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-6">
                    {/* Budget Range */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign
                                    className="h-5 w-5"
                                    style={{ color: currentTheme.colors.primary }}
                                />
                                Budget Range
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="budgetRange"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="space-y-3"
                                            >
                                                {budgetRanges.map((budget) => (
                                                    <FormItem key={budget.value}>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value={budget.value}
                                                                id={budget.value}
                                                                className="sr-only"
                                                            />
                                                            <label
                                                                htmlFor={budget.value}
                                                                className={`flex-1 cursor-pointer rounded-lg border-2 p-4 transition-all ${field.value === budget.value
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-muted hover:border-primary/50'
                                                                    }`}
                                                                style={{
                                                                    borderRadius: currentTheme.components.card.borderRadius,
                                                                    borderColor: field.value === budget.value
                                                                        ? currentTheme.colors.primary
                                                                        : undefined,
                                                                    backgroundColor: field.value === budget.value
                                                                        ? `${currentTheme.colors.primary}05`
                                                                        : undefined
                                                                }}
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <div>
                                                                        <h4 className="font-semibold">{budget.label}</h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {budget.description}
                                                                        </p>
                                                                    </div>
                                                                    {field.value === budget.value && (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            style={{
                                                                                backgroundColor: currentTheme.colors.primary,
                                                                                color: 'white'
                                                                            }}
                                                                        >
                                                                            Selected
                                                                        </Badge>
                                                                    )}
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

                    {/* Timeline */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock
                                    className="h-5 w-5"
                                    style={{ color: currentTheme.colors.primary }}
                                />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="timeline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                            >
                                                {timelines.map((timeline) => (
                                                    <FormItem key={timeline.value}>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value={timeline.value}
                                                                id={timeline.value}
                                                                className="sr-only"
                                                            />
                                                            <label
                                                                htmlFor={timeline.value}
                                                                className={`flex-1 cursor-pointer rounded-lg border-2 p-4 transition-all ${field.value === timeline.value
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-muted hover:border-primary/50'
                                                                    }`}
                                                                style={{
                                                                    borderRadius: currentTheme.components.card.borderRadius,
                                                                    borderColor: field.value === timeline.value
                                                                        ? currentTheme.colors.primary
                                                                        : undefined,
                                                                    backgroundColor: field.value === timeline.value
                                                                        ? `${currentTheme.colors.primary}05`
                                                                        : undefined
                                                                }}
                                                            >
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="font-semibold">{timeline.label}</h4>
                                                                        {timeline.urgent && (
                                                                            <Badge
                                                                                variant="destructive"
                                                                                className="text-xs"
                                                                            >
                                                                                Rush
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {timeline.description}
                                                                    </p>
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

                    {/* Consultation Preference */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar
                                    className="h-5 w-5"
                                    style={{ color: currentTheme.colors.primary }}
                                />
                                Consultation Preference
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="consultationPreference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                            >
                                                {consultationTypes.map((consultation) => {
                                                    const Icon = consultation.icon;
                                                    return (
                                                        <FormItem key={consultation.value}>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem
                                                                    value={consultation.value}
                                                                    id={consultation.value}
                                                                    className="sr-only"
                                                                />
                                                                <label
                                                                    htmlFor={consultation.value}
                                                                    className={`flex-1 cursor-pointer rounded-lg border-2 p-4 transition-all ${field.value === consultation.value
                                                                        ? 'border-primary bg-primary/5'
                                                                        : 'border-muted hover:border-primary/50'
                                                                        }`}
                                                                    style={{
                                                                        borderRadius: currentTheme.components.card.borderRadius,
                                                                        borderColor: field.value === consultation.value
                                                                            ? currentTheme.colors.primary
                                                                            : undefined,
                                                                        backgroundColor: field.value === consultation.value
                                                                            ? `${currentTheme.colors.primary}05`
                                                                            : undefined
                                                                    }}
                                                                >
                                                                    <div className="text-center space-y-3">
                                                                        <Icon
                                                                            className="h-8 w-8 mx-auto"
                                                                            style={{
                                                                                color: field.value === consultation.value
                                                                                    ? currentTheme.colors.primary
                                                                                    : undefined
                                                                            }}
                                                                        />
                                                                        <div>
                                                                            <h4 className="font-semibold">{consultation.label}</h4>
                                                                            <p className="text-sm text-muted-foreground mb-1">
                                                                                {consultation.description}
                                                                            </p>
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {consultation.duration}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </FormItem>
                                                    );
                                                })}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Referral Source */}
                            <FormField
                                control={form.control}
                                name="referralSource"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>How did you hear about us?</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger
                                                    className="theme-input"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                >
                                                    <SelectValue placeholder="Select source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {referralSources.map((source) => (
                                                        <SelectItem key={source} value={source}>
                                                            {source}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Special Requests */}
                            <FormField
                                control={form.control}
                                name="specialRequests"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Special Requests or Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Any special requirements, themes, or important details we should know..."
                                                className="theme-input min-h-[100px]"
                                                style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Allergies */}
                            <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                            Allergies or Sensitivities
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Any flower allergies or sensitivities to note..."
                                                className="theme-input"
                                                style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Previous Florist */}
                            <FormField
                                control={form.control}
                                name="previousFlorist"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="cursor-pointer">
                                                Have you worked with a florist before?
                                            </FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                This helps us understand your experience level
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
}