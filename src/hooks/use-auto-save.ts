"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useOnboardingStore } from "@/store/use-onboarding-store";
import { useDebounce } from "./use-debounce";

interface AutoSaveOptions {
  vendorSlug: string;
  sessionId: string;
  enabled?: boolean;
  interval?: number;
}

export function useAutoSave({
  vendorSlug,
  sessionId,
  enabled = true,
  interval = 2000,
}: AutoSaveOptions) {
  const { data, updateData } = useOnboardingStore();
  const lastSavedData = useRef(data);

  const debouncedData = useDebounce(data, interval);

  const autoSaveMutation = useMutation({
    mutationFn: async (saveData: typeof data) => {
      // For development, just save to localStorage
      if (process.env.NODE_ENV === "development") {
        localStorage.setItem(
          `onboarding-${sessionId}`,
          JSON.stringify(saveData)
        );
        return { success: true, savedAt: new Date().toISOString() };
      }

      // For production, use API
      const response = await fetch(`/api/onboard/auto-save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          vendorSlug,
          data: saveData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      return response.json();
    },
    onSuccess: () => {
      updateData({ lastSavedAt: new Date().toISOString() });
      lastSavedData.current = data;
    },
    onError: (error) => {
      console.error("Auto-save failed:", error);
      // Don't show error to user in development
      if (process.env.NODE_ENV === "production") {
        // Show user-friendly error message
      }
    },
  });

  useEffect(() => {
    if (!enabled || !sessionId || !vendorSlug) return;

    const hasChanged =
      JSON.stringify(debouncedData) !== JSON.stringify(lastSavedData.current);

    if (hasChanged && debouncedData.currentStep > 0) {
      autoSaveMutation.mutate(debouncedData);
    }
  }, [debouncedData, enabled, sessionId, vendorSlug]);

  return {
    isSaving: autoSaveMutation.isPending,
    saveError: autoSaveMutation.error,
    lastSavedAt: data.lastSavedAt,
    forceSave: () => autoSaveMutation.mutate(data),
  };
}
