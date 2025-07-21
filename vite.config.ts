import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

function excludeStoriesInBuild() {
  return {
    name: "exclude-stories-in-build",
    transform(_: string, id: string) {
      if (
        process.env.NODE_ENV === "production" &&
        id.endsWith(".stories.tsx")
      ) {
        return {
          code: "",
          map: null,
        };
      }
      return null;
    },
  };
}

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      ...(isBuild ? [excludeStoriesInBuild()] : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
      server: {
      open: true,
    },
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          assetFileNames: (assetInfo) => {
            const names = assetInfo.names ?? [];
            const name = names[0] ?? "";
            const ext = name.split(".").pop()?.toLowerCase();

            if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
              return "fonts/[name]-[hash][extname]";
            }
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
              return "static/[name]-[hash][extname]";
            }
            if (ext === "css") {
              return "styles/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
          chunkFileNames: "scripts/[name]-[hash].js",
          entryFileNames: "scripts/[name]-[hash].js",
        },
      },
    },
  };
});
