export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface FlowerPreferences {
  flowerPreferences: string[];
  selectedFlowerIds: number[];
  flowerCategories: number[];
}

export interface ArrangementSection {
  needed: boolean;
  arrangements?: Record<string, number>;
  quantities?: Record<string, number>;
}

export interface ServicePreferences {
  ceremony: ArrangementSection;
  reception: ArrangementSection;
  personal: ArrangementSection;
}

export interface OnboardingData {
  // Personal details
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  location?: string;
  NumberOfGuests?: number;

  // Design preferences
  colorScheme?: ColorScheme;
  flowerPreferences?: string[];
  selectedColors?: number[];
  selectedFlowers?: number[];

  // Services
  ceremony?: ArrangementSection;
  reception?: ArrangementSection;
  personal?: ArrangementSection;

  // Inspiration
  inspirationUrls?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface Inspiration {
  id: number;
  eventId: number;
  imageUrl: string;
  uploadDate: string;
}

export interface AutoSavePayload {
  step: number;
  data: OnboardingData;
  sessionId: string;
  lastModified: string;
}
