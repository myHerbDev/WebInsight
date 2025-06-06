import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"
import defaultConfig from "shadcn/ui/tailwind.config"

const config = {
  ...defaultConfig,
  content: [...defaultConfig.content, "./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...defaultConfig.theme,
    container: {
      center: true,
      padding: "1.5rem", // Slightly reduced padding for a tighter feel if needed
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      ...defaultConfig.theme.extend,
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "0.75rem", // Slightly more rounded for a softer feel
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        // Minimal shadows
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
        none: "none",
      },
      keyframes: {
        ...defaultConfig.theme.extend.keyframes,
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // New loading animation keyframes
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
        ...defaultConfig.theme.extend.animation,
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // New loading animations
        "pulse-scale": "pulseScale 2s infinite ease-in-out",
        orbit1: "orbit 3s infinite linear",
        orbit2: "orbit 3s infinite linear 0.6s",
        orbit3: "orbit 3s infinite linear 1.2s",
        orbit4: "orbit 3s infinite linear 1.8s",
        "fade-in-grow": "fadeInGrow 0.5s ease-out forwards",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
} satisfies Config

export default config
