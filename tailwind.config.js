module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        hasHover: { raw: "(hover: hover)" },
        "3xl": { raw: "(min-width: 1700px)" },
      },
    },
    fontFamily: {
      sans: ["Source Sans Pro", "sans-serif"],
      serif: ["Source Serif Pro", "serif"],
    },
  },
  plugins: [],
}
