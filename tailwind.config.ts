import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      "4xl": [ '5rem', { lineHeight: '1.2' } ],
      "3xl": [ '3.75rem', { lineHeight: '1.2' } ],
      "2xl": [ '2.5rem', { lineHeight: '1.2' } ],
      "xl": [ '2rem', { lineHeight: '1.2' } ],
      "lg": [ '1.25rem', { lineHeight: '1.2' } ],
    },
    extend: {
      borderRadius: {
        "circle": "100%",
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
        },
        warning: "#FA7C28",
        error: "#E73232",
      },
      fontFamily: {
        polysans: ["PolySans", "sans-serif"],
        fhoscar: ["FH Oscar", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
