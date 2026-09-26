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
          bg:            '#080D18',
          surface:       '#0D1422',
          elevated:      '#131D2D',
          border:        '#243147',
          'border-subtle': '#1A2637',
          primary:       '#4F8CFF',
          'primary-soft': '#182D52',
          'primary-hover': '#6BA0FF',
          text:          '#F1F5F9',
          'text-secondary': '#CBD5E1',
          muted:         '#8B9AB2',
          'muted-dark':  '#556376',
          success:       '#26D9A0',
          'success-soft': '#0D2E24',
          warning:       '#F5B942',
          'warning-soft': '#2E2510',
          critical:      '#F0526F',
          'critical-soft': '#2E1018',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Mono"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'cb-sm': '6px',
        'cb-md': '8px',
        'cb-lg': '12px',
        'cb-xl': '16px',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '19': '76px',
      },
      fontSize: {
        'xxs': ['10px', { lineHeight: '14px' }],
      },
      transitionTimingFunction: {
        'cb': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in': 'slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
