"use client";

import { useTheme as useThemeContext } from "@/providers/theme-provider";

export function useTheme() {
  const context = useThemeContext();

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return {
    ...context,
    // Quick access to common theme values
    primaryColor: context.currentTheme.colors.primary,
    secondaryColor: context.currentTheme.colors.secondary,
    accentColor: context.currentTheme.colors.accent,
    headingFont: context.currentTheme.fonts.heading,
    bodyFont: context.currentTheme.fonts.body,

    // Check theme
    isTheme: (themeName: string) => context.currentTheme.name === themeName,
    isCategory: (category: string) =>
      context.currentTheme.category === category,
  };
}
