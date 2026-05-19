export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.10)"
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
