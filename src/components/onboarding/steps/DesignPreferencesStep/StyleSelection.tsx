'use client';

import { Sparkles } from 'lucide-react';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Control } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { DesignPreferencesForm, StyleOption } from './types';

interface StyleSelectionProps {
    control: Control<DesignPreferencesForm>;
}

const styles: StyleOption[] = [
    {
        id: 'romantic',
        name: 'Romantic',
        description: 'Soft, dreamy, and full of love',
        colors: ['#FFB6C1', '#FFC0CB', '#E6E6FA'],
        keywords: ['Soft pastels', 'Flowing lines', 'Delicate textures']
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean, sophisticated, and contemporary',
        colors: ['#FFFFFF', '#F5F5F5', '#2C3E50'],
        keywords: ['Geometric shapes', 'Monochromatic', 'Minimalist']
    },
    {
        id: 'rustic',
        name: 'Rustic',
        description: 'Natural, earthy, and charming',
        colors: ['#8B4513', '#DEB887', '#F4A460'],
        keywords: ['Natural textures', 'Warm tones', 'Organic shapes']
    },
    {
        id: 'luxury',
        name: 'Luxury',
        description: 'Opulent, grand, and sophisticated',
        colors: ['#FFD700', '#C0C0C0', '#800080'],
        keywords: ['Rich textures', 'Metallic accents', 'Bold statements']
    },
    {
        id: 'boho',
        name: 'Bohemian',
        description: 'Free-spirited, eclectic, and artistic',
        colors: ['#DEB887', '#CD853F', '#8FBC8F'],
        keywords: ['Mixed textures', 'Unconventional', 'Earthy palette']
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Timeless, elegant, and traditional',
        colors: ['#FFFFFF', '#FFFAF0', '#B22222'],
        keywords: ['Traditional arrangements', 'Refined elegance', 'Timeless beauty']
    },
];

export function StyleSelection({ control }: StyleSelectionProps) {
    const { currentTheme } = useTheme();

    return (
        <Card
            className="theme-card"
            style={{ borderRadius: currentTheme.components.card.borderRadius }}
        >
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles
                        className="h-5 w-5"
                        style={{ color: currentTheme.colors.primary }}
                    />
                    Style Preference
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FormField
                    control={control}
                    name="style"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {styles.map((style) => (
                                        <div
                                            key={style.id}
                                            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${field.value === style.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'
                                                }`}
                                            style={{
                                                borderRadius: currentTheme.components.card.borderRadius,
                                                borderColor: field.value === style.id
                                                    ? currentTheme.colors.primary
                                                    : undefined,
                                                backgroundColor: field.value === style.id
                                                    ? `${currentTheme.colors.primary}05`
                                                    : undefined
                                            }}
                                            onClick={() => field.onChange(style.id)}
                                        >
                                            <div className="space-y-3">
                                                {/* Color palette preview */}
                                                <div className="flex gap-1">
                                                    {style.colors.map((color, index) => (
                                                        <div
                                                            key={index}
                                                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold">{style.name}</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {style.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {style.keywords.map((keyword) => (
                                                            <Badge
                                                                key={keyword}
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {keyword}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}