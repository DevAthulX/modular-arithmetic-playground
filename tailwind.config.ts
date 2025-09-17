import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      colors: {
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
        // Educational color coding
        "public-key": "hsl(var(--public-key))",
        "private-key": "hsl(var(--private-key))",
        "math-formula": "hsl(var(--math-formula))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.95)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.8) rotate(-5deg)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "1"
          }
        },
        "bounce-in": {
          "0%": {
            transform: "scale(0.3) translateY(50px)",
            opacity: "0"
          },
          "50%": {
            transform: "scale(1.1) translateY(-10px)",
            opacity: "0.8"
          },
          "100%": {
            transform: "scale(1) translateY(0)",
            opacity: "1"
          }
        },
        "slide-up": {
          "0%": {
            transform: "translateY(100%) scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0) scale(1)",
            opacity: "1"
          }
        },
        "morph-in": {
          "0%": {
            transform: "perspective(1000px) rotateX(45deg) rotateY(-10deg) scale(0.8)",
            opacity: "0"
          },
          "100%": {
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
            opacity: "1"
          }
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3)"
          },
          "50%": {
            boxShadow: "0 0 40px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.3)"
          }
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)"
          },
          "50%": {
            transform: "translateY(-20px) rotate(2deg)"
          }
        },
        "shimmer": {
          "0%": {
            transform: "translateX(-100%)"
          },
          "100%": {
            transform: "translateX(100%)"
          }
        },
        "shimmer-once": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0"
          },
          "50%": {
            transform: "translateX(0%)",
            opacity: "1"
          },
          "100%": {
            transform: "translateX(100%)",
            opacity: "0"
          }
        },
        "math-highlight": {
          "0%": {
            backgroundColor: "hsl(var(--math-formula) / 0.1)",
            transform: "scale(1)"
          },
          "50%": {
            backgroundColor: "hsl(var(--math-formula) / 0.3)",
            transform: "scale(1.02)"
          },
          "100%": {
            backgroundColor: "hsl(var(--math-formula) / 0.1)",
            transform: "scale(1)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "fade-in": "fade-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "scale-in": "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "bounce-in": "bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "slide-up": "slide-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "morph-in": "morph-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "shimmer-once": "shimmer-once 2s ease-in-out forwards",
        "math-highlight": "math-highlight 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
