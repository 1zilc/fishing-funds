import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, splitVendorChunkPlugin } from 'electron-vite';

export default defineConfig(({ command }) => {
  const prod = command === 'build';

  return {
    main: {
      build: {
        outDir: 'release/app/dist/main',
        minify: prod,
      },
    },
    preload: {
      build: {
        outDir: 'release/app/dist/preload',
        minify: prod,
      },
    },
    renderer: {
      build: {
        outDir: 'release/app/dist/renderer',
        minify: prod,
        cssCodeSplit: false,
        assetsInlineLimit: 1024 * 20,
      },
      server: {
        port: 3456,
        strictPort: true,
        https: true,
      },
      plugins: [react(), mkcert(), tsconfigPaths(), splitVendorChunkPlugin()],
    },
  };
});
