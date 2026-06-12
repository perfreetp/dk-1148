/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      screens: {
        sm: "375px",
        md: "428px",
        lg: "640px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5A3C',
          dark: '#6B4A2C',
          light: '#A67A5C',
        },
        secondary: {
          DEFAULT: '#D4A574',
          dark: '#C49564',
          light: '#E4B584',
        },
        accent: {
          DEFAULT: '#2D5A4A',
          dark: '#1D4A3A',
          light: '#3D6A5A',
        },
        highlight: {
          DEFAULT: '#E07B4C',
          dark: '#C06B3C',
          light: '#F08B6C',
        },
        bg: {
          primary: '#FAF7F2',
          secondary: '#F0EBE3',
          tertiary: '#E8E2D9',
        },
        text: {
          primary: '#2C2416',
          secondary: '#6B5D4D',
          muted: '#9B8B7A',
        },
        success: '#4A7C59',
        warning: '#C17F4E',
        error: '#A65D57',
      },
      fontFamily: {
        display: ['Noto Serif SC', 'Source Han Serif CN', 'Georgia', 'serif'],
        body: ['Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        accent: ['Ma Shan Zheng', 'cursive'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'warm': '0 4px 12px rgba(139, 90, 60, 0.1)',
        'warm-md': '0 6px 16px rgba(139, 90, 60, 0.12)',
        'warm-lg': '0 8px 24px rgba(139, 90, 60, 0.15)',
        'card': '0 2px 8px rgba(139, 90, 60, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(0.96)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
