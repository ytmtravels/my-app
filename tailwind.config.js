/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGray: "rgba(7, 16, 7, 0.75)",
        darkGreen: "#212921",
        primaryGreen: "#459F48",
        textColor: "#121212",
        sideNavbg: "#F7F9FB",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "login-gradient":
          "linear-gradient(90deg, #071007 54.9%, rgba(14, 32, 14, 0.20) 118.99%), url('/assets/new_map.png')",
      },
      boxShadow: {
        login: "0px 0px 69px -5px rgba(0, 0, 0, 0.07)",
        searchBox:
          "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
        listContentShadow:
          "4px 0px 8px 0px rgba(0, 0, 0, 0.06), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
