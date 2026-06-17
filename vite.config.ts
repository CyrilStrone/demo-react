import { generateManifestIcons, pluginUpdateIcons, pluginWriteBuildInfo } from '@jenesei-software/jenesei-plugin-vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import path from 'node:path';
import process from 'node:process';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  const VITE_DEFAULT_NAME = env.VITE_DEFAULT_NAME;
  const VITE_DEFAULT_NAME_SHORT = env.VITE_DEFAULT_NAME_SHORT;
  const VITE_DEFAULT_THEME_COLOR = env.VITE_DEFAULT_THEME_COLOR;
  const VITE_DEFAULT_DESCRIPTION = env.VITE_DEFAULT_DESCRIPTION;
  const VITE_API_URL = env.VITE_API_URL;
  const VITE_APP_VERSION = env.VITE_APP_VERSION || 'unknown';
  const VITE_OUTPUT_DIR = env.VITE_OUTPUT_DIR || 'build';
  const VITE_BASE_PATH = env.VITE_BASE_PATH || '/';
  const publicBasePath = VITE_BASE_PATH.endsWith('/') ? VITE_BASE_PATH : `${VITE_BASE_PATH}/`;
  const htmlPublicBasePath = command === 'serve' ? '/' : publicBasePath;

  const robotsMode = {
    prod: {
      txt: 'robots/robots.prod.txt',
      meta: 'index, follow',
    },
    dev: {
      txt: 'robots/robots.dev.txt',
      meta: 'noindex, nofollow',
    },
    stage: {
      txt: 'robots/robots.stage.txt',
      meta: 'noindex, nofollow',
    },
  };
  const robotsConfig = robotsMode[mode as keyof typeof robotsMode] ?? robotsMode.dev;

  const sizesBackgroundTransparent = [57, 64, 72, 76, 114, 120, 144, 152, 180, 192, 256, 384, 512];
  const sizesBackgroundWhite: never[] = [];
  const sizesFavicon = [64];

  const buildInfoPath = path.resolve(__dirname, VITE_OUTPUT_DIR, 'build-info.txt');
  return {
    base: publicBasePath,
    server: {
      host: true,
      port: env.VITE_PORT ? parseInt(env.VITE_PORT, 10) : 3000,
    },
    build: {
      outDir: VITE_OUTPUT_DIR,
    },
    resolve: {
      alias: {
        '@local': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      pluginUpdateIcons({
        pathInputFile: path.resolve(__dirname, 'public/logos/logo-jenesei-id.png'),
        pathOutputDirectory: path.resolve(__dirname, 'public/icons'),
        prefix: 'icon',
        sizesBackgroundTransparent: sizesBackgroundTransparent,
        sizesBackgroundWhite: sizesBackgroundWhite,
        sizesFavicon: sizesFavicon,
      }),
      viteStaticCopy({
        targets: [
          {
            src: robotsConfig.txt,
            dest: '',
            rename: 'robots.txt',
          },
        ],
      }),
      createHtmlPlugin({
        minify: true,
        entry: 'src/main.tsx',
        template: 'index.html',
        inject: {
          data: {
            title: VITE_DEFAULT_NAME_SHORT,
            robotsMeta: robotsConfig.meta,
            icon57: `${htmlPublicBasePath}icons/icon-57x57.png`,
            icon72: `${htmlPublicBasePath}icons/icon-72x72.png`,
            icon76: `${htmlPublicBasePath}icons/icon-76x76.png`,
            icon114: `${htmlPublicBasePath}icons/icon-114x114.png`,
            icon120: `${htmlPublicBasePath}icons/icon-120x120.png`,
            icon144: `${htmlPublicBasePath}icons/icon-144x144.png`,
            icon152: `${htmlPublicBasePath}icons/icon-152x152.png`,
            icon180: `${htmlPublicBasePath}icons/icon-180x180.png`,

            icon64Fav: `${htmlPublicBasePath}icons/icon-64x64-favicon.ico`,
          },
        },
      }),
      react(),
      VitePWA({
        filename: 'vite-sw.js', //!!! НИКОГДА НЕ МЕНЯТЬ !!!
        strategies: 'generateSW',
        registerType: 'prompt',
        includeManifestIcons: false,
        injectRegister: null,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,json}'],
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: new RegExp(`^${VITE_API_URL}/.*$`),
              handler: 'NetworkOnly',
            },
            {
              urlPattern: /build-info\.txt$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'version-cache',
                expiration: {
                  maxEntries: 1,
                  maxAgeSeconds: env.VITE_CACHE_VERSION_MAX_AGE_SECONDS
                    ? parseInt(env.VITE_CACHE_VERSION_MAX_AGE_SECONDS, 10)
                    : 60 * 60 * 24,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
        manifest: {
          display: 'standalone',
          orientation: 'portrait',
          name: VITE_DEFAULT_NAME,
          short_name: VITE_DEFAULT_NAME_SHORT,
          theme_color: VITE_DEFAULT_THEME_COLOR,
          background_color: VITE_DEFAULT_THEME_COLOR,
          description: VITE_DEFAULT_DESCRIPTION,
          scope: publicBasePath,
          start_url: publicBasePath,
          icons: generateManifestIcons({
            path: 'icons',
            prefix: 'icon',
            sizesBackgroundWhite: [],
            sizesBackgroundTransparent: sizesBackgroundTransparent,
            sizesFavicon: sizesFavicon,
          }),
        },
      }),
      pluginWriteBuildInfo({
        pathBuildInfo: buildInfoPath,
        version: VITE_APP_VERSION,
        mode,
      }),
    ],
  };
});
