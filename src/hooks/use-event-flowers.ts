import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FlowerPreferences } from "@/types/event";
import React from "react";
interface UpdateFlowersResponse {
  eventId: number;
  updatedAt: string;
  flowerPreferences: string[];
  selectedFlowerIds: number[];
  flowerCategories: number[];
}

const updateEventFlowers = async (
  eventId: number,
  payload: FlowerPreferences
): Promise<UpdateFlowersResponse> => {
  const response = await fetch(`/api/events/${eventId}/flowers`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.error?.message || "Failed to update flower preferences"
    );
  }

  return result.data;
};

export const useUpdateEventFlowers = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FlowerPreferences) =>
      updateEventFlowers(eventId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["event", eventId],
      });

      queryClient.setQueryData(["event", eventId, "flowers"], data);
    },
    onError: (error) => {
      console.error("Failed to update flower preferences:", error);
    },
  });
};

export const useAutoSaveFlowers = (eventId: number, debounceMs = 2000) => {
  const mutation = useUpdateEventFlowers(eventId);
  const [debounceTimer, setDebounceTimer] =
    React.useState<NodeJS.Timeout | null>(null);

  const debouncedUpdate = React.useCallback(
    (payload: FlowerPreferences) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        mutation.mutate(payload);
      }, debounceMs);

      setDebounceTimer(timer);
    },
    [mutation, debounceMs, debounceTimer]
  );

  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    ...mutation,
    debouncedUpdate,
  };
};
