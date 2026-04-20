# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-04-19

### Security

- **Replace custom plaintext-password auth with Supabase Auth.** Users now
  sign in via `supabase.auth.signInWithPassword`; the edge function verifies
  a real JWT via `supabase.auth.getUser(token)` on every request. The previous
  `/signup` and `/login` handlers that stored plaintext passwords in the KV
  store have been removed.
- **JWT middleware on all API routes.** The server now derives `userId` from
  the verified token — it no longer trusts a client-supplied ID in the URL
  or body.
- **CORS allowlist.** `ALLOWED_ORIGINS` replaces the previous `*` wildcard.
- **Committed anon key removed.** The Supabase URL and anon key move to
  `.env.local` (see `.env.example`). The old key in git history must be
  rotated via the Supabase dashboard.
- Fixed logout: no longer references the typo'd `fittrack_user_id`
  localStorage key — logout is now driven by `supabase.auth.signOut()`.

### Fixed

- **Routines `DELETE` endpoint** now actually deletes the routine scoped to
  the authenticated user (previously silently returned success without
  removing anything).

### Added

- Shared `UserProfile` type in `src/app/types/user.ts`.
- `authedFetch` helper that attaches the session access token to every
  request to the edge function.
- TypeScript project references (`tsconfig.app.json`, `tsconfig.node.json`)
  with `strict: true`.
- ESLint 9 flat config (`eslint.config.js`) + Prettier config.
- Vitest + Testing Library setup with smoke tests for the Supabase module
  and `authedFetch`.
- GitHub Actions CI workflow running typecheck, lint, format check, test,
  and build on every PR.
- Dependabot config (npm + GitHub Actions), CODEOWNERS, and a PR template.

### Changed

- `package.json`: author → `Anuroop Jajoba`; added `typecheck`, `lint`,
  `test`, `format` scripts; promoted `react` / `react-dom` to direct
  dependencies; added the testing/lint/format toolchain.
- All components now call `authedFetch('/...')` instead of building URLs
  by hand with `projectId` + `publicAnonKey`.

### Removed

- `workflows/deploy.yml` (moved to `.github/workflows/ci.yml`).

## [1.0.0] - 2025-09-01

- Initial public version.
