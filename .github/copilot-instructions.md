<!-- Copilot instructions tailored for Cypress Real-World App (RWA) -->
# Repo Overview (short)
- Full-stack example: React frontend (Vite) + Express backend (TypeScript) with an on-disk JSON DB (`lowdb`). See `package.json` scripts for workflows.

# High-level architecture
- Frontend: `src/` built and served by `vite` (`yarn start:react`). Frontend entry is `src/index.tsx` (alternate provider entries: `src/index.auth0.tsx`, `src/index.okta.tsx`, `src/index.cognito.tsx`, `src/index.google.tsx`).
- Backend: `backend/` (Express + TypeScript). Main entry `backend/app.ts`. Routes are file-per-resource (e.g. `backend/user-routes.ts`, `backend/transaction-routes.ts`).
- Database: `data/database.json` managed with `lowdb`. The app reseeds from `data/database-seed.json` on `yarn dev` (see `predev`/`prestart` scripts).
- GraphQL: schema at `backend/graphql/schema.graphql` with resolvers in `backend/graphql/resolvers/` and exposed at `/graphql` in `backend/app.ts`.

# Key developer workflows & commands
- Full dev (frontend + backend watch): `yarn dev` (runs `vite` + `ts-node` backend via `nodemon`).
- Dev with code coverage instrumentation: `yarn dev:coverage` then run Cypress with `--env coverage=true`.
- API only (dev): `yarn start:api` (non-watch) or `yarn start:api:watch` (watch via `nodemon`).
- Seed DB: `yarn db:seed` or use `yarn start:empty` to boot with `empty-seed.json`.
- Run Cypress GUI: `yarn cypress:open`; headless: `yarn cypress:run`.
- Unit tests: `yarn test:unit` (Vitest).

# Project-specific conventions & patterns
- Authentication providers are feature-flagged by env vars in `backend/app.ts` (e.g. `VITE_AUTH0`, `VITE_OKTA`, `VITE_AWS_COGNITO`, `VITE_GOOGLE`). When testing an alternate provider, the README instructs replacing `src/index.tsx` with one of the provider entry files and using the corresponding `yarn dev:<provider>` script.
- Database reseed: starting the app runs `predev`/`prestart` which copies/creates `data/database.json` from `data/database-seed.json`. Tests assume a fresh seed—avoid manual edits to `data/database.json` without reseeding.
- Backend routes use `ensureAuthenticated` / provider JWT middlewares in `backend/helpers.ts`. Provider middleware is mounted conditionally in `backend/app.ts`.
- Tests: E2E and API tests live under `cypress/tests/*`; component tests live next to components (`src/components/*.cy.tsx`), unit tests in `src/__tests__`.

# Integration & instrumentation notes
- Code coverage: backend includes conditional middleware for `@cypress/code-coverage` when `global.__coverage__` is present (see `backend/app.ts`). Use `yarn dev:coverage` to enable.
- AWS Cognito: mock exports live in `scripts/mock-aws-exports.js` and `scripts/mock-aws-exports-es5.js`. `predev:cognito` and related scripts compile or copy these into `src/aws-exports.js` as needed.
- GraphQL playground route: mounted at `/graphql` via `gql-playground-routes` and also exposes the GraphQL API with resolvers.

# Files to reference when making changes
- `backend/app.ts` — server wiring, middleware, route mounting, auth flags.
- `backend/database.ts` — canonical place for DB operations and seed behavior.
- `package.json` — canonical scripts and environment-driven workflows.
- `cypress.config.ts` — Cypress baseUrl and environment configuration used by CI/locally.
- `src/index*.tsx` — how frontend switches auth providers.

# Quick examples for code edits
- Add a new API route: create `backend/<resource>-routes.ts`, export an Express router, then add `import <resource>Routes from './<resource>-routes'` and `app.use('/<resource>', <resource>Routes)` in `backend/app.ts`.
- Add DB access: prefer helper functions in `backend/database.ts` (e.g. `createTransaction`, `getUserById`) rather than reading `lowdb` directly.

# Helpful tips for an AI code agent
- Prefer changes that keep TypeScript types: many backend functions and models live in `src/models` and `src/models/db-schema.ts`.
- Keep `data/database.json` reseeding behavior in mind for tests: if adding persistent behavior, update seeding scripts in `scripts/` and `data/` fixtures.
- When running shell snippets for CI or docs, use the scripts in `package.json` (e.g. `yarn dev`, `yarn db:seed`) rather than raw `node`/`ts-node` calls so env wrapping (cross-env) and instrumentations are preserved.

# What I couldn't infer automatically
- Exact developer port overrides in local `.env` (project expects `PORT` and `VITE_BACKEND_PORT`) — consult reviewer if you need custom ports in CI.
- Any CI-specific secrets for third-party auth (Auth0/Okta/Cognito/Google) are not stored here — tests that rely on those providers require external setup.

---
If you'd like, I can now (1) merge this into an existing `.github/copilot-instructions.md` if you have one to combine, or (2) run formatting / add small clarifying examples for any section you want expanded. What should I refine? 
