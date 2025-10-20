import path from 'path';
import react from '@vitejs/plugin-react';
import reactSWC from '@vitejs/plugin-react-swc';
import { defineConfig } from 'electron-vite';

export default defineConfig(({ command }) => {
  const prod = command === 'build';

  return {
    main: {
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
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                return 'vendor';
              }
              return null;
            },
          },
        },
      },
      server: {
        port: 3456,
        strictPort: true,
        proxy: {
          // Dev-only proxy to avoid CORS when calling Google Generative Language OpenAI-compatible endpoints
          // Usage in dev: set baseURL to http://localhost:3456/ai
          '/ai': {
            target: 'https://generativelanguage.googleapis.com/',
            changeOrigin: true,
            secure: true,
            rewrite: (p) => p.replace(/^\/ai/, ''),
          },
        },
      },
      plugins: [
        prod
          ? react({
              babel: {
                plugins: ['babel-plugin-react-compiler'],
              },
            })
          : reactSWC(),
      ],
      resolve: {
        alias: {
          '@': path.resolve('src/renderer'),
        },
      },
    },
  };
});
