'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import {
    Palette,
    Heart,
    Sparkles,
    Upload,
    X,
    Eye,
    Link as LinkIcon
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useTheme } from '@/hooks/use-theme';

const designPreferencesSchema = z.object({
    colorScheme: z.object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        accent: z.string().optional(),
    }),
    style: z.enum(['romantic', 'modern', 'rustic', 'luxury', 'boho', 'classic'], {
        required_error: 'Please select a style preference',
    }),
    flowerPreferences: z.array(z.string()),
    inspirationUrls: z.array(z.string()).optional(),
});

type DesignPreferencesForm = z.infer<typeof designPreferencesSchema>;

export function DesignPreferencesStep() {
    const { data, updateData } = useOnboardingStore();
    const { currentTheme } = useTheme();
    const [newInspirationUrl, setNewInspirationUrl] = useState('');
    const [selectedFlowers, setSelectedFlowers] = useState<string[]>(data.flowerPreferences || []);

    const form = useForm<DesignPreferencesForm>({
        resolver: zodResolver(designPreferencesSchema),
        defaultValues: {
            colorScheme: data.colorScheme || {},
            style: data.style || undefined,
            flowerPreferences: data.flowerPreferences || [],
            inspirationUrls: data.inspirationUrls || [],
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateData({ ...value, flowerPreferences: selectedFlowers });
        });
        return () => subscription.unsubscribe();
    }, [form, updateData, selectedFlowers]);

    const styles = [
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

    const popularFlowers = [
        'Roses', 'Peonies', 'Hydrangeas', 'Eucalyptus', 'Baby\'s Breath',
        'Ranunculus', 'Anemones', 'Tulips', 'Lilies', 'Orchids',
        'Sunflowers', 'Delphiniums', 'Sweet Peas', 'Freesias', 'Carnations',
        'Chrysanthemums', 'Lavender', 'Succulents', 'Ferns', 'Ivy'
    ];

    const colorPalettes = [
        { name: 'Blush & Cream', colors: ['#FFB6C1', '#FFF8DC', '#F5F5DC'] },
        { name: 'Sage & White', colors: ['#9CAF88', '#FFFFFF', '#F0F8E8'] },
        { name: 'Dusty Blue', colors: ['#6B8CAE', '#E6F3FF', '#FFFFFF'] },
        { name: 'Burgundy & Gold', colors: ['#800020', '#FFD700', '#FFF8DC'] },
        { name: 'Coral & Navy', colors: ['#FF7F7F', '#191970', '#FFFFFF'] },
        { name: 'Lavender & Gray', colors: ['#E6E6FA', '#808080', '#FFFFFF'] },
    ];

    const toggleFlower = (flower: string) => {
        setSelectedFlowers(prev =>
            prev.includes(flower)
                ? prev.filter(f => f !== flower)
                : [...prev, flower]
        );
    };

    const addInspirationUrl = () => {
        if (newInspirationUrl.trim()) {
            const currentUrls = form.getValues('inspirationUrls') || [];
            form.setValue('inspirationUrls', [...currentUrls, newInspirationUrl.trim()]);
            setNewInspirationUrl('');
        }
    };

    const removeInspirationUrl = (index: number) => {
        const currentUrls = form.getValues('inspirationUrls') || [];
        form.setValue('inspirationUrls', currentUrls.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                >
                    <Palette
                        className="h-8 w-8"
                        style={{ color: currentTheme.colors.primary }}
                    />
                </div>
                <h3
                    className="text-2xl font-semibold theme-heading"
                    style={{ fontFamily: currentTheme.fonts.heading }}
                >
                    Share your design vision
                </h3>
                <p
                    className="text-muted-foreground max-w-md mx-auto"
                    style={{ fontFamily: currentTheme.fonts.body }}
                >
                    Help us understand your style preferences so we can create arrangements
                    that perfectly match your vision.
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-6">
                    {/* Style Selection */}
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
                                control={form.control}
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

                    {/* Color Scheme */}
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
                                            onClick={() => {
                                                form.setValue('colorScheme.primary', palette.colors[0]);
                                                form.setValue('colorScheme.secondary', palette.colors[1]);
                                                form.setValue('colorScheme.accent', palette.colors[2]);
                                            }}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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

                    {/* Flower Preferences */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart
                                    className="h-5 w-5"
                                    style={{ color: currentTheme.colors.primary }}
                                />
                                Flower Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Select flowers you love or would like to include in your arrangements:
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {popularFlowers.map((flower) => (
                                    <Button
                                        key={flower}
                                        type="button"
                                        variant={selectedFlowers.includes(flower) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleFlower(flower)}
                                        className="theme-button"
                                        style={{
                                            backgroundColor: selectedFlowers.includes(flower)
                                                ? currentTheme.colors.primary
                                                : 'transparent',
                                            borderColor: currentTheme.colors.primary,
                                            color: selectedFlowers.includes(flower)
                                                ? 'white'
                                                : currentTheme.colors.primary,
                                        }}
                                    >
                                        {flower}
                                    </Button>
                                ))}
                            </div>

                            {selectedFlowers.length > 0 && (
                                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                                    <p className="text-sm font-medium mb-2">Selected flowers:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedFlowers.map((flower) => (
                                            <Badge
                                                key={flower}
                                                variant="secondary"
                                                style={{
                                                    backgroundColor: currentTheme.colors.primary,
                                                    color: 'white'
                                                }}
                                            >
                                                {flower}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Inspiration */}
                    <Card
                        className="theme-card"
                        style={{ borderRadius: currentTheme.components.card.borderRadius }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye
                                    className="h-5 w-5"
                                    style={{ color: currentTheme.colors.primary }}
                                />
                                Inspiration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Share links to Pinterest boards, Instagram posts, or other inspiration images:
                            </p>

                            {/* Add URL */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Paste Pinterest or Instagram URL..."
                                    value={newInspirationUrl}
                                    onChange={(e) => setNewInspirationUrl(e.target.value)}
                                    className="theme-input flex-1"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addInspirationUrl();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={addInspirationUrl}
                                    disabled={!newInspirationUrl.trim()}
                                    className="theme-button"
                                    style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                    <LinkIcon className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Display added URLs */}
                            <FormField
                                control={form.control}
                                name="inspirationUrls"
                                render={({ field }) => (
                                    <FormItem>
                                        {field.value && field.value.length > 0 && (
                                            <div className="space-y-2">
                                                <h6 className="font-medium text-sm">Your inspiration links:</h6>
                                                {field.value.map((url, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                                                    >
                                                        <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-primary hover:underline truncate flex-1"
                                                        >
                                                            {url}
                                                        </a>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeInspirationUrl(index)}
                                                            className="shrink-0 h-6 w-6 p-0"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* File Upload Area */}
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-2">
                                    Or upload your own inspiration images
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="theme-button"
                                >
                                    Choose Files
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">
                                    PNG, JPG up to 10MB each
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
}