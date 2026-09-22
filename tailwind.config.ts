import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102A43',
        slate: { DEFAULT: '#627D98', 100: '#E9EEF2', 200: '#D9E2EC', 300: '#BCCCDC', 400: '#829AB1', 500: '#627D98', 600: '#486581', 700: '#334E68', 800: '#243B53', 900: '#102A43' },
        cloud: '#F5F7FA',
        brand: { DEFAULT: '#0B7285', dark: '#075A68', soft: '#E6F6F8' },
        accent: { DEFAULT: '#F59F00', soft: '#FFF4D6' },
      },
      boxShadow: { panel: '0 12px 40px rgba(16, 42, 67, 0.08)' },
    },
  },
  plugins: [],
};

export default config;
