/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F5CA8",
        secondary: "#008000",
        white: "#FFFFFF",
      },
      fontFamily: {
        roboto: "Roboto, sans-serif",
      },
      flex: {
        0.25: "0.25 0.25 0%",
        0.75: "0.75 0.75 0%",
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
      },
    },
  },
  plugins: [],
};
