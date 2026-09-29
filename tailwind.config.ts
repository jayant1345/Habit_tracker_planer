import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Mor Pankh (Peacock / Deep Teal / Royal Blue-Green)
        peacock: {
          50: '#f0f9fa',
          100: '#d7f0f4',
          200: '#b4e2ec',
          300: '#7ecee0',
          400: '#3eb0cd',
          500: '#1c93b3',
          600: '#147694',
          700: '#135e76',
          800: '#164d60',
          900: '#0b3340',
          950: '#041d27',
        },
        feather: {
          50: '#eefbf8',
          100: '#d3f6ee',
          200: '#abebd9',
          300: '#75dabf',
          400: '#3ec09f',
          500: '#17b890',
          600: '#15856c',
          700: '#146a58',
          800: '#135447',
          900: '#0d3830',
          950: '#041f1b',
        },
        royal: {
          50: '#f1f4fe',
          100: '#e1e7fc',
          200: '#c8d4fa',
          300: '#a3b7f6',
          400: '#7790ef',
          500: '#5368e5',
          600: '#3d4cd4',
          700: '#323ab9',
          800: '#2c3395',
          900: '#1b235e',
          950: '#0d1134',
        },
        // Golden / Amber Accents
        gold: {
          50: '#fffbf0',
          100: '#fef5d6',
          200: '#fde9a8',
          300: '#fad671',
          400: '#f6bd39',
          500: '#f4a313',
          600: '#d9810a',
          700: '#b45f0b',
          800: '#924a10',
          900: '#773d10',
          950: '#431e05',
        },
        // Premium Metallic Gold Palette
        metallic: {
          light: '#f9df88',
          DEFAULT: '#d4af37',
          dark: '#aa8214',
          shimmer: '#fff2b2',
        },
      },
      backgroundImage: {
        'peacock-gradient': 'linear-gradient(135deg, #0b3340 0%, #0d1134 50%, #0d3830 100%)',
        'peacock-card': 'linear-gradient(145deg, rgba(11, 51, 64, 0.85) 0%, rgba(13, 17, 52, 0.85) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f4a313 0%, #f6bd39 50%, #d4af37 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(244, 163, 19, 0.15) 0%, rgba(244, 163, 19, 0) 70%)',
        'feather-gradient': 'linear-gradient(135deg, #17b890 0%, #1c93b3 50%, #5368e5 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 10px rgba(212, 175, 55, 0.2)',
        'gold-md': '0 0 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 0 30px rgba(212, 175, 55, 0.45)',
        'peacock-glow': '0 8px 32px rgba(11, 51, 64, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
