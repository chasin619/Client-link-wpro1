import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuickOnboardingData {
  brideName?: string;
  groomName?: string;
  email?: string;
  phone?: string;
  preferredContact?: "email" | "phone" | "text";

  eventDate?: string;
  eventType?: "wedding" | "engagement" | "anniversary" | "other";
  venue?: string;
  guestCount?: number;
  budgetRange?:
    | "under-2000"
    | "2000-5000"
    | "5000-10000"
    | "10000-20000"
    | "over-20000";
  services?: string[];
  specialRequests?: string;
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  sessionId?: string;
  vendorSlug?: string;
  startedAt?: string;
  lastSavedAt?: string;
}

interface QuickOnboardingStore {
  data: QuickOnboardingData;
  updateData: (newData: Partial<QuickOnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetData: () => void;
  setSessionId: (sessionId: string) => void;
  setVendorSlug: (vendorSlug: string) => void;
  markCompleted: () => void;
}

const initialData: QuickOnboardingData = {
  currentStep: 1,
  totalSteps: 2,
  isCompleted: false,
  services: [],
};

export const useQuickOnboardingStore = create<QuickOnboardingStore>()(
  persist(
    (set, get) => ({
      data: initialData,

      updateData: (newData) =>
        set((state) => ({
          data: {
            ...state.data,
            ...newData,
            lastSavedAt: new Date().toISOString(),
          },
        })),

      nextStep: () =>
        set((state) => ({
          data: {
            ...state.data,
            currentStep: Math.min(
              state.data.currentStep + 1,
              state.data.totalSteps
            ),
          },
        })),

      prevStep: () =>
        set((state) => ({
          data: {
            ...state.data,
            currentStep: Math.max(state.data.currentStep - 1, 1),
          },
        })),

      setSessionId: (sessionId) =>
        set((state) => ({
          data: { ...state.data, sessionId },
        })),

      setVendorSlug: (vendorSlug) =>
        set((state) => ({
          data: { ...state.data, vendorSlug },
        })),

      markCompleted: () =>
        set((state) => ({
          data: { ...state.data, isCompleted: true },
        })),

      resetData: () => set({ data: initialData }),
    }),
    {
      name: "quick-onboarding-storage",
      partialize: (state) => ({ data: state.data }),
    }
  )
);
