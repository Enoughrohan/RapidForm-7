import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        blue: { DEFAULT: '#003087', light: '#E8EEF8', mid: '#1a4fa0' },
        orange: { DEFAULT: '#FF9933', light: '#FFF3E6' },
        bg: '#F8F4ED',
      },
    },
  },
  plugins: [],
};

export default config;
