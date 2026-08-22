/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#14151C',
        'bg-base-deep': '#0F1015',
        'accent-primary': '#5865F2',
        'accent-glow': '#8B7FF5',
        'success': '#57F287',
        'danger': '#ED4245',
        'warm-gold': '#FFC876',
        'warm-pink': '#FF8FB1',
        'scrapbook-cream': '#F3E9D8',
        'scrapbook-brown': '#8B5E3C',
        'reveal-black': '#08090C',
        'text-primary': '#EDEDF2',
        'text-muted': '#9A9AA8',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],   // headlines, mission-briefing acts
        body: ['"Manrope"', 'sans-serif'],       // body copy, UI chrome
        script: ['"Caveat"', 'cursive'],         // scrapbook captions only
        emotional: ['"Fraunces"', 'serif'],      // Step 6 only, never elsewhere
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}
