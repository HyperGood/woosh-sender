import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      "4xl": ["clamp(3.25rem, 2.61rem + 2.5vw, 5rem)", { lineHeight: "1.2" }],
      "3xl": ["3.75rem", { lineHeight: "1.2" }],
      "2xl": ["clamp(2rem, 1.8rem + 0.73vw, 2.5rem)", { lineHeight: "1.2" }],
      xl: ["2rem", { lineHeight: "1.2" }],
      lg: ["clamp(1rem, 0.9rem + 0.36vw, 1.25rem)", { lineHeight: "1.2" }],
      sm: "0.875rem",
    },
    extend: {
      borderRadius: {
        circle: "100%",
      },
      colors: {
        brand: {
          white: "#F9FBFA",
          gray: {
            lighter: "#F3F4F5",
            light: "#F1F3F2",
            medium: "#eaeaea",
            dark: "#383538",
          },
          black: "#19181D",
          accent: "#C8FD6A",
          main: "#1FAE47",
        },
        warning: "#FA7C28",
        error: "#E73232",
        success: "#40C948",
      },
      fontFamily: {
        polysans: ["PolySans", "sans-serif"],
        fhoscar: ["FH Oscar", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
