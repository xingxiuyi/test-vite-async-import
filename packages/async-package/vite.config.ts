import type { ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default async ({ command, mode }: ConfigEnv) => {
  const config = {
    build: {
      minify: false,
      brotliSize: false,
    },
    plugins: [vue()],
  };

  return config;
};
