'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { themes, type Theme, } from '@/config/themes';

interface ThemeContextType {
    currentTheme: Theme;
    applyTheme: (theme: Theme) => void;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
    vendorSlug: string;
    context?: 'landing' | 'onboarding' | 'client';
}

export function ThemeProvider({
    children,
    vendorSlug,
    context = 'landing'
}: ThemeProviderProps) {
    const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
    const [isLoading, setIsLoading] = useState(true);

    const applyTheme = (theme: Theme) => {
        if (typeof document === 'undefined') return;

        const root = document.documentElement;

        // Apply theme data attribute
        root.setAttribute('data-theme', theme.name);

        // Apply CSS custom properties for colors (RGB values for Tailwind)
        const colorEntries = Object.entries(theme.colors);
        colorEntries.forEach(([key, value]) => {
            const rgb = hexToRgb(value);
            if (rgb) {
                root.style.setProperty(`--color-${kebabCase(key)}`, `${rgb.r} ${rgb.g} ${rgb.b}`);
            }
        });

        // Apply font variables
        root.style.setProperty('--font-heading', theme.fonts.heading);
        root.style.setProperty('--font-body', theme.fonts.body);

        // Apply component styles
        root.style.setProperty('--button-radius', theme.components.button.borderRadius);
        root.style.setProperty('--card-radius', theme.components.card.borderRadius);
        root.style.setProperty('--input-radius', theme.components.input.borderRadius);

        // Apply transition
        root.style.setProperty('--transition', theme.animations.transition);

        // Load Google Fonts dynamically
        loadGoogleFonts([theme.fonts.heading, theme.fonts.body]);

        setCurrentTheme(theme);
    };

    // Load vendor's theme on mount
    useEffect(() => {
        const loadVendorTheme = async () => {
            setIsLoading(true);

            try {
                let themeToLoad = 'elegant-rose'; // Default theme

                // Priority 1: Check URL parameters first (for testing)
                if (typeof window !== 'undefined') {
                    const urlParams = new URLSearchParams(window.location.search);
                    const urlTheme = urlParams.get('theme');
                    if (urlTheme && themes.find(t => t.name === urlTheme)) {
                        console.log('🎨 Loading theme from URL:', urlTheme);
                        themeToLoad = urlTheme;

                        // Apply URL theme immediately and exit
                        const theme = themes.find(t => t.name === themeToLoad);
                        if (theme) {
                            applyTheme(theme);
                            setIsLoading(false);
                            return;
                        }
                    }
                }

                // Priority 2: Check localStorage in development
                if (process.env.NODE_ENV === 'development') {
                    const devTheme = localStorage.getItem('dev-theme');
                    if (devTheme && themes.find(t => t.name === devTheme)) {
                        console.log('🎨 Loading theme from localStorage:', devTheme);
                        themeToLoad = devTheme;

                        // Apply dev theme and exit
                        const theme = themes.find(t => t.name === themeToLoad);
                        if (theme) {
                            applyTheme(theme);
                            setIsLoading(false);
                            return;
                        }
                    }
                }

                // Priority 3: Fetch vendor's selected theme from server
                const vendorTheme = await fetchVendorTheme(vendorSlug, context);

                if (vendorTheme) {
                    const theme = themes.find(t => t.name === vendorTheme.themeName);
                    if (theme) {
                        console.log('🎨 Loading theme from vendor config:', vendorTheme.themeName);
                        applyTheme(theme);
                    } else {
                        // Fallback to default theme if vendor's theme not found
                        console.log('🎨 Loading default theme (vendor theme not found)');
                        applyTheme(themes[0]);
                    }
                } else {
                    // Fallback to default theme if no vendor theme found
                    console.log('🎨 Loading default theme (no vendor config)');
                    applyTheme(themes[0]);
                }
            } catch (error) {
                console.error('Failed to load vendor theme:', error);
                // Fallback to default theme on error
                applyTheme(themes[0]);
            } finally {
                setIsLoading(false);
            }
        };

        loadVendorTheme();
    }, [vendorSlug, context]);

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            applyTheme,
            isLoading
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Utility functions (same as before)
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function kebabCase(str: string) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function loadGoogleFonts(fonts: string[]) {
    const fontFamilies = fonts
        .map(font => font.replace(/'/g, '').replace(/ /g, '+'))
        .filter((font, index, array) => array.indexOf(font) === index);

    if (fontFamilies.length === 0) return;

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?${fontFamilies.map(font => `family=${font}:wght@300;400;500;600;700`).join('&')}&display=swap`;
    link.rel = 'stylesheet';

    const existingLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    existingLinks.forEach(link => link.remove());

    document.head.appendChild(link);
}

// Fetch vendor's selected theme from server
async function fetchVendorTheme(vendorSlug: string, context: string) {
    try {
        const response = await fetch(`/api/vendor/${vendorSlug}/theme?context=${context}`);
        if (response.ok) {
            const data = await response.json();
            return data; // { themeName: 'elegant-rose', customizations: {...} }
        }
    } catch (error) {
        console.error('Error fetching vendor theme:', error);
    }
    return null;
}