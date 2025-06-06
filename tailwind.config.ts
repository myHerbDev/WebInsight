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
      padding: "1.5rem", // Increased padding for more whitespace
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          gradient: {
            start: "hsl(var(--primary-gradient-start))",
            middle: "hsl(var(--primary-gradient-middle))",
            end: "hsl(var(--primary-gradient-end))",
          },
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
        brand: {
          DEFAULT: "hsl(var(--brand-default))",
          light: "hsl(var(--brand-light))",
          dark: "hsl(var(--brand-dark))",
          text: "hsl(var(--brand-text))",
        },
      },
      borderRadius: {
        lg: "var(--radius)", // Use CSS variable
        xl: "calc(var(--radius) + 0.5rem)",
        md: "calc(var(--radius) - 0.25rem)",
        sm: "calc(var(--radius) - 0.375rem)",
      },
      boxShadow: {
        // Softer, more diffused shadows
        sm: "0 2px 4px 0 rgba(0,0,0,0.03)",
        DEFAULT: "0 3px 6px 0 rgba(0,0,0,0.04), 0 2px 4px -1px rgba(0,0,0,0.04)",
        md: "0 6px 12px -2px rgba(0,0,0,0.05), 0 3px 7px -3px rgba(0,0,0,0.05)",
        lg: "0 10px 20px -5px rgba(var(--primary-gradient-start-rgb),0.07), 0 5px 10px -5px rgba(var(--primary-gradient-start-rgb),0.07)",
        xl: "0 20px 30px -10px rgba(var(--primary-gradient-start-rgb),0.1), 0 8px 15px -8px rgba(var(--primary-gradient-start-rgb),0.1)",
        "inner-soft": "inset 0 1px 2px 0 rgba(0,0,0,0.03)",
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
        // New "Google AI" style loading animation
        gradientWave: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        subtlePulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(0.98)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUpFadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        pulseGlow: {
          // Kept from previous, might be useful
          "0%, 100%": { opacity: "0.7", filter: "drop-shadow(0 0 3px hsl(var(--primary-gradient-start)))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 10px hsl(var(--primary-gradient-middle)))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-wave": "gradientWave 3s ease infinite",
        "subtle-pulse": "subtlePulse 2.5s infinite ease-in-out",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up-fade-in": "slideUpFadeIn 0.5s ease-out forwards",
        aurora: "aurora 60s linear infinite",
        "pulse-glow": "pulseGlow 2.5s infinite ease-in-out",
      },
      backgroundImage: {
        "aurora-gradient":
          "radial-gradient(ellipse at 50% 0%, hsl(var(--primary-gradient-start) / 0.2) 0%, transparent 70%), radial-gradient(ellipse at 50% 100%, hsl(var(--primary-gradient-end) / 0.2) 0%, transparent 70%)",
        "primary-gradient":
          "linear-gradient(90deg, hsl(var(--primary-gradient-start)), hsl(var(--primary-gradient-middle)), hsl(var(--primary-gradient-end)))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
