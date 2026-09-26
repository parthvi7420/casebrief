/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cb: {
          bg: '#f8fafc',
          surface: '#ffffff',
          'surface-hover': '#f1f5f9',
          border: '#e2e8f0',
          'border-subtle': '#cbd5e1',
          text: '#0f172a',
          'text-secondary': '#334155',
          muted: '#64748b',
          primary: '#2563eb',
          'primary-hover': '#1d4ed8',
          success: '#16a34a',
          warning: '#d97706',
          critical: '#dc2626',
          accent: '#6366f1',
        },
        bg: '#f8fafc',
        panel: '#ffffff',
        border: '#e2e8f0',
        textPrimary: '#0f172a',
        muted: '#64748b',
        accent: '#2563eb',
        danger: '#dc2626',
        warn: '#d97706',
        hit: '#16a34a',
      },
      borderRadius: {
        'cb-sm': '0.375rem',
        'cb-md': '0.5rem',
        'cb-lg': '0.75rem',
        'cb-xl': '1rem',
      },
      boxShadow: {
        'cb-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'cb-md': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'cb-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
