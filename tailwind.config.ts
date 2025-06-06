import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))", // e.g., 214 31.8% 91.4%
        input: "hsl(var(--input))", // e.g., 214 31.8% 91.4%
        ring: "hsl(var(--ring))", // e.g., 215 20.2% 65.1%
        background: "hsl(var(--background))", // e.g., 0 0% 100%
        foreground: "hsl(var(--foreground))", // e.g., 222.2 47.4% 11.2%
        primary: {
          DEFAULT: "hsl(var(--primary))", // e.g., 222.2 47.4% 11.2%
          foreground: "hsl(var(--primary-foreground))", // e.g., 210 40% 98%
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // e.g., 210 40% 96.1%
          foreground: "hsl(var(--secondary-foreground))", // e.g., 222.2 47.4% 11.2%
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // e.g., 0 84.2% 60.2%
          foreground: "hsl(var(--destructive-foreground))", // e.g., 210 40% 98%
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // e.g., 210 40% 96.1%
          foreground: "hsl(var(--muted-foreground))", // e.g., 215.4 16.3% 46.9%
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // e.g., 210 40% 96.1%
          foreground: "hsl(var(--accent-foreground))", // e.g., 222.2 47.4% 11.2%
        },
        popover: {
          DEFAULT: "hsl(var(--popover))", // e.g., 0 0% 100%
          foreground: "hsl(var(--popover-foreground))", // e.g., 222.2 47.4% 11.2%
        },
        card: {
          DEFAULT: "hsl(var(--card))", // e.g., 0 0% 100%
          foreground: "hsl(var(--card-foreground))", // e.g., 222.2 47.4% 11.2%
        },
        // Minimalistic accent colors
        brand: {
          DEFAULT: "hsl(210, 90%, 50%)", // A clean blue
          light: "hsl(210, 90%, 95%)",
          dark: "hsl(210, 90%, 40%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)", // e.g., 0.5rem
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        // Removed 'reverse' keyframe as it's not used by the simplified loader
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spin: "spin 1s linear infinite", // Simplified spin
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
