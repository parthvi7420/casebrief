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
          bg: '#f1f5f9',
          surface: '#ffffff',
          'surface-hover': '#f8fafc',
          border: '#cbd5e1',
          'border-subtle': '#e2e8f0',
          'border-strong': '#94a3b8',
          text: '#0f172a',
          'text-secondary': '#334155',
          muted: '#475569',
          primary: '#2563eb',
          'primary-hover': '#1d4ed8',
          'primary-subtle': '#eff6ff',
          success: '#15803d',
          'success-subtle': '#f0fdf4',
          warning: '#b45309',
          'warning-subtle': '#fffbeb',
          critical: '#b91c1c',
          'critical-subtle': '#fef2f2',
          accent: '#4f46e5',
        },
        bg: '#f1f5f9',
        panel: '#ffffff',
        border: '#cbd5e1',
        textPrimary: '#0f172a',
        muted: '#475569',
        accent: '#2563eb',
        danger: '#b91c1c',
        warn: '#b45309',
        hit: '#15803d',
      },
      borderRadius: {
        'cb-sm': '0.375rem',
        'cb-md': '0.5rem',
        'cb-lg': '0.75rem',
        'cb-xl': '1rem',
      },
      boxShadow: {
        'cb-sm': '0 1px 3px 0 rgba(15, 23, 42, 0.07)',
        'cb-md': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        'cb-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.09), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}

