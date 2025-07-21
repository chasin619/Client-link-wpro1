import { z } from "zod";

export const designPreferencesSchema = z.object({
  colorScheme: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
  }),
  style: z.enum(["romantic", "modern", "rustic", "luxury", "boho", "classic"], {
    required_error: "Please select a style preference",
  }),
  flowerPreferences: z.array(z.string()),
  inspirationUrls: z.array(z.string()).optional(),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  ceremony: z.object({
    needed: z.boolean(),
    altarArrangements: z.boolean().optional(),
    aisleDecorations: z.boolean().optional(),
    archDecorations: z.boolean().optional(),
    petalToss: z.boolean().optional(),
  }),
  reception: z.object({
    needed: z.boolean(),
    centerpieces: z.boolean().optional(),
    headTable: z.boolean().optional(),
    cocktailArea: z.boolean().optional(),
    danceFloor: z.boolean().optional(),
  }),
  personal: z.object({
    needed: z.boolean(),
    bridalBouquet: z.boolean().optional(),
    bridesmaidsFlowers: z.boolean().optional(),
    boutonnieres: z.boolean().optional(),
    corsages: z.boolean().optional(),
    flowerGirl: z.boolean().optional(),
  }),
});

export type DesignPreferencesForm = z.infer<typeof designPreferencesSchema>;

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  colors: string[];
  keywords: string[];
}
