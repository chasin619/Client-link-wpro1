'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    DollarSign,
    Heart,
    Crown,
    Sparkles
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useQuickOnboardingStore } from '@/store/use-quick-onboarding-store';
import { useTheme } from '@/hooks/use-theme';

const quickEventSchema = z.object({
    eventDate: z.string().min(1, 'Event date is required'),
    eventType: z.enum(['wedding', 'engagement', 'anniversary', 'other'], {
        required_error: 'Please select your event type',
    }),
    venue: z.string().optional(),
    guestCount: z.number().min(1).max(1000),
    budgetRange: z.enum(['under-2000', '2000-5000', '5000-10000', '10000-20000', 'over-20000']).optional(),
    services: z.array(z.string()),
    specialRequests: z.string().optional(),
});

type QuickEventForm = z.infer<typeof quickEventSchema>;

export function QuickEventDetails() {
    const { data, updateData } = useQuickOnboardingStore();
    const { currentTheme } = useTheme();

    const form = useForm<QuickEventForm>({
        resolver: zodResolver(quickEventSchema),
        defaultValues: {
            eventDate: data.eventDate || '',
            eventType: data.eventType || undefined,
            venue: data.venue || '',
            guestCount: data.guestCount || 50,
            budgetRange: data.budgetRange || undefined,
            services: data.services || [],
            specialRequests: data.specialRequests || '',
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData(value);
        });
        return () => subscription.unsubscribe();
    }, [form, updateData]);

    const eventTypes = [
        { value: 'wedding', label: 'Wedding', emoji: '💒', color: currentTheme.colors.primary },
        { value: 'engagement', label: 'Engagement', emoji: '💍', color: currentTheme.colors.accent },
        { value: 'anniversary', label: 'Anniversary', emoji: '🥂', color: currentTheme.colors.secondary },
        { value: 'other', label: 'Other Event', emoji: '🎉', color: currentTheme.colors.primary },
    ];

    const budgetRanges = [
        { value: 'under-2000', label: 'Under $2,000' },
        { value: '2000-5000', label: '$2,000 - $5,000' },
        { value: '5000-10000', label: '$5,000 - $10,000' },
        { value: '10000-20000', label: '$10,000 - $20,000' },
        { value: 'over-20000', label: '$20,000+' },
    ];

    const quickServices = [
        { id: 'bridal-bouquet', label: 'Bridal Bouquet', icon: Heart },
        { id: 'ceremony', label: 'Ceremony Arrangements', icon: Crown },
        { id: 'reception', label: 'Reception Centerpieces', icon: Sparkles },
        { id: 'personal-flowers', label: 'Personal Flowers', icon: Heart },
        { id: 'venue-decor', label: 'Venue Decoration', icon: Crown },
    ];

    const getCurrentRange = (count: number) => {
        if (count <= 25) return 'Intimate';
        if (count <= 75) return 'Small';
        if (count <= 150) return 'Medium';
        if (count <= 300) return 'Large';
        return 'Grand';
    };

    return (
        <div className="space-y-4">

            <Form {...form}>
                <form className="space-y-4">
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardContent className="p-4 space-y-4">
                            {/* Section Header */}
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
                                Event Information
                            </h4>

                            {/* Event Type */}
                            <FormField
                                control={form.control}
                                name="eventType"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-xs">Event Type *</FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {eventTypes.map((type) => (
                                                    <div
                                                        key={type.value}
                                                        className={`cursor-pointer rounded border-2 p-2 transition-all text-center ${field.value === type.value
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-muted hover:border-primary/50'
                                                            }`}
                                                        style={{
                                                            borderRadius: currentTheme.components.card.borderRadius,
                                                            borderColor: field.value === type.value
                                                                ? type.color
                                                                : undefined,
                                                        }}
                                                        onClick={() => field.onChange(type.value)}
                                                    >
                                                        <div className="text-lg mb-1">{type.emoji}</div>
                                                        <div className="text-xs font-medium">{type.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Event Date & Venue */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="eventDate"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-xs flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Event Date *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
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
                                    name="venue"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-xs flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                Venue (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Venue or location"
                                                    className="theme-input h-8"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Size & Budget */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardContent className="p-4 space-y-4">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <Users className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
                                Size & Budget
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Guest Count */}
                                <FormField
                                    control={form.control}
                                    name="guestCount"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs flex items-center justify-between">
                                                <span>Expected Guests</span>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs px-2 py-0.5"
                                                    style={{
                                                        backgroundColor: `${currentTheme.colors.accent}10`,
                                                        color: currentTheme.colors.accent
                                                    }}
                                                >
                                                    {getCurrentRange(field.value || 50)}
                                                </Badge>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Slider
                                                        min={1}
                                                        max={500}
                                                        step={5}
                                                        value={[field.value || 50]}
                                                        onValueChange={(value) => field.onChange(value[0])}
                                                        className="w-full"
                                                    />
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>1</span>
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {field.value || 50}
                                                        </span>
                                                        <span>500+</span>
                                                    </div>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Budget Range */}
                                <FormField
                                    control={form.control}
                                    name="budgetRange"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-xs flex items-center gap-1">
                                                <DollarSign className="h-3 w-3" />
                                                Budget Range (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger
                                                        className="theme-input h-8"
                                                        style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    >
                                                        <SelectValue placeholder="Select range" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {budgetRanges.map((range) => (
                                                            <SelectItem key={range.value} value={range.value}>
                                                                {range.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services & Special Requests Combined */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardContent className="p-4 space-y-4">
                            {/* Services Section */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                    <Heart className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
                                    Services Needed
                                </h4>

                                <FormField
                                    control={form.control}
                                    name="services"
                                    render={() => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs">Select floral services:</FormLabel>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {quickServices.map((service) => {
                                                    const Icon = service.icon;
                                                    return (
                                                        <FormField
                                                            key={service.id}
                                                            control={form.control}
                                                            name="services"
                                                            render={({ field }) => {
                                                                const isChecked = field.value?.includes(service.id) || false;
                                                                return (
                                                                    <FormItem>
                                                                        <div className="flex items-center space-x-2">
                                                                            <Checkbox
                                                                                id={service.id}
                                                                                checked={isChecked}
                                                                                onCheckedChange={(checked) => {
                                                                                    const currentValue = field.value || [];
                                                                                    if (checked) {
                                                                                        field.onChange([...currentValue, service.id]);
                                                                                    } else {
                                                                                        field.onChange(currentValue.filter(v => v !== service.id));
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <label
                                                                                htmlFor={service.id}
                                                                                className="flex items-center gap-2 cursor-pointer"
                                                                            >
                                                                                <Icon className="h-3 w-3" />
                                                                                <span className="text-xs font-medium">{service.label}</span>
                                                                            </label>
                                                                        </div>
                                                                    </FormItem>
                                                                );
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Special Requests Section with Divider */}
                            <div className="border-t pt-4 space-y-2">
                                <FormField
                                    control={form.control}
                                    name="specialRequests"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-xs">Special Requests or Notes (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Any specific ideas, themes, or requirements..."
                                                    className="theme-input min-h-[60px] text-xs"
                                                    style={{ borderRadius: currentTheme.components.input.borderRadius }}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
}