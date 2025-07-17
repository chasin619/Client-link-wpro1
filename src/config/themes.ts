export const themes = [
  {
    id: 1,
    name: "elegant-rose",
    displayName: "Elegant Rose",
    description: "Romantic and timeless with soft rose tones",
    category: "romantic",

    colors: {
      primary: "#E91E63",
      secondary: "#FCE4EC",
      accent: "#AD1457",
      background: "#FFFFFF",
      foreground: "#1F2937",
      muted: "#F8FAFC",
      mutedForeground: "#64748B",
      border: "#E2E8F0",
      input: "#F1F5F9",
      ring: "#E91E63",
      destructive: "#EF4444",
      destructiveBackground: "#FEF2F2",
    },

    // Typography
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
    },

    // Component styles
    components: {
      button: {
        borderRadius: "8px",
        shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        hoverTransform: "translateY(-1px)",
      },
      card: {
        borderRadius: "12px",
        shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        border: "none",
      },
      input: {
        borderRadius: "8px",
        border: "2px solid",
        focusRing: "2px",
      },
    },

    // Animations
    animations: {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      hoverScale: "1.02",
      duration: "300ms",
    },

    // Background patterns/gradients
    patterns: {
      hero: "linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)",
      section:
        "radial-gradient(circle at 30% 50%, #FCE4EC 0%, transparent 50%)",
    },

    previewImage: "/themes/elegant-rose-preview.jpg",
  },

  {
    id: 2,
    name: "modern-minimal",
    displayName: "Modern Minimal",
    description: "Clean and contemporary design",
    category: "modern",

    colors: {
      primary: "#2563EB",
      secondary: "#F1F5F9",
      accent: "#0EA5E9",
      background: "#FFFFFF",
      foreground: "#0F172A",
      muted: "#F8FAFC",
      mutedForeground: "#64748B",
      border: "#E2E8F0",
      input: "#F8FAFC",
      ring: "#2563EB",
      destructive: "#EF4444",
      destructiveBackground: "#FEF2F2",
    },

    fonts: {
      heading: "Inter",
      body: "Inter",
    },

    components: {
      button: {
        borderRadius: "6px",
        shadow: "none",
        hoverTransform: "none",
      },
      card: {
        borderRadius: "8px",
        shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        border: "1px solid #E2E8F0",
      },
      input: {
        borderRadius: "6px",
        border: "1px solid",
        focusRing: "2px",
      },
    },

    animations: {
      transition: "all 0.2s ease-in-out",
      hoverScale: "1.01",
      duration: "200ms",
    },

    patterns: {
      hero: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
      section: "linear-gradient(90deg, #F8FAFC 0%, transparent 100%)",
    },

    previewImage: "/themes/modern-minimal-preview.jpg",
  },

  {
    id: 3,
    name: "rustic-charm",
    displayName: "Rustic Charm",
    description: "Warm and natural with earthy tones",
    category: "rustic",

    colors: {
      primary: "#92400E",
      secondary: "#FEF3C7",
      accent: "#D97706",
      background: "#FFFBEB",
      foreground: "#1C1917",
      muted: "#FEF3C7",
      mutedForeground: "#78716C",
      border: "#E7E5E4",
      input: "#FEF3C7",
      ring: "#92400E",
      destructive: "#DC2626",
      destructiveBackground: "#FEF2F2",
    },

    fonts: {
      heading: "Merriweather",
      body: "Source Sans Pro",
    },

    components: {
      button: {
        borderRadius: "12px",
        shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        hoverTransform: "translateY(-1px)",
      },
      card: {
        borderRadius: "16px",
        shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        border: "2px solid #E7E5E4",
      },
      input: {
        borderRadius: "12px",
        border: "2px solid",
        focusRing: "3px",
      },
    },

    animations: {
      transition: "all 0.4s ease-out",
      hoverScale: "1.03",
      duration: "400ms",
    },

    patterns: {
      hero: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
      section:
        "radial-gradient(ellipse at 70% 30%, #FEF3C7 0%, transparent 60%)",
    },

    previewImage: "/themes/rustic-charm-preview.jpg",
  },

  {
    id: 4,
    name: "luxury-gold",
    displayName: "Luxury Gold",
    description: "Sophisticated and elegant with gold accents",
    category: "luxury",

    colors: {
      primary: "#B45309",
      secondary: "#FEF9E7",
      accent: "#F59E0B",
      background: "#FFFFFF",
      foreground: "#111827",
      muted: "#FEF9E7",
      mutedForeground: "#6B7280",
      border: "#E5E7EB",
      input: "#FEF9E7",
      ring: "#B45309",
      destructive: "#DC2626",
      destructiveBackground: "#FEF2F2",
    },

    fonts: {
      heading: "Cormorant Garamond",
      body: "Crimson Text",
    },

    components: {
      button: {
        borderRadius: "4px",
        shadow: "0 8px 16px -4px rgb(0 0 0 / 0.1)",
        hoverTransform: "translateY(-2px)",
      },
      card: {
        borderRadius: "8px",
        shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
        border: "1px solid #D1D5DB",
      },
      input: {
        borderRadius: "4px",
        border: "1px solid",
        focusRing: "2px",
      },
    },

    animations: {
      transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      hoverScale: "1.05",
      duration: "300ms",
    },

    patterns: {
      hero: "linear-gradient(135deg, #FEF9E7 0%, #FDE68A 50%, #F59E0B 100%)",
      section: "conic-gradient(from 45deg, #FEF9E7, #FDE68A, #FEF9E7)",
    },

    previewImage: "/themes/luxury-gold-preview.jpg",
  },

  {
    id: 5,
    name: "garden-fresh",
    displayName: "Garden Fresh",
    description: "Natural and vibrant with green tones",
    category: "nature",

    colors: {
      primary: "#059669",
      secondary: "#ECFDF5",
      accent: "#10B981",
      background: "#FFFFFF",
      foreground: "#064E3B",
      muted: "#F0FDF4",
      mutedForeground: "#6B7280",
      border: "#D1FAE5",
      input: "#ECFDF5",
      ring: "#059669",
      destructive: "#DC2626",
      destructiveBackground: "#FEF2F2",
    },

    fonts: {
      heading: "Nunito Sans",
      body: "Open Sans",
    },

    components: {
      button: {
        borderRadius: "20px",
        shadow: "0 4px 12px -2px rgb(0 0 0 / 0.1)",
        hoverTransform: "scale(1.02)",
      },
      card: {
        borderRadius: "20px",
        shadow: "0 10px 20px -5px rgb(0 0 0 / 0.1)",
        border: "2px solid #D1FAE5",
      },
      input: {
        borderRadius: "20px",
        border: "2px solid",
        focusRing: "3px",
      },
    },

    animations: {
      transition: "all 0.3s spring",
      hoverScale: "1.02",
      duration: "300ms",
    },

    patterns: {
      hero: "linear-gradient(135deg, #ECFDF5 0%, #A7F3D0 100%)",
      section:
        "radial-gradient(circle at 20% 80%, #ECFDF5 0%, transparent 50%)",
    },

    previewImage: "/themes/garden-fresh-preview.jpg",
  },
] as const;

export type Theme = (typeof themes)[0];
export type ThemeName = (typeof themes)[number]["name"];
