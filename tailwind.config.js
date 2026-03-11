/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        jade: "#00A36C",
        pistachio: "#93C572",
        "deep-forest": "#2C4A3B",
      },
    },
  },
  plugins: [],
}