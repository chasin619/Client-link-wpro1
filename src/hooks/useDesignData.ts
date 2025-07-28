import { useQuery } from "@tanstack/react-query";

// Get vendor colors
export const useVendorColors = (vendorId: number) => {
  return useQuery({
    queryKey: ["colors", vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${vendorId}/colors`);
      if (!response.ok) {
        throw new Error("Failed to fetch colors");
      }
      return response.json();
    },
    enabled: !!vendorId,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Get vendor flowers with categories
export const useVendorFlowers = (vendorId: number) => {
  return useQuery({
    queryKey: ["flowers", vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${vendorId}/flowers`);
      if (!response.ok) {
        throw new Error("Failed to fetch flowers");
      }
      return response.json();
    },
    enabled: !!vendorId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get vendor arrangements with types
export const useVendorArrangements = (vendorId: number, typeId?: number) => {
  return useQuery({
    queryKey: ["arrangements", vendorId, typeId],
    queryFn: async () => {
      const url = `/api/vendors/${vendorId}/arrangements${
        typeId ? `?typeId=${typeId}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch arrangements");
      }
      return response.json();
    },
    enabled: !!vendorId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get vendor arrangement types
export const useVendorArrangementTypes = (vendorId: number) => {
  return useQuery({
    queryKey: ["arrangementTypes", vendorId],
    queryFn: async () => {
      const response = await fetch(
        `/api/vendors/${vendorId}/arrangement-types`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch arrangement types");
      }
      return response.json();
    },
    enabled: !!vendorId,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Get vendor flower categories
export const useVendorFlowerCategories = (vendorId: number) => {
  return useQuery({
    queryKey: ["flowerCategories", vendorId],
    queryFn: async () => {
      const response = await fetch(
        `/api/vendors/${vendorId}/flower-categories`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch flower categories");
      }
      return response.json();
    },
    enabled: !!vendorId,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Get vendor event types
export const useVendorEventTypes = (vendorId: number) => {
  return useQuery({
    queryKey: ["eventTypes", vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${vendorId}/event-types`);
      if (!response.ok) {
        throw new Error("Failed to fetch event types");
      }
      return response.json();
    },
    enabled: !!vendorId,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
};
