'use client';

import { Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';

interface FlowerPreferencesProps {
    selectedFlowers: string[];
    onToggleFlower: (flower: string) => void;
}

const popularFlowers = [
    'Roses', 'Peonies', 'Hydrangeas', 'Eucalyptus', 'Baby\'s Breath',
    'Ranunculus', 'Anemones', 'Tulips', 'Lilies', 'Orchids',
    'Sunflowers', 'Delphiniums', 'Sweet Peas', 'Freesias', 'Carnations',
    'Chrysanthemums', 'Lavender', 'Succulents', 'Ferns', 'Ivy'
];

export function FlowerPreferences({ selectedFlowers, onToggleFlower }: FlowerPreferencesProps) {
    const { currentTheme } = useTheme();

    return (
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
                            onClick={() => onToggleFlower(flower)}
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
    );
}