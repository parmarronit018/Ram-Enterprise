/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        cream: {
          50:  '#fefefe',
          100: '#fafaf8',
          200: '#f5f4ef',
          300: '#ede9e0',
          400: '#ddd8cc',
        },
        stone: {
          850: '#1c1917',
        },
        brand: {
          DEFAULT: '#2d6a4f',
          dark:    '#1b4332',
          light:   '#52b788',
          accent:  '#b7791f',
        },
      },
      boxShadow: {
        'card':    '0 4px 24px rgba(0,0,0,0.07)',
        'card-lg': '0 12px 48px rgba(0,0,0,0.12)',
        'btn':     '0 4px 14px rgba(45,106,79,0.25)',
        'glow':    '0 0 0 1px rgba(82,183,136,0.3), 0 0 30px rgba(82,183,136,0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'hero-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(45,106,79,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(82,183,136,0.1) 0%, transparent 50%)',
      },
      animation: {
        'fadeUp':       'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fadeIn':       'fadeIn 0.4s ease forwards',
        'slideInRight': 'slideInRight 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
