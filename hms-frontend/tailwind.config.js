/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          primary: '#0d9488', // Teal-600: Trustworthy & Clean
          secondary: '#64748b', // Slate-500: Professional text
          accent: '#f0fdfa', // Teal-50: Light background for cards
          danger: '#ef4444', // Red-500: Errors/Blocking
        }
      }
    },
  },
  plugins: [],
}