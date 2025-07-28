import { useQuery } from "@tanstack/react-query";

interface Vendor {
  id: number;
  business_name: string;
  business_email: string;
  status: string;
}

interface EventType {
  id: number | null;
  name: string;
}

interface VendorResponse {
  success: boolean;
  vendor: Vendor;
}

interface EventTypesResponse {
  success: boolean;
  eventTypes: EventType[];
  isDefault: boolean;
}

export const useVendorBySlug = (slug: string) => {
  return useQuery<VendorResponse>({
    queryKey: ["vendor", slug],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/by-slug?slug=${slug}`);
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch vendor");
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useVendorEventTypes = (vendorId: number) => {
  return useQuery<EventTypesResponse>({
    queryKey: ["eventTypes", vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${vendorId}/event-types`);
      if (!response.ok) {
        throw new Error("Failed to fetch event types");
      }
      return response.json();
    },
    enabled: !!vendorId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
};
