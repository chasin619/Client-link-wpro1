'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Sun, Moon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';

const eventDetailsSchema = z.object({
    eventDate: z.string().min(1, 'Event date is required'),
    eventTime: z.string().optional(),
    eventType: z.enum(['wedding', 'engagement', 'anniversary', 'other'], {
        required_error: 'Please select your event type',
    }),
    venue: z.string().min(2, 'Venue information is required'),
    guestCount: z.number().min(1, 'Guest count must be at least 1').max(1000),
    isOutdoorVenue: z.boolean().optional(),
});

type EventDetailsForm = z.infer<typeof eventDetailsSchema>;

export function EventDetailsStep() {
    const { data, updateData } = useOnboardingStore();
    const { currentTheme } = useTheme();

    const form = useForm<EventDetailsForm>({
        resolver: zodResolver(eventDetailsSchema),
        defaultValues: {
            eventDate: data.eventDate || '',
            eventTime: data.eventTime || '',
            eventType: data.eventType || undefined,
            venue: data.venue || '',
            guestCount: data.guestCount || 50,
            isOutdoorVenue: data.isOutdoorVenue || false,
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData(value);
        });
        return () => subscription.unsubscribe();
    }, [form, updateData]);

    const eventTypes = [
        { value: 'wedding', label: 'Wedding', emoji: '💒', description: 'Wedding ceremony and/or reception' },
        { value: 'engagement', label: 'Engagement', emoji: '💍', description: 'Engagement party or announcement' },
        { value: 'anniversary', label: 'Anniversary', emoji: '🥂', description: 'Anniversary celebration' },
        { value: 'other', label: 'Other', emoji: '🎉', description: 'Other special occasion' },
    ];

    const guestCountRanges = [
        { min: 1, max: 25, label: 'Intimate (1-25)' },
        { min: 26, max: 75, label: 'Small (26-75)' },
        { min: 76, max: 150, label: 'Medium (76-150)' },
        { min: 151, max: 300, label: 'Large (151-300)' },
        { min: 301, max: 1000, label: 'Grand (300+)' },
    ];

    const getCurrentRange = (count: number) => {
        return guestCountRanges.find(range => count >= range.min && count <= range.max)?.label || 'Custom';
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                >
                    <Calendar
                        className="h-8 w-8"
                        style={{ color: currentTheme.colors.primary }}
                    />
                </div>
                <h3
                    className="text-2xl font-semibold theme-heading"
                    style={{ fontFamily: currentTheme.fonts.heading }}
                >
                    Tell us about your special event
                </h3>
                <p
                    className="text-muted-foreground max-w-md mx-auto"
                    style={{ fontFamily: currentTheme.fonts.body }}
                >
                    Understanding your event details helps us create the perfect floral arrangements
                    tailored to your venue and guest count.
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-6">
                    {/* Event Type */}
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
                                Event Type
                            </h4>

                            <FormField
                                control={form.control}
                                name="eventType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                                            >
                                                {eventTypes.map((type) => (
                                                    <FormItem key={type.value}>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value={type.value}
                                                                id={type.value}
                                                                className="sr-only"
                                                            />
                                                            <label
                                                                htmlFor={type.value}
                                                                className={`flex-1 cursor-pointer rounded-lg border-2 p-4 transition-all ${field.value === type.value
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-muted hover:border-primary/50'
                                                                    }`}
                                                                style={{
                                                                    borderRadius: currentTheme.components.card.borderRadius,
                                                                    borderColor: field.value === type.value
                                                                        ? currentTheme.colors.primary
                                                                        : undefined,
                                                                    backgroundColor: field.value === type.value
                                                                        ? `${currentTheme.colors.primary}05`
                                                                        : undefined
                                                                }}
                                                            >
                                                                <div className="text-center space-y-2">
                                                                    <div className="text-2xl">{type.emoji}</div>
                                                                    <div className="font-medium">{type.label}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {type.description}
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

                    {/* Date and Time */}
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
                                Date & Time
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="eventDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Event Date *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
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
                                    name="eventTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Event Time (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger
                                                        className="theme-input"
                                                        style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    >
                                                        <SelectValue placeholder="Select time" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                                                        <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                                                        <SelectItem value="evening">Evening (5 PM - 10 PM)</SelectItem>
                                                        <SelectItem value="night">Night (10 PM+)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Venue Information */}
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
                                Venue Information
                            </h4>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="venue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Venue Name or Location *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., The Grand Ballroom, Central Park, etc."
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
                                    name="isOutdoorVenue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Venue Type</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={(value) => field.onChange(value === 'true')}
                                                    value={field.value ? 'true' : 'false'}
                                                    className="flex gap-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="false" id="indoor" />
                                                        <label htmlFor="indoor" className="flex items-center gap-2 cursor-pointer">
                                                            <Moon className="h-4 w-4" />
                                                            Indoor
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="true" id="outdoor" />
                                                        <label htmlFor="outdoor" className="flex items-center gap-2 cursor-pointer">
                                                            <Sun className="h-4 w-4" />
                                                            Outdoor
                                                        </label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Guest Count */}
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
                                Guest Count
                            </h4>

                            <FormField
                                control={form.control}
                                name="guestCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Expected Number of Guests
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                style={{
                                                    backgroundColor: `${currentTheme.colors.accent}10`,
                                                    color: currentTheme.colors.accent
                                                }}
                                            >
                                                {getCurrentRange(field.value || 50)}
                                            </Badge>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                <Slider
                                                    min={1}
                                                    max={500}
                                                    step={5}
                                                    value={[field.value || 50]}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>1</span>
                                                    <span className="text-lg font-semibold text-foreground">
                                                        {field.value || 50} guests
                                                    </span>
                                                    <span>500+</span>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
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