/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Netflix Theme Colors
        netflix: {
          red: '#e50914',
          'red-dark': '#b20710',
          'red-light': '#ff1e2d',
          'red-glow': 'rgba(229, 9, 20, 0.3)',
        },
        bg: {
          primary: '#000000',
          secondary: '#0a0a0a',
          tertiary: '#141414',
          card: 'rgba(20, 20, 20, 0.8)',
          'card-hover': 'rgba(25, 25, 25, 0.9)',
        },
        glass: {
          bg: 'rgba(20, 20, 20, 0.7)',
          border: 'rgba(255, 255, 255, 0.1)',
          shadow: 'rgba(0, 0, 0, 0.3)',
        },
        text: {
          primary: '#ffffff',
          secondary: '#e5e5e5',
          muted: '#b3b3b3',
          disabled: '#737373',
        },
        accent: {
          gold: '#ffd700',
          blue: '#00d4ff',
          green: '#46d369',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'gradient-netflix': 'linear-gradient(135deg, #e50914 0%, #b20710 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(178, 7, 16, 0.05) 100%)',
        'gradient-backdrop': 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
        'gradient-hero': 'linear-gradient(45deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%)',
      },
      boxShadow: {
        'netflix': '0 0 20px rgba(229, 9, 20, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(229, 9, 20, 0.3)',
      },
      backdropBlur: {
        'strong': '24px',
        'medium': '16px',
        'light': '8px',
      },
      fontFamily: {
        'inter': ['var(--font-inter)', 'sans-serif'],
        'roboto': ['var(--font-roboto)', 'sans-serif'], 
        'poppins': ['var(--font-poppins)', 'sans-serif'],
        'jakarta': ['var(--font-jakarta)', 'sans-serif'],
        'cinematic': ['Cinzel', 'Playfair Display', 'serif'],
        'display': ['Playfair Display', 'var(--font-jakarta)', 'sans-serif'],
        'netflix': ['var(--font-jakarta)', 'var(--font-roboto)', 'Arial', 'sans-serif'],
        'heading': ['var(--font-jakarta)', 'var(--font-poppins)', 'sans-serif'],
        'body': ['var(--font-jakarta)', 'var(--font-inter)', 'sans-serif'],
        sans: ['var(--font-jakarta)', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],
        'sm': ['0.875rem', { lineHeight: '1.375' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.625' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.375' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.125' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'hero': ['clamp(2.5rem, 5vw, 6rem)', { lineHeight: '1' }],
        'display': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.125' }],
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        'cinematic': '0.15em',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(229, 9, 20, 0.2), 0 0 10px rgba(229, 9, 20, 0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(229, 9, 20, 0.4), 0 0 20px rgba(229, 9, 20, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
