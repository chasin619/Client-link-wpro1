'use client';

import { useState } from 'react';
import {
    Flower2,
    Church,
    PartyPopper,
    Heart,
    Check,
    Plus,
    Sparkles
} from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { DesignPreferencesForm } from './types';

interface ServicesSelectionProps {
    control: Control<DesignPreferencesForm>;
    setValue: UseFormSetValue<DesignPreferencesForm>;
    getValues: UseFormGetValues<DesignPreferencesForm>;
    watchServices: string[];
    watchCeremony: any;
    watchReception: any;
    watchPersonal: any;
}

interface ServiceCategory {
    id: string;
    title: string;
    icon: any;
    description: string;
    color: string;
    services: {
        id: string;
        label: string;
        description: string;
    }[];
}

export function ServicesSelection({
    control,
    setValue,
    getValues,
    watchServices,
    watchCeremony,
    watchReception,
    watchPersonal
}: ServicesSelectionProps) {
    const { currentTheme } = useTheme();
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    const serviceCategories: ServiceCategory[] = [
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
        return watchServices?.length || 0;
    };

    const isSectionSelected = (sectionId: string) => {
        const sectionData = sectionId === 'ceremony' ? watchCeremony :
            sectionId === 'reception' ? watchReception :
                watchPersonal;
        return sectionData?.needed || false;
    };

    return (
        <Card
            className="theme-card"
            style={{ borderRadius: currentTheme.components.card.borderRadius }}
        >
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Flower2
                        className="h-5 w-5"
                        style={{ color: currentTheme.colors.primary }}
                    />
                    Floral Services
                    {getSelectedServicesCount() > 0 && (
                        <Badge
                            variant="secondary"
                            className="ml-auto"
                            style={{
                                backgroundColor: `${currentTheme.colors.primary}10`,
                                color: currentTheme.colors.primary
                            }}
                        >
                            {getSelectedServicesCount()} service{getSelectedServicesCount() !== 1 ? 's' : ''} selected
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {serviceCategories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = isSectionSelected(category.id);
                    const isExpanded = expandedSections.includes(category.id) || isSelected;

                    return (
                        <div
                            key={category.id}
                            className={`border rounded-lg transition-all ${isSelected ? 'ring-2' : ''}`}
                            style={{
                                borderRadius: currentTheme.components.card.borderRadius,
                                // ringColor: isSelected ? category.color : 'transparent'
                            }}
                        >
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => toggleSection(category.id)}
                            >
                                <div className="flex items-center justify-between">
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
                                            <h4 className="font-semibold">{category.title}</h4>
                                            <p className="text-sm text-muted-foreground">
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
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="px-4 pb-4">
                                    <div className="space-y-4">
                                        {/* Main Category Toggle */}
                                        <FormField
                                            control={control}
                                            name={`${category.id}.needed` as any}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={(checked) => {
                                                                field.onChange(checked);
                                                                const currentServices = getValues('services') || [];
                                                                if (checked) {
                                                                    if (!currentServices.includes(category.id)) {
                                                                        setValue('services', [...currentServices, category.id]);
                                                                    }
                                                                } else {
                                                                    setValue('services', currentServices.filter(s => s !== category.id));
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
                                                    Select specific services you're interested in:
                                                </p>

                                                {category.services.map((service) => (
                                                    <FormField
                                                        key={service.id}
                                                        control={control}
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
                                </div>
                            )}
                        </div>
                    );
                })}

                <FormField
                    control={control}
                    name="services"
                    render={() => (
                        <FormItem>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Services Summary */}
                {getSelectedServicesCount() > 0 && (
                    <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: `${currentTheme.colors.primary}05` }}
                    >
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
                            We'll create a customized proposal based on your selected services.
                            You can always modify these choices during our consultation.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}