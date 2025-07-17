import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OnboardingData {
  // Step 1: Personal Details
  brideName?: string;
  groomName?: string;
  email?: string;
  phone?: string;
  preferredContact?: "email" | "phone" | "text";

  // Step 2: Event Details
  eventDate?: string;
  eventTime?: string;
  eventType?: "wedding" | "engagement" | "anniversary" | "other";
  venue?: string;
  guestCount?: number;
  isOutdoorVenue?: boolean;

  // Step 3: Service Selection
  services?: string[];
  ceremony?: {
    needed: boolean;
    altarArrangements?: boolean;
    aisleDecorations?: boolean;
    archDecorations?: boolean;
    petalToss?: boolean;
  };
  reception?: {
    needed: boolean;
    centerpieces?: boolean;
    headTable?: boolean;
    cocktailArea?: boolean;
    danceFloor?: boolean;
  };
  personal?: {
    needed: boolean;
    bridalBouquet?: boolean;
    bridesmaidsFlowers?: boolean;
    boutonnieres?: boolean;
    corsages?: boolean;
    flowerGirl?: boolean;
  };

  // Step 4: Design Preferences
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  style?: "romantic" | "modern" | "rustic" | "luxury" | "boho" | "classic";
  flowerPreferences?: string[];
  inspiration?: File[];
  inspirationUrls?: string[];

  // Step 5: Additional Information
  budgetRange?:
    | "under-2000"
    | "2000-5000"
    | "5000-10000"
    | "10000-20000"
    | "over-20000";
  timeline?: "urgent" | "1-3months" | "3-6months" | "6-12months" | "over-year";
  referralSource?: string;
  specialRequests?: string;
  allergies?: string;
  previousFlorist?: boolean;
  consultationPreference?: "in-person" | "video" | "phone";

  // Meta
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  sessionId?: string;
  vendorSlug?: string;
  startedAt?: string;
  lastSavedAt?: string;
}

interface OnboardingStore {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  goToPreview: () => void;
  goBackFromPreview: () => void;
  resetData: () => void;
  setSessionId: (sessionId: string) => void;
  setVendorSlug: (vendorSlug: string) => void;
  markCompleted: () => void;
}

const initialData: OnboardingData = {
  currentStep: 1,
  totalSteps: 6,
  isCompleted: false,
  ceremony: { needed: false },
  reception: { needed: false },
  personal: { needed: false },
  services: [],
  flowerPreferences: [],
  inspiration: [],
  inspirationUrls: [],
};

export const useOnboardingStore = create<OnboardingStore>()(
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
            currentStep:
              state.data.currentStep === 5
                ? 6 // Go to preview step after step 5
                : Math.min(state.data.currentStep + 1, state.data.totalSteps),
          },
        })),

      prevStep: () =>
        set((state) => ({
          data: {
            ...state.data,
            currentStep: Math.max(state.data.currentStep - 1, 1),
          },
        })),

      goToStep: (step) =>
        set((state) => ({
          data: {
            ...state.data,
            currentStep: Math.max(1, Math.min(step, state.data.totalSteps)),
          },
        })),

      goToPreview: () =>
        set((state) => ({
          data: { ...state.data, currentStep: 6 },
        })),

      goBackFromPreview: () =>
        set((state) => ({
          data: { ...state.data, currentStep: 5 },
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
      name: "onboarding-storage",
      partialize: (state) => ({ data: state.data }),
    }
  )
);
