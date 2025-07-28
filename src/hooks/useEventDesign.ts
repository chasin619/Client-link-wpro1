import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface EventDesign {
  id: number;
  eventId: number;
  eventTypeId: number;
  eventColors: any;
  designCost: number;
  eventType: {
    id: number;
    name: string;
  };
}

export function useEventDesign(eventId: number) {
  const queryClient = useQueryClient();

  // Fetch designs
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["eventDesigns", eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}/design`);
      if (!response.ok) {
        throw new Error("Failed to fetch designs");
      }
      return response.json();
    },
    enabled: !!eventId,
  });

  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: async (designData: {
      designId?: number;
      eventTypeId: number;
      eventColors: any;
      designCost: number;
    }) => {
      const response = await fetch(`/api/events/${eventId}/design/auto-save`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(designData),
      });
      if (!response.ok) {
        throw new Error("Failed to auto-save design");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventDesigns", eventId] });
    },
  });

  // Create design
  const createMutation = useMutation({
    mutationFn: async (designData: {
      eventTypeId: number;
      eventColors: any;
      designCost: number;
    }) => {
      const response = await fetch(`/api/events/${eventId}/design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(designData),
      });
      if (!response.ok) {
        throw new Error("Failed to create design");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventDesigns", eventId] });
    },
  });

  // Update design
  const updateMutation = useMutation({
    mutationFn: async ({
      designId,
      ...designData
    }: {
      designId: number;
      eventTypeId?: number;
      eventColors?: any;
      designCost?: number;
    }) => {
      const response = await fetch(
        `/api/events/${eventId}/design/${designId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(designData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update design");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventDesigns", eventId] });
    },
  });

  // Delete design
  const deleteMutation = useMutation({
    mutationFn: async (designId: number) => {
      const response = await fetch(
        `/api/events/${eventId}/design/${designId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete design");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventDesigns", eventId] });
    },
  });

  return {
    designs: data?.designs || [],
    totalDesignCost: data?.totalDesignCost || 0,
    isLoading,
    error,
    refetch,
    autoSave: autoSaveMutation.mutate,
    createDesign: createMutation.mutate,
    updateDesign: updateMutation.mutate,
    deleteDesign: deleteMutation.mutate,
    isAutoSaving: autoSaveMutation.isPending,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
