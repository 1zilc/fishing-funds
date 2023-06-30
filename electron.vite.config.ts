import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import react from '@vitejs/plugin-react';
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
      },
      server: {
        port: 3456,
        strictPort: true,
        https: true,
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
