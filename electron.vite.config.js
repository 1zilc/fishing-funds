import path from 'path';
const mkcert = require('vite-plugin-mkcert').default;

// electron.vite.config.js
export default {
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
};
