import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D9E75',
        primaryDark: '#0F6E56',
        primaryLight: '#E1F5EE',
        accent: '#FAC775',
        background: '#F8FAFB',
        surface: '#FFFFFF',
        textPrimary: '#1A1A2E',
        textSecondary: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
        pill: '99px',
      },
    },
  },
  plugins: [],
};

export default config;
