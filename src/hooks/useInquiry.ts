// hooks/useInquiry.ts
import { useMutation } from "@tanstack/react-query";
import { useOnboardingStore } from "@/store/use-onboarding-store";
import { useRouter } from "next/navigation";
interface InquiryData {
  brideName: string;
  groomName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount: string;
  vendorId: number;
  referredBy?: string;
}

export const useCreateInquiry = () => {
  const { updateData, clearData } = useOnboardingStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (inquiryData: InquiryData) => {
      const response = await fetch("/api/inquiries/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },
    onSuccess: (data, variables) => {
      updateData({
        inquiryId: data.data.inquiryId,
        clientId: data.data.clientId,
      });

      console.log("Inquiry created successfully:", data);

      // Clear data after a short delay to ensure redirect starts
      setTimeout(() => {
        clearData();
      }, 100);

      router.push(
        `https://client.wpro.ai/login?email=${encodeURIComponent(
          variables.email
        )}&phone=${encodeURIComponent(variables.phone)}`
      );
    },
    onError: (error) => {
      console.error("Failed to create inquiry:", error);
    },
  });
};
