import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#3B82F6",
                    light: "#60A5FA",
                    dark: "#2563EB",
                },
                success: "#10B981",
                warning: "#F59E0B",
                error: "#EF4444",
            },
        },
    },
};
export default config;