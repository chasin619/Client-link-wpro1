import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColorScheme } from "@/types/event";
import React from "react";

interface UpdateColorsPayload {
  colorScheme: ColorScheme;
  selectedColors: number[];
}

interface UpdateColorsResponse {
  eventId: number;
  updatedAt: string;
  colorScheme: ColorScheme;
  selectedColors: number[];
}

const updateEventColors = async (
  eventId: number,
  payload: UpdateColorsPayload
): Promise<UpdateColorsResponse> => {
  const response = await fetch(`/api/events/${eventId}/colors`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || "Failed to update colors");
  }

  return result.data;
};

export const useUpdateEventColors = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateColorsPayload) =>
      updateEventColors(eventId, payload),
    onSuccess: (data) => {
      // Invalidate and refetch event data
      queryClient.invalidateQueries({
        queryKey: ["event", eventId],
      });

      // Update cache optimistically
      queryClient.setQueryData(["event", eventId, "colors"], data);
    },
    onError: (error) => {
      console.error("Failed to update colors:", error);
    },
  });
};
// Fixed useAutoSaveColors hook
export const useAutoSaveColors = (eventId: number, debounceMs = 2000) => {
  const mutation = useUpdateEventColors(eventId);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastSavedColorsRef = React.useRef<string | null>(null); // Track last saved state

  const debouncedUpdate = React.useCallback(
    (payload: UpdateColorsPayload) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        mutation.mutate(payload);
        // Update last saved state after successful mutation
        lastSavedColorsRef.current = JSON.stringify(payload.colorScheme);
      }, debounceMs);
    },
    [mutation, debounceMs]
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    ...mutation,
    debouncedUpdate,
    lastSavedColorsRef,
  };
};
