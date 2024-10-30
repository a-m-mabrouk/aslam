import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        primary: "#419a9e",
        "gray-text": "#191919",
        "word-color": "#121212",
        "border-color": "#D9D9D9",
        "error-color": "#BF0000",
        "warn-color": "#F89500",
        "success-color": "#1A9946",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
