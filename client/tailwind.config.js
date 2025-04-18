/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // make sure this matches your file structure
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require("tailwind-scrollbar-hide"), // 👈 Add this line
    ],
  }
  