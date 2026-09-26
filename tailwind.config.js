/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f5f6f8',
        panel: '#ffffff',
        border: '#e3e6ea',
        textPrimary: '#1a1d23',
        muted: '#6b7280',
        accent: '#2563eb',
        danger: '#dc2626',
        warn: '#c2740a',
        hit: '#16a34a',
      }
    },
  },
  plugins: [],
}
