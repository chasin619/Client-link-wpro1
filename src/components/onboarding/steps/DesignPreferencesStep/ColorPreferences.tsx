'use client';

import { Palette, Loader2, Search, ChevronDown, ChevronUp, Filter, X, Check, Minus } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { useVendorColors } from '@/hooks/useDesignData';
import { DesignPreferencesForm } from './types';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useAutoSaveColors } from '@/hooks/use-event-colors';

interface ColorPreferencesProps {
    control: Control<DesignPreferencesForm>;
    setValue: UseFormSetValue<DesignPreferencesForm>;
    vendorId: number;
    eventId: number;
}

interface ColorPalette {
    name: string;
    colors: string[];
}

interface VendorColor {
    id: number;
    name: string;
    hexCode: string;
    vendorId: number;
    isShared: boolean;
}

type ColorCategory = 'primary' | 'secondary' | 'accent';

const INITIAL_DISPLAY_COUNT = 12;
const MOBILE_DISPLAY_COUNT = 8;

export function ColorPreferences({ control, setValue, vendorId, eventId }: ColorPreferencesProps) {
    const { currentTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFamily, setSelectedFamily] = useState<string>('all');
    const [showAllColors, setShowAllColors] = useState(false);
    const [showAllPalettes, setShowAllPalettes] = useState(false);
    const [activeCategory, setActiveCategory] = useState<ColorCategory>('primary');

    // Refs for tracking state changes
    const lastSavedColorsRef = useRef<string>('');
    const isInitializedRef = useRef(false);

    // Auto-save mutation hook
    const { debouncedUpdate, isLoading: isSaving, error: saveError } = useAutoSaveColors(eventId);

    // Watch current color values with deep comparison
    const watchedColors = useWatch({
        control,
        name: 'colorScheme'
    });

    const {
        data: vendorColorsResponse,
        isLoading: isLoadingColors,
        error: colorsError
    } = useVendorColors(vendorId);

    const vendorColors = vendorColorsResponse?.colors || [];

    // Memoize normalized colors to prevent unnecessary re-renders
    const normalizedColors = useMemo(() => {
        if (!watchedColors || typeof watchedColors !== 'object') {
            return {
                primary: [] as number[],
                secondary: [] as number[],
                accent: [] as number[]
            };
        }

        return {
            primary: Array.isArray(watchedColors.primary) ? watchedColors.primary : [],
            secondary: Array.isArray(watchedColors.secondary) ? watchedColors.secondary : [],
            accent: Array.isArray(watchedColors.accent) ? watchedColors.accent : []
        };
    }, [
        JSON.stringify(watchedColors?.primary || []),
        JSON.stringify(watchedColors?.secondary || []),
        JSON.stringify(watchedColors?.accent || [])
    ]);

    // Memoize serialized colors for comparison
    const serializedColors = useMemo(() => {
        return JSON.stringify(normalizedColors);
    }, [normalizedColors]);

    // Memoize selected colors array
    const allSelectedColors = useMemo(() => {
        const combined = [
            ...normalizedColors.primary,
            ...normalizedColors.secondary,
            ...normalizedColors.accent
        ];
        return [...new Set(combined)]; // Remove duplicates
    }, [normalizedColors]);

    // Auto-save effect with proper change detection
    useEffect(() => {
        // Skip initial render
        if (!isInitializedRef.current) {
            isInitializedRef.current = true;
            lastSavedColorsRef.current = serializedColors;
            return;
        }

        // Only save if colors have actually changed and there are selected colors
        if (allSelectedColors.length > 0 && lastSavedColorsRef.current !== serializedColors) {
            lastSavedColorsRef.current = serializedColors;

            debouncedUpdate({
                colorScheme: normalizedColors,
                selectedColors: allSelectedColors
            });
        }
    }, [serializedColors, allSelectedColors, normalizedColors, debouncedUpdate]);

    // Memoized color family calculation
    const getColorFamily = useCallback((hexCode: string): string => {
        const hex = hexCode.replace('#', '').toLowerCase();
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        if (diff === 0) return 'Gray';

        let hue = 0;
        if (max === r) hue = ((g - b) / diff) % 6;
        else if (max === g) hue = (b - r) / diff + 2;
        else hue = (r - g) / diff + 4;

        hue = Math.round(hue * 60);
        if (hue < 0) hue += 360;

        if (hue < 15 || hue >= 345) return 'Red';
        if (hue < 45) return 'Orange';
        if (hue < 75) return 'Yellow';
        if (hue < 165) return 'Green';
        if (hue < 195) return 'Cyan';
        if (hue < 255) return 'Blue';
        if (hue < 285) return 'Purple';
        return 'Pink';
    }, []);

    // Memoized color families
    const colorFamilies = useMemo(() => {
        const families = ['all', ...new Set(vendorColors.map(color => getColorFamily(color.hexCode)))];
        return families.sort();
    }, [vendorColors, getColorFamily]);

    // Memoized filtered colors
    const filteredColors = useMemo(() => {
        let filtered = vendorColors;
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(color =>
                color.name.toLowerCase().includes(searchLower) ||
                color.hexCode.toLowerCase().includes(searchLower)
            );
        }

        if (selectedFamily !== 'all') {
            filtered = filtered.filter(color =>
                getColorFamily(color.hexCode) === selectedFamily
            );
        }

        return filtered;
    }, [vendorColors, searchTerm, selectedFamily, getColorFamily]);

    // Memoized display count
    const displayCount = useMemo(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768 ? MOBILE_DISPLAY_COUNT : INITIAL_DISPLAY_COUNT;
        }
        return INITIAL_DISPLAY_COUNT;
    }, []);

    // Memoized displayed colors
    const displayedColors = useMemo(() => {
        return showAllColors
            ? filteredColors
            : filteredColors.slice(0, displayCount);
    }, [filteredColors, showAllColors, displayCount]);

    // Memoized color selection status
    const colorSelectionMap = useMemo(() => {
        const map = new Map<number, { isSelected: boolean; category?: ColorCategory }>();

        normalizedColors.primary.forEach(id => {
            map.set(id, { isSelected: true, category: 'primary' });
        });
        normalizedColors.secondary.forEach(id => {
            map.set(id, { isSelected: true, category: 'secondary' });
        });
        normalizedColors.accent.forEach(id => {
            map.set(id, { isSelected: true, category: 'accent' });
        });

        return map;
    }, [normalizedColors]);

    // Optimized click handlers
    const handleVendorColorClick = useCallback((color: VendorColor, e: React.MouseEvent) => {
        e.preventDefault();

        const currentCategoryColors = normalizedColors[activeCategory];
        const isAlreadySelected = currentCategoryColors.includes(color.id);

        if (isAlreadySelected) {
            const updatedColors = currentCategoryColors.filter((id: number) => id !== color.id);
            setValue(`colorScheme.${activeCategory}`, updatedColors);
        } else {
            const updatedColors = [...currentCategoryColors, color.id];
            setValue(`colorScheme.${activeCategory}`, updatedColors);
        }
    }, [normalizedColors, activeCategory, setValue]);

    const isColorSelected = useCallback((color: VendorColor): { isSelected: boolean; category?: ColorCategory } => {
        return colorSelectionMap.get(color.id) || { isSelected: false };
    }, [colorSelectionMap]);

    const removeColorFromCategory = useCallback((colorId: number, category: ColorCategory) => {
        const currentCategoryColors = normalizedColors[category];
        const updatedColors = currentCategoryColors.filter((id: number) => id !== colorId);
        setValue(`colorScheme.${category}`, updatedColors);
    }, [normalizedColors, setValue]);

    // Memoized category helpers
    const getCategoryColor = useCallback((category: ColorCategory): string => {
        switch (category) {
            case 'primary': return '#3B82F6';
            case 'secondary': return '#10B981';
            case 'accent': return '#F59E0B';
            default: return '#6B7280';
        }
    }, []);

    const getCategoryLabel = useCallback((category: ColorCategory): string => {
        switch (category) {
            case 'primary': return 'Primary';
            case 'secondary': return 'Secondary';
            case 'accent': return 'Accent';
            default: return '';
        }
    }, []);

    // Optimized filter clearing
    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedFamily('all');
    }, []);

    // Memoized totals and selections
    const totalSelectedColors = useMemo(() => {
        return normalizedColors.primary.length + normalizedColors.secondary.length + normalizedColors.accent.length;
    }, [normalizedColors]);

    const getSelectedColorsForCategory = useCallback((category: ColorCategory) => {
        const selectedIds = normalizedColors[category];
        return vendorColors.filter(color => selectedIds.includes(color.id));
    }, [normalizedColors, vendorColors]);

    return (
        <Card
            className="theme-card w-full"
            style={{ borderRadius: currentTheme.components.card.borderRadius }}
        >
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Palette
                        className="h-5 w-5 flex-shrink-0"
                        style={{ color: currentTheme.colors.primary }}
                    />
                    <span className="truncate">Color Preferences</span>
                    {totalSelectedColors > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {totalSelectedColors} selected
                        </Badge>
                    )}
                    {/* Show loading/saving state */}
                    {(isLoadingColors || isSaving) && (
                        <Loader2 className="h-4 w-4 animate-spin ml-2 flex-shrink-0" />
                    )}
                    {/* Show save status */}
                    {isSaving && (
                        <Badge variant="outline" className="ml-2 text-xs">
                            Saving...
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                {/* Error States */}
                {colorsError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600">
                            Failed to load vendor colors. Please try again later.
                        </p>
                    </div>
                )}

                {saveError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600">
                            Failed to save color changes: {saveError.message}
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {isLoadingColors && (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm sm:text-base">Loading color palettes...</span>
                        </div>
                    </div>
                )}

                {/* No Colors Available */}
                {!isLoadingColors && !colorsError && vendorColors.length === 0 && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <p className="text-sm text-yellow-700">
                            No colors available from this vendor. Please add colors manually below.
                        </p>
                    </div>
                )}

                {/* Color Category Selection */}
                {!isLoadingColors && vendorColors.length > 0 && (
                    <div>
                        <h5 className="font-medium mb-3 text-sm sm:text-base">Select Color Type</h5>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(['primary', 'secondary', 'accent'] as ColorCategory[]).map((category) => {
                                const categoryCount = normalizedColors[category].length;
                                return (
                                    <Button
                                        key={category}
                                        variant={activeCategory === category ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveCategory(category);
                                        }}
                                        className="relative"
                                        style={{
                                            backgroundColor: activeCategory === category ? getCategoryColor(category) : undefined,
                                            borderColor: getCategoryColor(category),
                                            color: activeCategory === category ? 'white' : getCategoryColor(category)
                                        }}
                                    >
                                        {getCategoryLabel(category)}
                                        {categoryCount > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-2 h-5 min-w-[20px] px-1"
                                                style={{
                                                    backgroundColor: activeCategory === category ? 'rgba(255,255,255,0.2)' : undefined,
                                                    color: activeCategory === category ? 'white' : getCategoryColor(category)
                                                }}
                                            >
                                                {categoryCount}
                                            </Badge>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                            Currently selecting: <span className="font-medium" style={{ color: getCategoryColor(activeCategory) }}>
                                {getCategoryLabel(activeCategory)}
                            </span> colors (click to add/remove)
                        </p>
                    </div>
                )}

                {/* Search and Filter Controls */}
                {!isLoadingColors && vendorColors.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search colors..."
                                    className="pl-10 h-10 sm:h-11"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <select
                                    className="flex-1 px-3 py-2 border rounded-md bg-background text-sm h-10"
                                    value={selectedFamily}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setSelectedFamily(e.target.value);
                                    }}
                                >
                                    {colorFamilies.map(family => (
                                        <option key={family} value={family}>
                                            {family === 'all' ? 'All Colors' : family}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(searchTerm || selectedFamily !== 'all') && (
                            <div className="flex items-start gap-2 flex-wrap">
                                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap mt-1">
                                    Filters:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {searchTerm && (
                                        <Badge variant="secondary" className="text-xs gap-1">
                                            "{searchTerm}"
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="ml-1 hover:text-destructive"
                                                aria-label="Clear search"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                    {selectedFamily !== 'all' && (
                                        <Badge variant="secondary" className="text-xs gap-1">
                                            {selectedFamily}
                                            <button
                                                onClick={() => setSelectedFamily('all')}
                                                className="ml-1 hover:text-destructive"
                                                aria-label="Clear family filter"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                                    Clear all
                                </Button>
                            </div>
                        )}

                        <div className="text-xs sm:text-sm text-muted-foreground">
                            {filteredColors.length === vendorColors.length
                                ? `${vendorColors.length} colors available`
                                : `${filteredColors.length} of ${vendorColors.length} colors match`
                            }
                        </div>
                    </div>
                )}

                {/* Current Selection */}
                {!isLoadingColors && totalSelectedColors > 0 && (
                    <div>
                        <h5 className="font-medium mb-3 text-sm sm:text-base">Current Selection</h5>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(['primary', 'secondary', 'accent'] as ColorCategory[]).map((category) => {
                                const selectedColors = getSelectedColorsForCategory(category);

                                return (
                                    <div key={category} className="bg-gray-50 rounded-lg p-3 min-h-[100px]">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{ backgroundColor: getCategoryColor(category) }}
                                                />
                                                <p className="text-xs font-medium" style={{ color: getCategoryColor(category) }}>
                                                    {getCategoryLabel(category)} ({selectedColors.length})
                                                </p>
                                            </div>
                                            {selectedColors.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setValue(`colorScheme.${category}`, [])}
                                                    className="h-4 px-1 text-xs opacity-60 hover:opacity-100"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                            {selectedColors.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-3 text-center">
                                                    <div
                                                        className="w-6 h-6 rounded-full border border-dashed mb-1 opacity-40"
                                                        style={{ borderColor: getCategoryColor(category) }}
                                                    />
                                                    <p className="text-xs text-muted-foreground">Empty</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-1">
                                                    {selectedColors.map((color) => (
                                                        <div
                                                            key={color.id}
                                                            className="flex items-center gap-1.5 group bg-white rounded p-1.5 border hover:shadow-sm transition-shadow relative"
                                                        >
                                                            <div
                                                                className="w-4 h-4 rounded-full border border-white shadow-sm flex-shrink-0"
                                                                style={{ backgroundColor: color.hexCode }}
                                                                title={`${color.name} (${color.hexCode})`}
                                                            />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-xs truncate">{color.name}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => removeColorFromCategory(color.id, category)}
                                                                className="absolute -top-0.5 -right-0.5 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity bg-white rounded-full p-0.5 shadow-sm border"
                                                                aria-label="Remove color"
                                                            >
                                                                <X className="h-2 w-2" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Vendor Individual Colors */}
                {!isLoadingColors && displayedColors.length > 0 && (
                    <div>
                        <h5 className="font-medium mb-3 text-sm sm:text-base">
                            Available Colors from Vendor
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                                (Click to add/remove from {getCategoryLabel(activeCategory).toLowerCase()})
                            </span>
                        </h5>
                        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 sm:gap-3 mb-4">
                            {displayedColors.map((color) => {
                                const selection = isColorSelected(color);
                                const isCurrentCategorySelected = normalizedColors[activeCategory].includes(color.id);

                                return (
                                    <div
                                        key={color.id}
                                        className="cursor-pointer group touch-manipulation relative"
                                        onClick={(e) => handleVendorColorClick(color, e)}
                                        title={`${color.name} (${color.hexCode})`}
                                    >
                                        <div
                                            className={`w-full aspect-square rounded-lg border-2 shadow-sm group-hover:shadow-md group-active:scale-95 group-hover:scale-105 transition-all duration-200 min-h-[40px] sm:min-h-[50px] ${selection.isSelected
                                                ? 'border-2'
                                                : 'border-white'
                                                }`}
                                            style={{
                                                backgroundColor: color.hexCode,
                                                borderColor: selection.isSelected
                                                    ? getCategoryColor(selection.category!)
                                                    : 'white'
                                            }}
                                        />
                                        {selection.isSelected && (
                                            <div
                                                className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                                                style={{ backgroundColor: getCategoryColor(selection.category!) }}
                                            >
                                                {isCurrentCategorySelected ? <Minus className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                            </div>
                                        )}
                                        <div className="mt-1 text-center">
                                            <p className="text-[10px] sm:text-xs font-medium truncate leading-tight">{color.name}</p>
                                            <p className="text-[9px] sm:text-xs text-muted-foreground font-mono truncate">{color.hexCode}</p>
                                            {selection.isSelected && (
                                                <p className="text-[9px] font-medium truncate" style={{ color: getCategoryColor(selection.category!) }}>
                                                    {getCategoryLabel(selection.category!)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredColors.length > displayCount && (
                            <div className="text-center">
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowAllColors(!showAllColors);
                                    }}
                                    className="gap-2 h-9 sm:h-10 text-sm"
                                >
                                    {showAllColors ? (
                                        <>
                                            <ChevronUp className="h-4 w-4" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4" />
                                            <span className="hidden xs:inline">Show </span>
                                            {filteredColors.length - displayCount} More
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* No Results */}
                {!isLoadingColors && filteredColors.length === 0 && vendorColors.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-2 text-sm">No colors match your search</p>
                        <Button variant="outline" onClick={clearFilters} size="sm">
                            Clear filters
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}