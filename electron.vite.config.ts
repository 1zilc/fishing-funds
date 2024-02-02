import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import react from '@vitejs/plugin-react';
import { defineConfig, splitVendorChunkPlugin, externalizeDepsPlugin } from 'electron-vite';

export default defineConfig(({ command }) => {
  const prod = command === 'build';

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      build: {
        outDir: 'release/app/dist/main',
        minify: prod,
        rollupOptions: {
          output: {
            format: 'es',
          },
        },
      },
    },
    preload: {
      build: {
        plugins: [externalizeDepsPlugin()],
        outDir: 'release/app/dist/preload',
        minify: prod,
        rollupOptions: {
          output: {
            format: 'cjs',
          },
        },
      },
      define: {
        __BUILD_DATE__: Date.now(),
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
        https: {},
      },
      plugins: [react(), mkcert(), splitVendorChunkPlugin()],
      resolve: {
        alias: {
          '@': path.resolve('src/renderer'),
        },
      },
    },
  };
});
