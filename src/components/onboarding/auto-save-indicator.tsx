'use client';

import { useState, useEffect } from 'react';
import { Check, AlertCircle, Loader2, Cloud, CloudOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';

interface AutoSaveIndicatorProps {
    isSaving: boolean;
    lastSavedAt?: string;
    error?: Error | null;
}

export function AutoSaveIndicator({ isSaving, lastSavedAt, error }: AutoSaveIndicatorProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const { currentTheme } = useTheme();

    useEffect(() => {
        if (!isSaving && lastSavedAt && !error) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isSaving, lastSavedAt, error]);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (error) {
        return (
            <Badge
                variant="destructive"
                className="gap-2 px-3 py-1"
            >
                <CloudOff className="h-3 w-3" />
                <span className="text-xs">Save failed</span>
            </Badge>
        );
    }

    if (isSaving) {
        return (
            <Badge
                variant="secondary"
                className="gap-2 px-3 py-1"
                style={{
                    backgroundColor: `${currentTheme.colors.primary}10`,
                    color: currentTheme.colors.primary
                }}
            >
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-xs">Saving...</span>
            </Badge>
        );
    }

    if (showSuccess) {
        return (
            <Badge
                variant="secondary"
                className="gap-2 px-3 py-1"
                style={{
                    backgroundColor: `${currentTheme.colors.accent}10`,
                    color: currentTheme.colors.accent
                }}
            >
                <Check className="h-3 w-3" />
                <span className="text-xs">Saved!</span>
            </Badge>
        );
    }

    if (lastSavedAt) {
        return (
            <Badge
                variant="outline"
                className="gap-2 px-3 py-1 text-muted-foreground"
            >
                <Cloud className="h-3 w-3" />
                <span className="text-xs">
                    Saved {formatTime(lastSavedAt)}
                </span>
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className="gap-2 px-3 py-1 text-muted-foreground"
        >
            <Cloud className="h-3 w-3" />
            <span className="text-xs">Auto-save enabled</span>
        </Badge>
    );
}