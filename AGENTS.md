# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

This repository is a React application template.

This is NOT a reusable package/library repository.

Expected work includes:

- application features
- API integrations
- routing
- forms
- state management
- localization
- PWA behavior
- environment configuration

Core stack:

- React 19
- TypeScript 6
- Vite 8
- TanStack Router
- TanStack Query
- TanStack Form
- Axios
- Yup
- i18next
- Biome
- vite-plugin-pwa
- Jenesei UI kit (`@jenesei-software/jenesei-kit-react`)

---

## Commands

Use npm.

Development:

```bash
npm run start
npm run start:dev
npm run start:stage
npm run start:prod
````

Build:

```bash
npm run build:dev
npm run build:stage
npm run build:prod
```

Validation:

```bash
npm run biome:lint:check
npm run biome:format:check
```

Minimum validation before completing work:

```bash
npm run biome:lint:check
npm run build:dev
```

---

## Project structure expectations

Important paths:

* `src/` — application source
* `src/main.tsx` — application entrypoint
* `vite.config.ts` — build/runtime configuration
* `public/` — static assets
* `public/icons/` — generated icons
* `robots/` — environment robots config
* `build/` — generated output

---

## TypeScript rules

* Keep strict typing.
* Do not weaken compiler settings to suppress errors.
* Avoid `any` unless clearly justified.
* Prefer typed API contracts.
* Prefer explicit DTOs and schema types.
* Keep form typing accurate.

---

## Imports

Use:

```ts
@local/*
```

for internal source imports.

Respect Biome import ordering:

1. `@local/**`
2. package imports
3. relative imports

Rules:

* avoid circular imports
* avoid deeply coupled cross-feature imports
* keep module boundaries clean

---

## Routing

This template uses TanStack Router.

Rules:

* keep route ownership explicit
* colocate route logic where practical
* avoid hidden navigation side effects
* preserve route modularity
* prefer lazy loading for large features

---

## Data fetching

This template uses Axios + TanStack Query.

Rules:

* centralize API logic
* type request/response contracts
* avoid ad hoc fetch logic inside random UI components
* use stable query keys
* handle loading/error states intentionally
* avoid duplicate requests

---

## Forms

This template includes TanStack Form + Yup.

Rules:

* keep validation explicit
* avoid duplicated schema logic
* prefer reusable abstractions when patterns repeat
* keep form state predictable

---

## Internationalization

This template includes i18next.

Rules:

* avoid hardcoded UI strings
* preserve translation readiness
* use consistent translation keys
* keep locale support maintainable

---

## Environment configuration

Build/runtime behavior depends on environment variables.

Examples:

* app name
* theme color
* description
* base URL
* output directory
* cache timing
* port

Rules:

* prefer env-driven configuration
* avoid hardcoded environment-specific values
* preserve compatibility across:

  * dev
  * stage
  * prod

---

## PWA rules

This template includes service worker + manifest generation.

Important constraints:

* do not rename `vite-sw.js` unless intentionally redesigning PWA behavior
* preserve manifest generation
* preserve runtime caching behavior unless intentionally changing it
* validate PWA after config changes

---

## UI rules

UI is based on:

`@jenesei-software/jenesei-kit-react`

Rules:

* prefer existing kit primitives
* avoid introducing competing design systems unnecessarily
* maintain visual consistency
* keep component usage aligned with existing patterns

---

## State management

State should remain intentional.

Prefer:

* local state when enough
* query cache for server state
* scoped shared state when justified

Avoid:

* unnecessary global state
* duplicated state ownership
* hidden mutation flows

---

## Performance

Prefer:

* route splitting
* efficient query usage
* minimal rerenders
* memoization only when justified

Avoid:

* oversized bundles
* repeated network calls
* unnecessary provider nesting
* broad rerender cascades

---

## Generated artifacts

Never manually edit:

* `build/`
* generated icons
* generated manifest/service worker artifacts

These are generated outputs.

---

## Safe completion checklist

Before finishing:

* lint passes
* build passes
* imports remain clean
* no circular dependencies introduced
* env behavior preserved
* routing remains valid
* API contracts typed
* i18n compatibility preserved
* PWA config intact
* generated artifacts not manually edited
