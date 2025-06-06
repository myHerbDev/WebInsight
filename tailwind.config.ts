import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}", // Added this line from my previous config
  ],
  prefix: "", // Standard for shadcn/ui
  theme: {
    container: {
      center: true,
      padding: "1.5rem", // My custom padding
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans], // My custom font
      },
      colors: {
        // Standard shadcn/ui colors, will be overridden by globals.css variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // My custom brand colors (will also be defined in globals.css)
        brand: {
          DEFAULT: "hsl(var(--brand-default))",
          light: "hsl(var(--brand-light))",
          dark: "hsl(var(--brand-dark))",
          text: "hsl(var(--brand-text))",
        },
      },
      borderRadius: {
        // My custom border radius
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        // My custom minimal shadows
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
        none: "none",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // My custom loading animation keyframes
        pulseScale: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.7" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(30px) rotate(0deg) scale(0.5)", opacity: "0" },
          "20%": { opacity: "1", transform: "rotate(72deg) translateX(30px) rotate(-72deg) scale(1)" },
          "80%": { opacity: "1", transform: "rotate(288deg) translateX(30px) rotate(-288deg) scale(1)" },
          "100%": { transform: "rotate(360deg) translateX(30px) rotate(-360deg) scale(0.5)", opacity: "0" },
        },
        fadeInGrow: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // My custom loading animations
        "pulse-scale": "pulseScale 2s infinite ease-in-out",
        orbit1: "orbit 3s infinite linear",
        orbit2: "orbit 3s infinite linear 0.6s",
        orbit3: "orbit 3s infinite linear 1.2s",
        orbit4: "orbit 3s infinite linear 1.8s",
        "fade-in-grow": "fadeInGrow 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
