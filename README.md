# Forge — Fitness Tracker

A full-featured fitness tracking app: workout logging, nutrition tracking,
progress analytics, and an AI trainer. Built with React 18 + TypeScript,
Tailwind CSS, Radix UI, and Supabase (Auth + Edge Functions).

> **Status:** actively being rebuilt — Phase 0 (security + foundation) is in
> flight. See [`docs/UPGRADE_PLAN.md`](docs/UPGRADE_PLAN.md) for the roadmap.

---

## Features

**Workouts.** Set-by-set logger with rest timers, 100+ exercises organized by
muscle group, saved routines, automatic volume calculation, full history.

**Nutrition.** Manual meal logging with macro breakdown, calorie targets,
hydration tracking, and daily/weekly trends.

**Progress analytics.** Body-weight trend charts, per-exercise progression
charts (max weight, volume), workout history.

**AI trainer.** Chat interface answering form, programming, nutrition, and
recovery questions — currently model-backed; a RAG-grounded, agentic version
is planned (see Phase 2 of the upgrade plan).

**Auth + profile.** Supabase Auth (email/password), onboarding flow, goal
and activity-level setup.

## Tech stack

- React 18 + TypeScript + Vite + Tailwind CSS v4
- Radix UI primitives, Lucide icons, Recharts
- Supabase: Auth, Edge Functions (Hono), KV store
- Vitest + Testing Library, ESLint 9 (flat), Prettier
- GitHub Actions CI (typecheck / lint / format / test / build)

## Getting started

### Prerequisites

- Node.js 20+ (CI uses 20; 18 may still work but is unsupported)
- A Supabase project — the free tier is plenty

### 1. Install

```bash
git clone https://github.com/anuroopjajoba3/forge-fitness.git
cd forge-fitness
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local` with values from your Supabase project's
**Settings → API** page:

```
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_SUPABASE_FUNCTION_SLUG=make-server-56c079d7
```

> The anon key is intentionally shipped to the browser — that's the
> `VITE_*` convention. The edge function's **service role key** must stay
> server-side. Set it with `supabase secrets set`, never in `.env.local`.

### 3. Deploy the edge function

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-ref>
supabase functions deploy make-server-56c079d7

supabase secrets set \
  SUPABASE_URL=https://<your-ref>.supabase.co \
  SUPABASE_ANON_KEY=<your-anon-key> \
  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> \
  ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

Optional (for the AI trainer):

```bash
supabase secrets set XAI_API_KEY=<grok-key>
# or
supabase secrets set OPENAI_API_KEY=<openai-key>
```

### 4. Run locally

```bash
npm run dev
```

The app runs at http://localhost:5173.

## Scripts

| Command                                   | What it does                           |
| ----------------------------------------- | -------------------------------------- |
| `npm run dev`                             | Vite dev server with HMR               |
| `npm run build`                           | Typecheck + production bundle          |
| `npm run preview`                         | Serve the `dist/` bundle locally       |
| `npm run typecheck`                       | `tsc -b` across the project references |
| `npm run lint` / `npm run lint:fix`       | ESLint 9 flat config                   |
| `npm run format` / `npm run format:check` | Prettier                               |
| `npm run test` / `npm run test:watch`     | Vitest                                 |

## Project layout

```
src/app/              React app
  components/         Feature components (Dashboard, WorkoutSession, …)
  components/ui/      Radix-wrapped primitives (shadcn-style)
  types/              Shared domain types (UserProfile, …)
src/test/             Vitest setup + smoke tests
utils/supabase/       Shared Supabase client + authedFetch
supabase/functions/   Hono-based edge function (Deno runtime)
docs/                 Upgrade plan, deployment, troubleshooting, guides
.github/              CI, Dependabot, CODEOWNERS, PR/issue templates
```

## Security notes (Phase 0)

- Auth: **Supabase Auth only**. The edge function verifies a real JWT on
  every call via `supabase.auth.getUser(token)` and derives `userId` from
  the token — it never trusts a client-supplied ID.
- CORS: `ALLOWED_ORIGINS` allowlist (comma-separated) replaced the `*`
  wildcard.
- If you are migrating from a pre-1.1.0 deploy: **rotate your anon key** in
  the Supabase dashboard, since the old key was committed to git history.

Full details and rollback plan live in
[`docs/UPGRADE_PLAN.md`](docs/UPGRADE_PLAN.md).

## Deployment

Vercel / Netlify both work out of the box. Build command: `npm run build`,
output dir: `dist`. Add the three `VITE_*` env vars in the hosting
dashboard. The edge function deploys separately via the Supabase CLI
(see step 3 above).

A pre-deploy checklist lives in
[`docs/DEPLOY_CHECKLIST.md`](docs/DEPLOY_CHECKLIST.md).

## Contributing

PRs welcome. The CI workflow runs typecheck, lint, format check, tests,
and a build on every PR — green checks are required before merge. Follow
[Conventional Commits](https://www.conventionalcommits.org/) for commit
messages (`feat:`, `fix:`, `chore:`, `docs:`, …).

## License

MIT © Anuroop Jajoba. See [`LICENSE`](LICENSE) (if present) or the
`license` field in `package.json`.

## Acknowledgments

Built with [React](https://react.dev/),
[Vite](https://vitejs.dev/),
[Tailwind CSS](https://tailwindcss.com/),
[Radix UI](https://www.radix-ui.com/),
[Supabase](https://supabase.com/),
[Lucide](https://lucide.dev/), and
[Recharts](https://recharts.org/).
