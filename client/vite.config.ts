import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
