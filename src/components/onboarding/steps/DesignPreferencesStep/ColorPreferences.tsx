'use client';

import { Palette } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Control, UseFormSetValue } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { DesignPreferencesForm } from './types';

interface ColorPreferencesProps {
    control: Control<DesignPreferencesForm>;
    setValue: UseFormSetValue<DesignPreferencesForm>;
}

interface ColorPalette {
    name: string;
    colors: string[];
}

const colorPalettes: ColorPalette[] = [
    { name: 'Blush & Cream', colors: ['#FFB6C1', '#FFF8DC', '#F5F5DC'] },
    { name: 'Sage & White', colors: ['#9CAF88', '#FFFFFF', '#F0F8E8'] },
    { name: 'Dusty Blue', colors: ['#6B8CAE', '#E6F3FF', '#FFFFFF'] },
    { name: 'Burgundy & Gold', colors: ['#800020', '#FFD700', '#FFF8DC'] },
    { name: 'Coral & Navy', colors: ['#FF7F7F', '#191970', '#FFFFFF'] },
    { name: 'Lavender & Gray', colors: ['#E6E6FA', '#808080', '#FFFFFF'] },
];

export function ColorPreferences({ control, setValue }: ColorPreferencesProps) {
    const { currentTheme } = useTheme();

    const handlePaletteClick = (palette: ColorPalette) => {
        setValue('colorScheme.primary', palette.colors[0]);
        setValue('colorScheme.secondary', palette.colors[1]);
        setValue('colorScheme.accent', palette.colors[2]);
    };

    return (
        <Card
            className="theme-card"
            style={{ borderRadius: currentTheme.components.card.borderRadius }}
        >
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette
                        className="h-5 w-5"
                        style={{ color: currentTheme.colors.primary }}
                    />
                    Color Preferences
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Pre-defined Palettes */}
                <div>
                    <h5 className="font-medium mb-3">Popular Color Palettes</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {colorPalettes.map((palette) => (
                            <div
                                key={palette.name}
                                className="cursor-pointer p-3 border rounded-lg hover:border-primary/50 transition-all"
                                onClick={() => handlePaletteClick(palette)}
                            >
                                <div className="flex gap-1 mb-2">
                                    {palette.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="w-6 h-6 rounded-full border border-white shadow-sm"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs font-medium">{palette.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Colors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={control}
                        name="colorScheme.primary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Primary Color</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            className="w-12 h-10 p-1 border rounded"
                                            value={field.value || '#FF6B9D'}
                                            onChange={field.onChange}
                                        />
                                        <Input
                                            placeholder="#FF6B9D"
                                            className="theme-input flex-1"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="colorScheme.secondary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Secondary Color</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            className="w-12 h-10 p-1 border rounded"
                                            value={field.value || '#FFFFFF'}
                                            onChange={field.onChange}
                                        />
                                        <Input
                                            placeholder="#FFFFFF"
                                            className="theme-input flex-1"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="colorScheme.accent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Accent Color</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            className="w-12 h-10 p-1 border rounded"
                                            value={field.value || '#C7A2FF'}
                                            onChange={field.onChange}
                                        />
                                        <Input
                                            placeholder="#C7A2FF"
                                            className="theme-input flex-1"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}