import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import { defineConfig, splitVendorChunkPlugin } from 'electron-vite';

// electron.vite.config.js
export default defineConfig({
  main: {
    // vite config options
    build: {
      outDir: 'release/app/dist/main'
    }
  },
  preload: {
    // vite config options
    build: {
      outDir: 'release/app/dist/preload'
    }
  },
  renderer: {
    // vite config options
    build: {
      outDir: 'release/app/dist/renderer'
    },
    server: {
      port: 3456,
      strictPort: true,
      https: true,
    },
    plugins: [mkcert(), splitVendorChunkPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('src/renderer'),
      },
    },
  },
});
