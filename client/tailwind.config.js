/** @type {import('tailwindcss').Config} */

export default {
  mode: "jit",
  safelist: ["bg-primary", "bg-secondary", "text-primary", "text-secondary"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#034853",
        secondary: "#accf9f",
      },
    },
  },
  plugins: [],
};
