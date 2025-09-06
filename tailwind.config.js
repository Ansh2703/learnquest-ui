/** @type {import('tailwindcss').Config} */
module.exports = {
  // The 'content' array is the most important part.
  // It tells Tailwind to look at any file inside the 'src' folder
  // that ends with .js, .jsx, .ts, or .tsx.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

