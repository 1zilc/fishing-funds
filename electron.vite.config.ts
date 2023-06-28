import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import { defineConfig, splitVendorChunkPlugin } from 'electron-vite';

// electron.vite.config.js
export default defineConfig({
  main: {
    // vite config options
  },
  preload: {
    // vite config options
  },
  renderer: {
    // vite config options
    server: {
      port: 3456,
      strictPort: true,
      https: true,
    },
    plugins: [mkcert()],
    resolve: {
      alias: {
        '@': path.resolve('src/renderer'),
      },
    },
  },
});
