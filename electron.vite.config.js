import path from 'path';
// import svgr from '';
const svgr = require('vite-plugin-svgr').default;
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
    plugins: [
      mkcert(),
      svgr({
        exportAsDefault: true,
        svgrOptions: {
          svgoConfig: {
            plugins: [],
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('src/renderer'),
      },
    },
  },
};
