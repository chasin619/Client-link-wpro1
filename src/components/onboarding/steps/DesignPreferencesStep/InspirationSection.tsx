'use client';

import { useState } from 'react';
import { Eye, Upload, LinkIcon, X } from 'lucide-react';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { DesignPreferencesForm } from './types';

interface InspirationSectionProps {
    control: Control<DesignPreferencesForm>;
    setValue: UseFormSetValue<DesignPreferencesForm>;
    getValues: UseFormGetValues<DesignPreferencesForm>;
    watchInspirationUrls: string[] | undefined;
}

export function InspirationSection({
    control,
    setValue,
    getValues,
    watchInspirationUrls
}: InspirationSectionProps) {
    const { currentTheme } = useTheme();
    const [newInspirationUrl, setNewInspirationUrl] = useState('');

    const addInspirationUrl = () => {
        if (newInspirationUrl.trim()) {
            const currentUrls = getValues('inspirationUrls') || [];
            setValue('inspirationUrls', [...currentUrls, newInspirationUrl.trim()]);
            setNewInspirationUrl('');
        }
    };

    const removeInspirationUrl = (index: number) => {
        const currentUrls = getValues('inspirationUrls') || [];
        setValue('inspirationUrls', currentUrls.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addInspirationUrl();
        }
    };

    return (
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
                        onKeyPress={handleKeyPress}
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
                    control={control}
                    name="inspirationUrls"
                    render={({ field }) => (
                        <FormItem>
                            {watchInspirationUrls && watchInspirationUrls.length > 0 && (
                                <div className="space-y-2">
                                    <h6 className="font-medium text-sm">Your inspiration links:</h6>
                                    {watchInspirationUrls.map((url, index) => (
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
        </Card >
    );
}