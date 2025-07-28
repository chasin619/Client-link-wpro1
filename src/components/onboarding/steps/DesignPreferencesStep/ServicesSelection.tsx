'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Flower2,
    Church,
    PartyPopper,
    Heart,
    Check,
    Plus,
    Minus,
    Sparkles,
    Loader2,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    CheckCircle
} from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { useVendorArrangements, useVendorArrangementTypes } from '@/hooks/useDesignData';
import { DesignPreferencesForm, VendorArrangement, ServiceCategory } from './types';
import { useEventArrangements } from '@/hooks/use-event-arrangements';
import { useDebounce } from '@/hooks/useDebounce';

type SectionType = 'Personal' | 'Ceremony' | 'Reception' | 'Suggestion';

interface ServicesSelectionProps {
    control: Control<DesignPreferencesForm>;
    setValue: UseFormSetValue<DesignPreferencesForm>;
    getValues: UseFormGetValues<DesignPreferencesForm>;
    watchServices: string[];
    watchCeremony: any;
    watchReception: any;
    watchPersonal: any;
    vendorId: number;
    eventId: number;
}

export function ServicesSelection({
    control,
    setValue,
    getValues,
    watchServices,
    watchCeremony,
    watchReception,
    watchPersonal,
    vendorId,
    eventId
}: ServicesSelectionProps) {
    const { currentTheme } = useTheme();

    // **FIXED**: Initialize with empty array so all sections start collapsed
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [showAllArrangements, setShowAllArrangements] = useState<Record<string, boolean>>({});
    const [selectedArrangements, setSelectedArrangements] = useState<Record<number, { selected: boolean; quantity: number }>>({});

    // Auto-save state
    const [pendingUpdates, setPendingUpdates] = useState<any[]>([]);
    const { bulkUpdate, isUpdating } = useEventArrangements(eventId);
    const debouncedUpdates = useDebounce(pendingUpdates, 1000);

    // Auto-save effect
    useEffect(() => {
        if (debouncedUpdates.length > 0 && !isUpdating) {
            bulkUpdate(debouncedUpdates);
            setPendingUpdates([]);
        }
    }, [debouncedUpdates, bulkUpdate, isUpdating]);

    // Fetch vendor arrangements and types
    const {
        data: arrangementsResponse,
        isLoading: isLoadingArrangements,
        error: arrangementsError
    } = useVendorArrangements(vendorId);

    const {
        data: typesResponse,
        isLoading: isLoadingTypes,
        error: typesError
    } = useVendorArrangementTypes(vendorId);

    const vendorArrangements = arrangementsResponse?.arrangements || [];
    const arrangementTypes = typesResponse?.arrangementTypes || [];

    // Enhanced categorization logic (keeping your existing logic)
    const categorizeArrangements = (): ServiceCategory[] => {
        const categories: ServiceCategory[] = [];

        const ceremonyKeywords = [
            'ceremony', 'altar', 'aisle', 'arch', 'backdrop', 'processional',
            'unity', 'church', 'chapel', 'entrance', 'wedding arch', 'ceremony decor'
        ];

        const receptionKeywords = [
            'reception', 'centerpiece', 'table', 'dining', 'cocktail', 'bar',
            'guest table', 'head table', 'sweetheart', 'cake table', 'buffet',
            'lounge', 'dance floor', 'reception decor'
        ];

        const personalKeywords = [
            'bouquet', 'boutonniere', 'corsage', 'bridal', 'bridesmaid',
            'groomsmen', 'personal', 'handheld', 'wrist', 'lapel', 'hair',
            'flower crown', 'petals', 'toss', 'personal flowers'
        ];

        const matchesCategory = (arrangement: VendorArrangement, keywords: string[]): boolean => {
            const searchText = [
                arrangement.name,
                arrangement.description,
                arrangement.type.name
            ].join(' ').toLowerCase();

            return keywords.some(keyword => searchText.includes(keyword));
        };

        const ceremonyArrangements = vendorArrangements.filter(arr =>
            matchesCategory(arr, ceremonyKeywords)
        );

        const receptionArrangements = vendorArrangements.filter(arr =>
            matchesCategory(arr, receptionKeywords) &&
            !matchesCategory(arr, ceremonyKeywords)
        );

        const personalArrangements = vendorArrangements.filter(arr =>
            matchesCategory(arr, personalKeywords) &&
            !matchesCategory(arr, ceremonyKeywords) &&
            !matchesCategory(arr, receptionKeywords)
        );

        const allCategorizedIds = new Set([
            ...ceremonyArrangements.map(a => a.id),
            ...receptionArrangements.map(a => a.id),
            ...personalArrangements.map(a => a.id)
        ]);

        const uncategorizedArrangements = vendorArrangements.filter(arr =>
            !allCategorizedIds.has(arr.id)
        );

        uncategorizedArrangements.forEach(arrangement => {
            const typeName = arrangement.type.name.toLowerCase();
            if (typeName.includes('ceremony') || typeName.includes('altar')) {
                ceremonyArrangements.push(arrangement);
            } else if (typeName.includes('reception') || typeName.includes('table')) {
                receptionArrangements.push(arrangement);
            } else if (typeName.includes('bouquet') || typeName.includes('personal')) {
                personalArrangements.push(arrangement);
            } else {
                receptionArrangements.push(arrangement);
            }
        });

        if (ceremonyArrangements.length > 0) {
            categories.push({
                id: 'ceremony',
                title: 'Ceremony Arrangements',
                icon: Church,
                description: 'Beautiful floral arrangements for your ceremony space',
                color: currentTheme.colors.primary,
                arrangements: ceremonyArrangements
            });
        }

        if (receptionArrangements.length > 0) {
            categories.push({
                id: 'reception',
                title: 'Reception Florals',
                icon: PartyPopper,
                description: 'Elegant arrangements to enhance your reception venue',
                color: currentTheme.colors.accent || currentTheme.colors.primary,
                arrangements: receptionArrangements
            });
        }

        if (personalArrangements.length > 0) {
            categories.push({
                id: 'personal',
                title: 'Personal Flowers',
                icon: Heart,
                description: 'Special floral pieces for the wedding party',
                color: currentTheme.colors.secondary || currentTheme.colors.primary,
                arrangements: personalArrangements
            });
        }

        return categories;
    };

    const serviceCategories = categorizeArrangements();
    const isLoading = isLoadingArrangements || isLoadingTypes;
    const hasError = arrangementsError || typesError;

    // **FIXED**: Proper toggle function
    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(prev => {
            if (prev.includes(sectionId)) {
                return prev.filter(id => id !== sectionId);
            } else {
                return [...prev, sectionId];
            }
        });
    }, []);

    const toggleShowAll = useCallback((categoryId: string) => {
        setShowAllArrangements(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    }, []);

    // Updated with auto-save
    const updateArrangementQuantity = useCallback((arrangementId: number, quantity: number, categoryId: string) => {
        setSelectedArrangements(prev => ({
            ...prev,
            [arrangementId]: {
                selected: quantity > 0,
                quantity: Math.max(0, quantity)
            }
        }));

        setValue(`${categoryId}.arrangement_${arrangementId}` as any, quantity > 0);
        setValue(`${categoryId}.quantity_${arrangementId}` as any, quantity);

        const getSectionType = (categoryId: string): SectionType => {
            const sectionMap: Record<string, SectionType> = {
                'ceremony': 'Ceremony',
                'reception': 'Reception',
                'personal': 'Personal'
            };
            return sectionMap[categoryId] || 'Suggestion';
        };

        const update = {
            arrangementId,
            section: getSectionType(categoryId),
            quantity: Math.max(0, quantity),
            action: quantity > 0 ? 'upsert' : 'delete',
            slotNo: 1
        };

        setPendingUpdates(prev => [
            ...prev.filter(u => !(u.arrangementId === arrangementId && u.section === update.section)),
            update
        ]);
    }, [setValue]);

    const getSelectedServicesCount = () => {
        return Object.values(selectedArrangements).filter(arr => arr.selected).length;
    };

    const getTotalEstimatedCost = () => {
        return Object.entries(selectedArrangements).reduce((total, [arrangementId, data]) => {
            if (data.selected) {
                const arrangement = vendorArrangements.find(arr => arr.id === parseInt(arrangementId));
                if (arrangement) {
                    return total + (arrangement.price * data.quantity);
                }
            }
            return total;
        }, 0);
    };

    const isSectionSelected = (sectionId: string) => {
        const sectionData = sectionId === 'ceremony' ? watchCeremony :
            sectionId === 'reception' ? watchReception :
                watchPersonal;
        return sectionData?.needed || false;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const INITIAL_DISPLAY_COUNT = 3;

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
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                    {(isUpdating || pendingUpdates.length > 0) && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Saving...</span>
                        </div>
                    )}
                    {getSelectedServicesCount() > 0 && (
                        <Badge
                            variant="secondary"
                            className="ml-auto"
                            style={{
                                backgroundColor: `${currentTheme.colors.primary}10`,
                                color: currentTheme.colors.primary
                            }}
                        >
                            {getSelectedServicesCount()} arrangement{getSelectedServicesCount() !== 1 ? 's' : ''} selected
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Error State */}
                {hasError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600">
                            Failed to load arrangement services. Please try again later.
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading available services...</span>
                        </div>
                    </div>
                )}

                {/* No Services Available */}
                {!isLoading && !hasError && serviceCategories.length === 0 && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <p className="text-sm text-yellow-700">
                            No arrangement services available from this vendor. Please contact the vendor to add service offerings.
                        </p>
                    </div>
                )}

                {/* Vendor Summary */}
                {!isLoading && !hasError && vendorArrangements.length > 0 && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-sm text-blue-700">
                            <strong>{vendorArrangements.length}</strong> arrangements available across <strong>{arrangementTypes.length}</strong> arrangement types.
                            {vendorArrangements.some(a => a.isShared) && (
                                <span className="block mt-1">
                                    Some arrangements marked as "Shared" are available from multiple vendors.
                                </span>
                            )}
                        </p>
                    </div>
                )}

                {/* **FIXED** Service Categories - Now Properly Collapsible */}
                {!isLoading && !hasError && serviceCategories.length > 0 && (
                    <>
                        {serviceCategories.map((category) => {
                            const Icon = category.icon;
                            const isSelected = isSectionSelected(category.id);
                            // **REMOVED** the auto-expand logic - now purely controlled by user clicks
                            const isExpanded = expandedSections.includes(category.id);
                            const showAll = showAllArrangements[category.id] || false;
                            const displayedArrangements = showAll
                                ? category.arrangements
                                : category.arrangements.slice(0, INITIAL_DISPLAY_COUNT);
                            const hasMore = category.arrangements.length > INITIAL_DISPLAY_COUNT;

                            return (
                                <div
                                    key={category.id}
                                    className={`border rounded-lg transition-all duration-200 ${isSelected ? 'ring-2' : ''}`}
                                    style={{
                                        borderRadius: currentTheme.components.card.borderRadius,
                                        ringColor: isSelected ? category.color : 'transparent'
                                    }}
                                >
                                    {/* **CLICKABLE HEADER** */}
                                    <div
                                        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors duration-200"
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
                                                        {category.description} ({category.arrangements.length} available)
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
                                                {/* **FIXED** Chevron rotation */}
                                                <div
                                                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'
                                                        }`}
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* **COLLAPSIBLE CONTENT** */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded
                                            ? 'max-h-[2000px] opacity-100'
                                            : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="px-4 pb-4 border-t">
                                            <div className="space-y-4 pt-4">
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
                                                                            category.arrangements.forEach(arr => {
                                                                                setSelectedArrangements(prev => ({
                                                                                    ...prev,
                                                                                    [arr.id]: { selected: false, quantity: 0 }
                                                                                }));
                                                                            });
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

                                                {/* Available Arrangements */}
                                                {isSelected && (
                                                    <div className="ml-6 pl-4 border-l-2 space-y-3" style={{ borderColor: `${category.color}20` }}>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm text-muted-foreground">
                                                                Available arrangements in this category:
                                                            </p>
                                                            {hasMore && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleShowAll(category.id);
                                                                    }}
                                                                    className="text-xs"
                                                                >
                                                                    {showAll ? (
                                                                        <>
                                                                            <EyeOff className="h-3 w-3 mr-1" />
                                                                            Show Less
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Eye className="h-3 w-3 mr-1" />
                                                                            Show All ({category.arrangements.length})
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-3">
                                                            {displayedArrangements.map((arrangement) => {
                                                                const currentSelection = selectedArrangements[arrangement.id] || { selected: false, quantity: 0 };

                                                                return (
                                                                    <div
                                                                        key={arrangement.id}
                                                                        className={`border rounded-lg transition-all ${currentSelection.selected ? 'ring-1 ring-blue-200 bg-blue-50/30' : 'hover:bg-muted/50'
                                                                            }`}
                                                                    >
                                                                        <div className="p-4 space-y-3">
                                                                            <div className="flex items-start justify-between">
                                                                                <div className="flex-1 space-y-2">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <h5 className="font-medium">{arrangement.name}</h5>
                                                                                            {arrangement.isShared && (
                                                                                                <Badge variant="outline" className="text-xs">
                                                                                                    Shared
                                                                                                </Badge>
                                                                                            )}
                                                                                        </div>
                                                                                        <Badge variant="secondary" className="text-sm font-semibold">
                                                                                            {formatPrice(arrangement.price)} each
                                                                                        </Badge>
                                                                                    </div>

                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        {arrangement.description}
                                                                                    </p>

                                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                                        <Badge variant="outline" className="text-xs">
                                                                                            {arrangement.type.name}
                                                                                        </Badge>

                                                                                        {arrangement.labourTime > 0 && (
                                                                                            <Badge variant="outline" className="text-xs">
                                                                                                {arrangement.labourTime}h labor
                                                                                            </Badge>
                                                                                        )}

                                                                                        {arrangement.ingredientCount > 0 && (
                                                                                            <Badge variant="outline" className="text-xs">
                                                                                                {arrangement.ingredientCount} ingredients
                                                                                            </Badge>
                                                                                        )}

                                                                                        {arrangement.colors.length > 0 && (
                                                                                            <div className="flex gap-1 items-center">
                                                                                                <span className="text-xs text-muted-foreground">Colors:</span>
                                                                                                {arrangement.colors.slice(0, 4).map((color) => (
                                                                                                    <div
                                                                                                        key={color.id}
                                                                                                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                                                                                                        style={{ backgroundColor: color.hexCode }}
                                                                                                        title={color.name}
                                                                                                    />
                                                                                                ))}
                                                                                                {arrangement.colors.length > 4 && (
                                                                                                    <span className="text-xs text-muted-foreground">
                                                                                                        +{arrangement.colors.length - 4}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {arrangement.previewIngredients.length > 0 && (
                                                                                        <div className="text-xs text-muted-foreground">
                                                                                            <span className="font-medium">Includes: </span>
                                                                                            {arrangement.previewIngredients.map((ingredient, idx) => (
                                                                                                <span key={ingredient.flower.id}>
                                                                                                    {ingredient.quantity}x {ingredient.flower.name}
                                                                                                    {idx < arrangement.previewIngredients.length - 1 ? ', ' : ''}
                                                                                                </span>
                                                                                            ))}
                                                                                            {arrangement.ingredientCount > arrangement.previewIngredients.length && (
                                                                                                <span> and {arrangement.ingredientCount - arrangement.previewIngredients.length} more...</span>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* Quantity Selection */}
                                                                            <div
                                                                                className="flex items-center justify-between pt-3 border-t"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <span className="text-sm font-medium">Quantity needed:</span>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0"
                                                                                        onClick={() => updateArrangementQuantity(
                                                                                            arrangement.id,
                                                                                            currentSelection.quantity - 1,
                                                                                            category.id
                                                                                        )}
                                                                                        disabled={currentSelection.quantity <= 0 || isUpdating}
                                                                                    >
                                                                                        <Minus className="h-3 w-3" />
                                                                                    </Button>

                                                                                    <Input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        value={currentSelection.quantity}
                                                                                        onChange={(e) => updateArrangementQuantity(
                                                                                            arrangement.id,
                                                                                            parseInt(e.target.value) || 0,
                                                                                            category.id
                                                                                        )}
                                                                                        className="w-16 h-8 text-center"
                                                                                        disabled={isUpdating}
                                                                                    />

                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="h-8 w-8 p-0"
                                                                                        onClick={() => updateArrangementQuantity(
                                                                                            arrangement.id,
                                                                                            currentSelection.quantity + 1,
                                                                                            category.id
                                                                                        )}
                                                                                        disabled={isUpdating}
                                                                                    >
                                                                                        <Plus className="h-3 w-3" />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>

                                                                            {/* Total Cost for this arrangement */}
                                                                            {currentSelection.selected && currentSelection.quantity > 0 && (
                                                                                <div className="flex justify-between items-center pt-2 border-t bg-green-50/50 px-3 py-2 rounded">
                                                                                    <span className="text-sm font-medium text-green-700">
                                                                                        Subtotal:
                                                                                    </span>
                                                                                    <span className="font-semibold text-green-700">
                                                                                        {formatPrice(arrangement.price * currentSelection.quantity)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
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
                                <h4 className="font-semibold mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles
                                            className="h-5 w-5"
                                            style={{ color: currentTheme.colors.primary }}
                                        />
                                        Your Selected Services
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-lg font-bold"
                                        style={{
                                            backgroundColor: currentTheme.colors.primary,
                                            color: 'white'
                                        }}
                                    >
                                        Total: {formatPrice(getTotalEstimatedCost())}
                                    </Badge>
                                </h4>

                                <div className="space-y-3">
                                    {Object.entries(selectedArrangements).map(([arrangementId, data]) => {
                                        if (!data.selected) return null;

                                        const arrangement = vendorArrangements.find(arr => arr.id === parseInt(arrangementId));
                                        if (!arrangement) return null;

                                        return (
                                            <div key={arrangementId} className="flex items-center justify-between p-3 bg-white rounded border">
                                                <div>
                                                    <span className="font-medium">{arrangement.name}</span>
                                                    <span className="text-sm text-muted-foreground ml-2">
                                                        x {data.quantity}
                                                    </span>
                                                </div>
                                                <span className="font-semibold">
                                                    {formatPrice(arrangement.price * data.quantity)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <p className="text-sm text-muted-foreground mt-3">
                                    This is an estimated total based on your selections. Final pricing will be confirmed during our consultation
                                    and may include additional services, delivery, and setup fees.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}