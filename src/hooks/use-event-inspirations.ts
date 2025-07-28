import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inspiration } from "@/types/event";
import React from "react";
interface AddInspirationsPayload {
  images?: File[];
  imageUrls?: string[];
}

interface AddInspirationsResponse {
  eventId: number;
  inspirations: Inspiration[];
  totalInspirations: number;
}

// Add inspirations (POST)
const addEventInspirations = async (
  eventId: number,
  payload: AddInspirationsPayload
): Promise<AddInspirationsResponse> => {
  const formData = new FormData();

  if (payload.images) {
    payload.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  if (payload.imageUrls) {
    formData.append("imageUrls", JSON.stringify(payload.imageUrls));
  }

  const response = await fetch(`/api/events/${eventId}/inspirations`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.error?.message || "Failed to add inspiration images"
    );
  }

  return result.data;
};

// Get inspirations (GET)
const getEventInspirations = async (
  eventId: number
): Promise<Inspiration[]> => {
  const response = await fetch(`/api/events/${eventId}/inspirations`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || "Failed to fetch inspirations");
  }

  return result.data.inspirations;
};

// Delete inspiration (DELETE)
const deleteEventInspiration = async (
  eventId: number,
  inspirationId: number
): Promise<void> => {
  const response = await fetch(
    `/api/events/${eventId}/inspirations?inspirationId=${inspirationId}`,
    { method: "DELETE" }
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || "Failed to delete inspiration");
  }
};

// Hooks
export const useEventInspirations = (eventId: number) => {
  return useQuery({
    queryKey: ["event", eventId, "inspirations"],
    queryFn: () => getEventInspirations(eventId),
    enabled: !!eventId,
  });
};

export const useAddEventInspirations = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddInspirationsPayload) =>
      addEventInspirations(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", eventId, "inspirations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["event", eventId],
      });
    },
    onError: (error) => {
      console.error("Failed to add inspirations:", error);
    },
  });
};

export const useDeleteEventInspiration = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inspirationId: number) =>
      deleteEventInspiration(eventId, inspirationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", eventId, "inspirations"],
      });
    },
    onError: (error) => {
      console.error("Failed to delete inspiration:", error);
    },
  });
};
