import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: { soft: "0 14px 35px rgba(22, 34, 51, .08)" },
      colors: { ink: "#152238", mist: "#F7F8FA", line: "#E7E9EE", brand: "#195CFF" }
    }
  },
  plugins: []
} satisfies Config;
