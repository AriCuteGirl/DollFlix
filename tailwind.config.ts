import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        violet: "rgb(var(--violet) / <alpha-value>)",
        fuchsia: "rgb(var(--fuchsia) / <alpha-value>)",
        aurora: "rgb(var(--aurora) / <alpha-value>)",
        rose: "rgb(var(--rose) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 42px rgb(var(--violet) / .38)",
        rose: "0 0 34px rgb(var(--rose) / .35)",
        glass: "inset 0 1px 0 rgb(255 255 255 / .14), 0 20px 80px rgb(0 0 0 / .32)"
      },
      screens: {
        xs: "320px",
        "3xl": "2560px"
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: ".45", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.22)" }
        },
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "25%": { transform: "translate(-1%,1%)" },
          "50%": { transform: "translate(1%,-1%)" },
          "75%": { transform: "translate(-1%,-1%)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.35s infinite",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite",
        grain: "grain .9s steps(2) infinite"
      }
    }
  },
  plugins: []
};

export default config;
