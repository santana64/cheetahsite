/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['var(--font-ui)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          900: '#06080A',
          850: '#090C10',
          800: '#0D1116',
          700: '#12171E',
          600: '#19202A',
          500: '#222B37',
          400: '#2E3946',
        },
        steel: {
          500: '#707F92',
          400: '#828FA1',
          300: '#9DAABA',
          200: '#C6D0DA',
        },
        paper: '#EEF2F6',
        bone: {
          DEFAULT: '#ECEAE4',
          light: '#F4F2EC',
          dark: '#D9D6CC',
        },
        volt: {
          DEFAULT: '#CDF564',
          dim: '#A3C742',
          deep: '#5C7420',
        },
        champagne: {
          DEFAULT: '#E9C9A0',
          dim: '#C2A074',
        },
        amber: {
          DEFAULT: '#F2A93B',
          dim: '#C4842A',
        },
        drift: '#F2605B',
      },
      maxWidth: {
        shell: '82rem',
        prose: '38rem',
      },
      transitionTimingFunction: {
        cheetah: 'cubic-bezier(0.22, 1, 0.36, 1)',
        gate: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        tick: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
        riseIn: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        scanline: 'scanline 7s linear infinite',
        tick: 'tick 2.4s ease-in-out infinite',
        riseIn: 'riseIn 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
