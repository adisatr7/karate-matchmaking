/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "quicksand": ["Quicksand"],
      },

      fontSize: {
        "heading": 28,
        "subheading": 26,
        "body": 20,
        "caption": 18
      },

      colors: {
        "primary-opaque": "#C5022E",
        "secondary-opaque": "#00258B",
        "dark-glass": "#1C1917"
      },
      
      backgroundImage: {
        "primary-gradient": "linear-gradient(to top left, #C40017, #96002D)",
        "secondary-gradient": "linear-gradient(to top left, #0032B2, #002A95)",
        
      }
    }
  },
  plugins: [],
}

