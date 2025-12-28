/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}",
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        GREEM_700: '#00875F',
        GEREEN_500: '#00B37E',
        RED: '#F75A68',
        RED_DARK: '#AA2834',
        GRAY_700: '#121214',
        GRAY_600: '#202024',
        GRAY_500: '#29292E',
        GRAY_400: '#323238',
        GRAY_300: '#7C7C8A',
        GRAY_200: '#C4C4CC',
        GRAY_100: '#E1E1E6',
      },
      fontFamily: {
        'Roboto_400Regular': 'Roboto_400Regular',
        'Roboto_500Medium': 'Roboto_500Medium',
        'Roboto_700Bold': 'Roboto_700Bold',
      },
    },
  },
  plugins: [],
}

