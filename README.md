# Jenesei Template for React Project

A production-ready React application template used as a starting point for Jenesei frontend projects.

The template includes routing, data fetching, localization, PWA support, environment-based builds, app metadata injection, icon generation, robots.txt handling, and a strict formatting/linting setup.

## Stack

- React 19
- Vite 8
- TypeScript 6
- TanStack Router
- TanStack Query
- TanStack Form
- i18next and react-i18next
- Jenesei Kit React
- Vite PWA
- Biome
- Yarn

## Requirements

- Node.js `22.18.0`
- Yarn

Use the Node version from `.nvmrc`:

```bash
nvm use
```

## Getting Started

Install dependencies:

```bash
yarn install
```

Start the local development server:

```bash
yarn start
```

By default, Vite starts on port `3000`. The port can be changed with `VITE_PORT`.

## Scripts

| Command | Description |
| --- | --- |
| `yarn start` | Start Vite in `dev` mode. |
| `yarn start:dev` | Start Vite in `dev` mode. |
| `yarn start:stage` | Start Vite in `stage` mode. |
| `yarn start:prod` | Start Vite in `prod` mode. |
| `yarn build:dev` | Type-check and build in `dev` mode. |
| `yarn build:stage` | Type-check and build in `stage` mode. |
| `yarn build:prod` | Type-check and build in `prod` mode. |
| `yarn biome:lint` | Run Biome lint. |
| `yarn biome:lint:check` | Check lint rules without fixes. |
| `yarn biome:format` | Format source files with Biome. |
| `yarn biome:format:check` | Check formatting without writing changes. |
| `yarn changelog` | Update `CHANGELOG.md` from conventional commits. |
| `yarn bundle-visualizer` | Open the Vite bundle visualizer. |

## Environment

The project uses Vite modes and `VITE_*` environment variables.

Mode-specific files currently present:

- `.env.dev`
- `.env.prod`
- `.env.stage`

Base variables are defined in `.env`.

| Variable | Purpose |
| --- | --- |
| `VITE_DEFAULT_DESCRIPTION` | Default application description for metadata and PWA manifest. |
| `VITE_DEFAULT_NAME` | Full application name. |
| `VITE_DEFAULT_NAME_SHORT` | Short application name. |
| `VITE_DEFAULT_THEME_COLOR` | Theme and background color used by the PWA manifest. |
| `VITE_BASE_PATH` | Public base path for Vite assets, HTML icons, TanStack Router, PWA scope, and start URL. |
| `VITE_BASE_URL` | Main API base URL. |
| `VITE_SOCKET_URL` | WebSocket URL. |
| `VITE_CORE_URL` | Core domain value used by the app. |
| `VITE_AVAILABILITY_COOKIE_NAME` | Cookie name used for auth availability checks. |
| `VITE_NODE_ENV` | Runtime environment name used by application code. |
| `VITE_QUERY_STALE_TIME` | Default TanStack Query stale time in milliseconds. |
| `VITE_BUILD_INFO_EXPIRATION_TIME` | Build info expiration value used by environment configuration. |
| `VITE_CACHE_VERSION_MAX_AGE_SECONDS` | Optional max age for the service worker build-info cache. |
| `VITE_PORT` | Local Vite dev server port. |
| `VITE_OUTPUT_DIR` | Build output directory. |
| `VITE_APP_VERSION` | Application version exposed to the PWA service worker flow. |

## Project Structure

```text
src/
  app.tsx                     Application provider tree
  main.tsx                    React entry point and service worker bootstrap
  classes/
    class-sw/                 Service worker lifecycle helper
  components/                 Shared UI components
  contexts/                   React context providers and hooks
  core/
    consts/                   Shared constants
    envs/                     Environment variable mapping
    functions/                Shared utility functions
    i18n/                     i18next setup
    logger/                   Logging helper
    query/                    TanStack Query client
    router/                   TanStack Router setup
    types/                    Shared TypeScript types
  layouts/                    Root, router, public, private, and error layouts
  pages/                      Public and private route pages
```

Public assets are stored in `public/`.

Localization files are stored in:

```text
public/locales/en/translation.json
public/locales/ru/translation.json
```

Robots files are stored in `robots/`.

## Routing

Routing is configured with TanStack Router in `src/core/router/router.tsx`.

Current route groups:

- `/pu` for public routes
- `/pu/home` for the public home page
- `/pr` for private routes
- `/pr/home` for the private home page

The root route redirects unknown routes to the public route group. The public and private route groups redirect their base paths to their home pages.

## Providers

The app-level provider tree is defined in `src/app.tsx`.

It includes:

- screen width provider
- language provider
- error boundary layout
- TanStack Query provider
- permission provider
- geolocation provider
- dialog provider
- PWA provider
- router layout

## Localization

i18next is initialized in `src/core/i18n/index.ts`.

The app supports language-only detection and loads translations from:

```text
/locales/{{lng}}/{{ns}}.json
```

Supported languages are configured in `src/core/consts/index.ts`.

When adding a language:

1. Add the language metadata to `OBJECT_LANGUAGE`.
2. Add a new translation file under `public/locales/<lng>/translation.json`.
3. Keep translation keys aligned across all locale files.

## PWA

PWA support is configured in `vite.config.ts` through `vite-plugin-pwa`.

The service worker helper is implemented in `src/classes/class-sw/index.ts` and exposed to React through `ProviderPWA`.

Important behavior:

- Service worker registration is enabled only when `env.mode === 'prod'`.
- The app can detect offline readiness.
- The app can detect available updates.
- The app can reset service worker cache and reload from a clean state.
- New app versions are read from `build-info.txt` under the configured public base path with a cache-busting request when an update is available.

## Icons and Manifest

Application icons are generated by `@jenesei-software/jenesei-plugin-vite`.

Source logo:

```text
public/logos/logo-jenesei-id.png
```

Generated icons are written to:

```text
public/icons/
```

The generated icons are used in both `index.html` and the PWA manifest.

## Robots

`viteStaticCopy` copies the mode-specific robots file to `robots.txt` during build.

Configured modes:

| Mode | Source file | Meta robots |
| --- | --- | --- |
| `dev` | `robots/robots.dev.txt` | `noindex, nofollow` |
| `stage` | `robots/robots.stage.txt` | `noindex, nofollow` |
| `prod` | `robots/robots.prod.txt` | `index, follow` |

Make sure every build mode has a matching robots file before using it in CI/CD.

## Code Style

Formatting and linting are handled by Biome.

Key conventions:

- TypeScript strict mode is enabled.
- Imports are organized by Biome.
- Use the `@local/*` alias for imports from `src`.
- Keep code comments and in-code instructions in English.
- Keep shared logic in `src/core`.
- Keep route-level UI in `src/pages`.
- Keep layout concerns in `src/layouts`.

Before opening a pull request, run:

```bash
yarn biome:format
yarn biome:lint:check
yarn build:dev
```

## Build

Create a production build:

```bash
yarn build:prod
```

The output directory is controlled by `VITE_OUTPUT_DIR` and defaults to `build`.

## Deployment Notes

- Provide all required `VITE_*` variables for the selected mode.
- Ensure `robots.txt` behavior matches the target environment.
- Ensure `VITE_APP_VERSION` is updated by the release process.
- Publish or generate `/build-info.txt` if the PWA update prompt should display the new version.
- Serve the built app as a single page application with fallback to `index.html`.

## Troubleshooting

If the app starts on an unexpected port, check `VITE_PORT`.

If a build fails while copying `robots.txt`, verify that the selected Vite mode has a matching file in `robots/`.

If PWA updates do not appear locally, remember that service worker registration is enabled only for `prod` mode.

If translations do not load, check the language code in `OBJECT_LANGUAGE` and make sure the matching file exists in `public/locales/<lng>/translation.json`.
