import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface EventArrangement {
  id: number;
  eventId: number;
  arrangementId: number;
  section: "Personal" | "Ceremony" | "Reception" | "Suggestion";
  slotName?: string;
  slotNo?: number;
  quantity?: number;
  arrangement?: {
    id: number;
    name: string;
    price: number;
    description: string;
    type: { name: string };
  };
}

interface ArrangementUpdate {
  arrangementId: number;
  section: string;
  slotNo?: number;
  quantity: number;
  action?: "upsert" | "delete";
}

export function useEventArrangements(eventId: number) {
  const queryClient = useQueryClient();

  // Fetch arrangements
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["eventArrangements", eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}/arrangements`);
      if (!response.ok) {
        throw new Error("Failed to fetch arrangements");
      }
      return response.json();
    },
    enabled: !!eventId,
  });

  // Save arrangements
  const saveArrangementsMutation = useMutation({
    mutationFn: async (arrangements: EventArrangement[]) => {
      const response = await fetch(`/api/events/${eventId}/arrangements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrangements }),
      });
      if (!response.ok) {
        throw new Error("Failed to save arrangements");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["eventArrangements", eventId],
      });
    },
  });

  // Bulk update for auto-save
  const bulkUpdateMutation = useMutation({
    mutationFn: async (updates: ArrangementUpdate[]) => {
      const response = await fetch(
        `/api/events/${eventId}/arrangements/bulk-update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update arrangements");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["eventArrangements", eventId],
      });
    },
  });

  // Delete arrangement
  const deleteArrangementMutation = useMutation({
    mutationFn: async ({
      arrangementId,
      section,
      slotNo,
    }: {
      arrangementId: number;
      section: string;
      slotNo?: number;
    }) => {
      const response = await fetch(`/api/events/${eventId}/arrangements`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrangementId, section, slotNo }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete arrangement");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["eventArrangements", eventId],
      });
    },
  });

  return {
    arrangements: data?.arrangements || [],
    groupedArrangements: data?.groupedArrangements || {},
    totalEstimatedCost: data?.totalEstimatedCost || 0,
    isLoading,
    error,
    refetch,
    saveArrangements: saveArrangementsMutation.mutate,
    bulkUpdate: bulkUpdateMutation.mutate,
    deleteArrangement: deleteArrangementMutation.mutate,
    isSaving: saveArrangementsMutation.isPending,
    isUpdating: bulkUpdateMutation.isPending,
    isDeleting: deleteArrangementMutation.isPending,
  };
}
