import type { ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";

const rollupExternals = ["vue"];

export default async ({ command, mode }: ConfigEnv) => {
  const config = {
    build: {
      minify: false,
      brotliSize: false,
      lib: {
        entry: "src/index.ts",
        formats: ["es"],
      },
      rollupOptions: {
        external: rollupExternals,
      },
    },
    plugins: [vue()],
  };

  return config;
};
