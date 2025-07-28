'use client';

import { useState, useRef, useEffect } from 'react';
import { Eye, Upload, LinkIcon, X, ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { DesignPreferencesForm } from './types';
import { useEventInspirations, useAddEventInspirations, useDeleteEventInspiration } from '@/hooks/use-event-inspirations';
import { Inspiration } from '@/types/event';
import { toast } from 'sonner';

interface InspirationSectionProps {
    control: Control<DesignPreferencesForm>;
    setValue: UseFormSetValue<DesignPreferencesForm>;
    getValues: UseFormGetValues<DesignPreferencesForm>;
    watchInspirationUrls: string[] | undefined;
    eventId: number; // Add eventId prop
}

export function InspirationSection({
    control,
    setValue,
    getValues,
    watchInspirationUrls,
    eventId
}: InspirationSectionProps) {
    const { currentTheme } = useTheme();
    const [newInspirationUrl, setNewInspirationUrl] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [pendingUrls, setPendingUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // API hooks
    const { data: inspirations = [], isLoading } = useEventInspirations(eventId);
    const addInspirationsMutation = useAddEventInspirations(eventId);
    const deleteInspirationMutation = useDeleteEventInspiration(eventId);

    // Extract Pinterest/Instagram metadata
    const extractUrlMetadata = (url: string) => {
        if (url.includes('pinterest.com')) {
            return { source: 'pinterest', title: 'Pinterest Pin' };
        } else if (url.includes('instagram.com')) {
            return { source: 'instagram', title: 'Instagram Post' };
        }
        return { source: 'other', title: 'Inspiration Link' };
    };

    // Add URL to pending list
    const addInspirationUrl = () => {
        if (newInspirationUrl.trim()) {
            setPendingUrls(prev => [...prev, newInspirationUrl.trim()]);
            setNewInspirationUrl('');
        }
    };

    // Remove pending URL
    const removePendingUrl = (url: string) => {
        setPendingUrls(prev => prev.filter(u => u !== url));
    };

    // Remove pending file
    const removePendingFile = (fileName: string) => {
        setPendingFiles(prev => prev.filter(f => f.name !== fileName));
    };

    // Save all pending inspirations
    const savePendingInspirations = async () => {
        if (pendingFiles.length === 0 && pendingUrls.length === 0) return;

        try {
            await addInspirationsMutation.mutateAsync({
                images: pendingFiles.length > 0 ? pendingFiles : undefined,
                imageUrls: pendingUrls.length > 0 ? pendingUrls : undefined,
            });

            // Clear pending items on success
            setPendingFiles([]);
            setPendingUrls([]);

            // Update form state
            const currentUrls = getValues('inspirationUrls') || [];
            setValue('inspirationUrls', [...currentUrls, ...pendingUrls]);

            toast.success('Inspirations added successfully!');
        } catch (error) {
            toast.error('Failed to save inspirations');
            console.error('Save error:', error);
        }
    };

    // Delete saved inspiration
    const deleteInspiration = async (inspiration: Inspiration) => {
        try {
            await deleteInspirationMutation.mutateAsync(inspiration.id);
            toast.success('Inspiration deleted');
        } catch (error) {
            toast.error('Failed to delete inspiration');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addInspirationUrl();
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const items = Array.from(e.dataTransfer.items);
        const newFiles: File[] = [];

        items.forEach(item => {
            if (item.type === 'text/uri-list') {
                item.getAsString((url) => {
                    if (url && (url.includes('pinterest.com') || url.includes('instagram.com') || url.startsWith('http'))) {
                        setPendingUrls(prev => [...prev, url]);
                    }
                });
            } else if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    newFiles.push(file);
                }
            }
        });

        if (newFiles.length > 0) {
            setPendingFiles(prev => [...prev, ...newFiles]);
        }
    };

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setPendingFiles(prev => [...prev, ...files]);
    };

    const getSourceIcon = (source?: string) => {
        switch (source) {
            case 'pinterest': return '📌';
            case 'instagram': return '📷';
            default: return '🔗';
        }
    };

    const getSourceColor = (source?: string) => {
        switch (source) {
            case 'pinterest': return '#E60023';
            case 'instagram': return '#E4405F';
            default: return currentTheme.colors.primary;
        }
    };

    const totalItems = inspirations.length + pendingFiles.length + pendingUrls.length;
    const hasPendingItems = pendingFiles.length > 0 || pendingUrls.length > 0;

    return (
        <Card className="theme-card" style={{ borderRadius: currentTheme.components.card.borderRadius }}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                    Inspiration
                    {totalItems > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                            {totalItems} item{totalItems !== 1 ? 's' : ''}
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Share links to Pinterest boards, Instagram posts, or upload images:
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

                {/* Drag and Drop Area */}
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="space-y-3">
                        <div className="flex justify-center items-center gap-3">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-2xl">📌</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                Drag images from Pinterest or upload files
                            </p>
                            <p className="text-xs text-muted-foreground">
                                You can drag Pinterest images directly, paste URLs, or upload local files
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="theme-button"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Files
                            </Button>
                            <Badge variant="outline" className="text-xs">
                                PNG, JPG up to 5MB each
                            </Badge>
                        </div>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Save Button */}
                {hasPendingItems && (
                    <Button
                        type="button"
                        onClick={savePendingInspirations}
                        disabled={addInspirationsMutation.isPending}
                        className="w-full theme-button"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                    >
                        {addInspirationsMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            `Save ${pendingFiles.length + pendingUrls.length} Inspiration${pendingFiles.length + pendingUrls.length !== 1 ? 's' : ''}`
                        )}
                    </Button>
                )}

                {/* Display Items */}
                {(inspirations.length > 0 || hasPendingItems) && (
                    <FormField
                        control={control}
                        name="inspirationUrls"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-3">
                                    <h6 className="font-medium text-sm flex items-center gap-2">
                                        Your inspiration collection:
                                        <Badge variant="outline" className="text-xs">
                                            {totalItems}
                                        </Badge>
                                    </h6>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Saved Inspirations */}
                                        {inspirations.map((inspiration) => (
                                            <div
                                                key={inspiration.id}
                                                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="shrink-0 w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={inspiration.imageUrl}
                                                        alt="Inspiration"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-medium truncate">
                                                                Inspiration Image
                                                            </p>
                                                            <Badge variant="outline" className="text-xs mt-1">
                                                                Saved
                                                            </Badge>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteInspiration(inspiration)}
                                                            disabled={deleteInspirationMutation.isPending}
                                                            className="shrink-0 h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Pending URLs */}
                                        {pendingUrls.map((url, index) => {
                                            const metadata = extractUrlMetadata(url);
                                            return (
                                                <div
                                                    key={`pending-url-${index}`}
                                                    className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                                                >
                                                    <div className="shrink-0 w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                                                        <span className="text-lg">{getSourceIcon(metadata.source)}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-medium truncate">
                                                                    {metadata.title}
                                                                </p>
                                                                <a
                                                                    href={url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-muted-foreground hover:text-primary truncate block"
                                                                >
                                                                    {url}
                                                                </a>
                                                                <Badge variant="outline" className="text-xs mt-1 bg-yellow-100">
                                                                    Pending
                                                                </Badge>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removePendingUrl(url)}
                                                                className="shrink-0 h-6 w-6 p-0"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Pending Files */}
                                        {pendingFiles.map((file, index) => (
                                            <div
                                                key={`pending-file-${index}`}
                                                className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                                            >
                                                <div className="shrink-0 w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-medium truncate">
                                                                {file.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {(file.size / 1024 / 1024).toFixed(1)} MB
                                                            </p>
                                                            <Badge variant="outline" className="text-xs mt-1 bg-blue-100">
                                                                Pending Upload
                                                            </Badge>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removePendingFile(file.name)}
                                                            className="shrink-0 h-6 w-6 p-0"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                )}

                {isLoading && (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading inspirations...</span>
                    </div>
                )}
            </CardContent>
        </Card >
    );
}