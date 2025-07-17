'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import {
    Heart,
    Crown,
    Sparkles,
    Flower2,
    Church,
    PartyPopper,
    Users,
    Check,
    Plus
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';

const serviceSelectionSchema = z.object({
    services: z.array(z.string()).min(1, 'Please select at least one service'),
    ceremony: z.object({
        needed: z.boolean(),
        altarArrangements: z.boolean().optional(),
        aisleDecorations: z.boolean().optional(),
        archDecorations: z.boolean().optional(),
        petalToss: z.boolean().optional(),
    }),
    reception: z.object({
        needed: z.boolean(),
        centerpieces: z.boolean().optional(),
        headTable: z.boolean().optional(),
        cocktailArea: z.boolean().optional(),
        danceFloor: z.boolean().optional(),
    }),
    personal: z.object({
        needed: z.boolean(),
        bridalBouquet: z.boolean().optional(),
        bridesmaidsFlowers: z.boolean().optional(),
        boutonnieres: z.boolean().optional(),
        corsages: z.boolean().optional(),
        flowerGirl: z.boolean().optional(),
    }),
});

type ServiceSelectionForm = z.infer<typeof serviceSelectionSchema>;

export function ServiceSelectionStep() {
    const { data, updateData } = useOnboardingStore();
    const { currentTheme } = useTheme();
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    const form = useForm<ServiceSelectionForm>({
        resolver: zodResolver(serviceSelectionSchema),
        defaultValues: {
            services: data.services || [],
            ceremony: data.ceremony || { needed: false },
            reception: data.reception || { needed: false },
            personal: data.personal || { needed: false },
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData(value);
        });
        return () => subscription.unsubscribe();
    }, [form, updateData]);

    const serviceCategories = [
        {
            id: 'ceremony',
            title: 'Ceremony Arrangements',
            icon: Church,
            description: 'Beautiful floral arrangements for your ceremony space',
            color: currentTheme.colors.primary,
            services: [
                { id: 'altarArrangements', label: 'Altar Arrangements', description: 'Stunning arrangements for the altar area' },
                { id: 'aisleDecorations', label: 'Aisle Decorations', description: 'Petals, arrangements, or lanterns along the aisle' },
                { id: 'archDecorations', label: 'Arch/Backdrop Decorations', description: 'Floral decorations for ceremony arch or backdrop' },
                { id: 'petalToss', label: 'Petal Toss', description: 'Rose petals for the recessional moment' },
            ]
        },
        {
            id: 'reception',
            title: 'Reception Florals',
            icon: PartyPopper,
            description: 'Elegant arrangements to enhance your reception venue',
            color: currentTheme.colors.accent,
            services: [
                { id: 'centerpieces', label: 'Table Centerpieces', description: 'Beautiful centerpieces for guest tables' },
                { id: 'headTable', label: 'Head Table Arrangements', description: 'Special arrangements for the couple\'s table' },
                { id: 'cocktailArea', label: 'Cocktail Area Decor', description: 'Arrangements for cocktail hour space' },
                { id: 'danceFloor', label: 'Dance Floor Decor', description: 'Floral accents around the dance area' },
            ]
        },
        {
            id: 'personal',
            title: 'Personal Flowers',
            icon: Heart,
            description: 'Special floral pieces for the wedding party',
            color: currentTheme.colors.secondary,
            services: [
                { id: 'bridalBouquet', label: 'Bridal Bouquet', description: 'Your dream bouquet for the big day' },
                { id: 'bridesmaidsFlowers', label: 'Bridesmaids Flowers', description: 'Bouquets or alternative arrangements for bridesmaids' },
                { id: 'boutonnieres', label: 'Boutonnieres', description: 'Elegant boutonnieres for groomsmen' },
                { id: 'corsages', label: 'Corsages', description: 'Beautiful corsages for mothers and special guests' },
                { id: 'flowerGirl', label: 'Flower Girl Arrangements', description: 'Petals, baskets, or mini bouquets' },
            ]
        },
    ];

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const getSelectedServicesCount = () => {
        const services = form.watch('services') || [];
        return services.length;
    };

    const isSectionSelected = (sectionId: string) => {
        const sectionData = form.watch(sectionId as keyof ServiceSelectionForm);
        return (sectionData as any)?.needed || false;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                >
                    <Flower2
                        className="h-8 w-8"
                        style={{ color: currentTheme.colors.primary }}
                    />
                </div>
                <h3
                    className="text-2xl font-semibold theme-heading"
                    style={{ fontFamily: currentTheme.fonts.heading }}
                >
                    What floral services do you need?
                </h3>
                <p
                    className="text-muted-foreground max-w-md mx-auto"
                    style={{ fontFamily: currentTheme.fonts.body }}
                >
                    {` Select the floral services you'd like for your special day.
                    You can always adjust these later.`}
                </p>

                {getSelectedServicesCount() > 0 && (
                    <Badge
                        variant="secondary"
                        className="mt-4"
                        style={{
                            backgroundColor: `${currentTheme.colors.primary}10`,
                            color: currentTheme.colors.primary
                        }}
                    >
                        {getSelectedServicesCount()} service{getSelectedServicesCount() !== 1 ? 's' : ''} selected
                    </Badge>
                )}
            </div>

            <Form {...form}>
                <form className="space-y-6">
                    {serviceCategories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = isSectionSelected(category.id);
                        const isExpanded = expandedSections.includes(category.id) || isSelected;

                        return (
                            <Card
                                key={category.id}
                                className={`theme-card transition-all ${isSelected ? 'ring-2' : ''}`}
                                style={{
                                    borderRadius: currentTheme.components.card.borderRadius,
                                    ringColor: isSelected ? category.color : 'transparent'
                                }}
                            >
                                <CardHeader
                                    className="cursor-pointer"
                                    onClick={() => toggleSection(category.id)}
                                >
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${category.color}10` }}
                                            >
                                                <Icon
                                                    className="h-5 w-5"
                                                    style={{ color: category.color }}
                                                />
                                            </div>
                                            <div>
                                                <h4
                                                    className="font-semibold theme-heading"
                                                    style={{ fontFamily: currentTheme.fonts.heading }}
                                                >
                                                    {category.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground font-normal">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {isSelected && (
                                                <Badge
                                                    variant="secondary"
                                                    style={{ backgroundColor: category.color, color: 'white' }}
                                                >
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Selected
                                                </Badge>
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="transition-transform"
                                                style={{ transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>

                                {isExpanded && (
                                    <CardContent className="pt-0">
                                        <div className="space-y-4">
                                            {/* Main Category Toggle */}
                                            <FormField
                                                control={form.control}
                                                name={`${category.id}.needed` as any}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    // Auto-add to services array
                                                                    const currentServices = form.getValues('services') || [];
                                                                    if (checked) {
                                                                        if (!currentServices.includes(category.id)) {
                                                                            form.setValue('services', [...currentServices, category.id]);
                                                                        }
                                                                    } else {
                                                                        form.setValue('services', currentServices.filter(s => s !== category.id));
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel
                                                                className="text-base font-medium cursor-pointer"
                                                                style={{ color: category.color }}
                                                            >
                                                                Yes, I need {category.title.toLowerCase()}
                                                            </FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Specific Services */}
                                            {isSelected && (
                                                <div className="ml-6 pl-4 border-l-2 space-y-3" style={{ borderColor: `${category.color}20` }}>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        {" Select specific services you're interested in:"}
                                                    </p>

                                                    {category.services.map((service) => (
                                                        <FormField
                                                            key={service.id}
                                                            control={form.control}
                                                            name={`${category.id}.${service.id}` as any}
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                    <div className="space-y-1 leading-none">
                                                                        <FormLabel className="text-sm font-medium cursor-pointer">
                                                                            {service.label}
                                                                        </FormLabel>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {service.description}
                                                                        </p>
                                                                    </div>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}

                    <FormField
                        control={form.control}
                        name="services"
                        render={() => (
                            <FormItem>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

            {/* Summary */}
            {getSelectedServicesCount() > 0 && (
                <Card
                    className="theme-card"
                    style={{
                        borderRadius: currentTheme.components.card.borderRadius,
                        backgroundColor: `${currentTheme.colors.primary}05`
                    }}
                >
                    <CardContent className="p-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Sparkles
                                className="h-5 w-5"
                                style={{ color: currentTheme.colors.primary }}
                            />
                            Your Selected Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {serviceCategories
                                .filter(category => isSectionSelected(category.id))
                                .map(category => (
                                    <Badge
                                        key={category.id}
                                        variant="secondary"
                                        style={{
                                            backgroundColor: category.color,
                                            color: 'white'
                                        }}
                                    >
                                        {category.title}
                                    </Badge>
                                ))
                            }
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                            {`We'll create a customized proposal based on your selected services.
                            You can always modify these choices during our consultation.`}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}