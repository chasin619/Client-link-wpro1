import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AutoSavePayload, OnboardingData } from "@/types/event";
import React from "react";
interface AutoSaveResponse {
  eventId: number;
  updatedAt: string;
  step: number;
}

const autoSaveEventData = async (
  eventId: number,
  payload: AutoSavePayload
): Promise<AutoSaveResponse> => {
  const response = await fetch(`/api/events/${eventId}/onboarding-data`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || "Failed to auto-save data");
  }

  return result.data;
};

export const useEventAutoSave = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AutoSavePayload) =>
      autoSaveEventData(eventId, payload),
    onSuccess: (data) => {
      // Update last saved timestamp in cache
      queryClient.setQueryData(["event", eventId, "lastSaved"], data.updatedAt);
    },
    onError: (error) => {
      console.error("Auto-save failed:", error);
    },
  });
};

// Comprehensive auto-save hook with debouncing
export const useAutoSave = ({
  eventId,
  sessionId,
  enabled = true,
  debounceMs = 3000,
}: {
  eventId?: number;
  sessionId: string;
  enabled?: boolean;
  debounceMs?: number;
}) => {
  const mutation = useEventAutoSave(eventId!);
  const [debounceTimer, setDebounceTimer] =
    React.useState<NodeJS.Timeout | null>(null);
  const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null);
  const [isQueued, setIsQueued] = React.useState(false);

  const saveData = React.useCallback(
    (step: number, data: OnboardingData) => {
      if (!enabled || !eventId) return;

      const payload: AutoSavePayload = {
        step,
        data,
        sessionId,
        lastModified: new Date().toISOString(),
      };

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      setIsQueued(true);

      const timer = setTimeout(() => {
        mutation.mutate(payload, {
          onSuccess: (response) => {
            setLastSavedAt(response.updatedAt);
            setIsQueued(false);
          },
          onError: () => {
            setIsQueued(false);
          },
        });
      }, debounceMs);

      setDebounceTimer(timer);
    },
    [enabled, eventId, sessionId, debounceMs, mutation, debounceTimer]
  );

  // Immediate save (for step navigation, etc.)
  const saveImmediately = React.useCallback(
    (step: number, data: OnboardingData) => {
      if (!enabled || !eventId) return;

      if (debounceTimer) {
        clearTimeout(debounceTimer);
        setDebounceTimer(null);
      }

      const payload: AutoSavePayload = {
        step,
        data,
        sessionId,
        lastModified: new Date().toISOString(),
      };

      return mutation.mutateAsync(payload).then((response) => {
        setLastSavedAt(response.updatedAt);
        setIsQueued(false);
        return response;
      });
    },
    [enabled, eventId, sessionId, mutation, debounceTimer]
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    saveData,
    saveImmediately,
    isSaving: mutation.isPending || isQueued,
    lastSavedAt,
    saveError: mutation.error,
    isQueued,
  };
};
