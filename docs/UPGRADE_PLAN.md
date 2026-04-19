# Forge Fitness — Upgrade & AI/ML Platform Plan

**Repo:** `github.com/anuroopjajoba3/forge-fitness`
**Author:** planning draft for Anu — prepared 2026-04-19
**Delivery:** feature branches → PRs to `main` (approval-gated per phase)
**Status:** **PROPOSAL — awaiting approval before any code changes**

---

## 1. Executive Summary

Forge today is a solid React + TypeScript + Supabase fitness tracker with workouts, nutrition, progress analytics, and a chat "AI trainer." The UI is clean but generic, and the AI layer is essentially a big `if/else` of hardcoded fallback strings with an optional Grok/OpenAI pass-through. Under the hood there are also **real security issues** (plaintext passwords, no auth on protected routes, insecure session handling) that must be fixed before the project can be used as a portfolio piece.

The upgrade turns Forge into a showcase of the modern AI/ML stack across all four directions you selected:

1. **ML Platform** — real models for 1RM estimation, plateau detection, volume recommendations, and churn prediction, trained on logged user data, served via a FastAPI microservice, tracked with MLflow, and deployed through GitHub Actions.
2. **RAG + Agentic AI Trainer** — replace the `if/else` trainer with a retrieval-augmented agent grounded in a curated fitness knowledge base. The agent can call Forge's own APIs as tools (log a workout, plan meals, update goals).
3. **Computer Vision Form Checker** — in-browser pose estimation (MediaPipe) for squat/bench/deadlift with real-time feedback; server-side heavier analysis as an optional backend.
4. **Full MLOps Showcase** — CI/CD, Docker, model registry, drift monitoring dashboard, evaluation pipelines. Wraps all three ML pieces in production-grade scaffolding.

Plus: UI/UX aesthetic refresh, new landing page, and security hardening.

Everything ships in **six phased PRs** you approve one at a time. Each PR is runnable and valuable on its own, so you're never stuck waiting on a massive merge.

---

## 2. Current-State Audit

### 2.1 What's already good

- Clean React 18 + Vite + TypeScript setup.
- Radix UI + Tailwind v4 with a reasonable stone/emerald dark theme.
- Reasonable domain model: workouts, nutrition, progress, routines, profiles.
- Supabase Edge Function (Hono) as a simple backend with KV store.
- Dashboard, WorkoutLogger, NutritionTracker, ProgressAnalytics, AITrainerChat, Onboarding already exist as discrete components — easy to evolve.

### 2.2 Critical issues discovered during the audit

These are **non-negotiable** fixes before anything else:

| #   | Issue                                                                              | Location                                           | Impact                                                                |
| --- | ---------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| C1  | Passwords stored in **plaintext**                                                  | `supabase/functions/server/index.tsx` signup/login | Severe security risk; credential leak if KV is ever dumped.           |
| C2  | No server-side session or JWT — client just sends `userId`                         | All endpoints                                      | Any authenticated client can impersonate any user by changing the id. |
| C3  | Logout bug — removes `fittrack_user_id` but login stores `forge_user_id`           | `src/app/App.tsx:150`                              | "Logout" leaves session intact.                                       |
| C4  | `routines` DELETE endpoint ignores userId, always returns success without deleting | `supabase/functions/server/index.tsx:340`          | Broken feature masquerading as working.                               |
| C5  | CORS `origin: "*"` combined with bearer auth header                                | server `cors()` config                             | Open to cross-origin abuse once real auth exists.                     |
| C6  | Credentials committed to `utils/supabase/info.tsx`                                 | `utils/supabase/info.tsx`                          | Should move to env vars + `.env.example`; rotate existing keys.       |
| C7  | Local-storage only session, no refresh semantics                                   | `src/app/App.tsx`                                  | Fragile, won't work across devices.                                   |

### 2.3 Smaller bugs / polish items

- `sendMessage` in `AITrainerChat` uses deprecated `onKeyPress` — switch to `onKeyDown`.
- Progress history returns empty `weightHistory: []` regardless of tracked data.
- No TypeScript strictness enforced; many `any` props (e.g., `userProfile: any`).
- No tests of any kind — zero unit, integration, or e2e.
- No linter/formatter (ESLint/Prettier) checked into the repo.
- README has placeholder `YOUR_USERNAME` and `[Your Name]`.
- Package.json is missing a `lint`, `typecheck`, `test` script and `react`/`react-dom` are only peer deps — rebuild from scratch pulls them in awkwardly.

---

## 3. Proposed Phased Rollout

Each phase ships as its own branch → PR → review → merge. You approve each one before the next begins. **Phase 0 must land first**; the other phases are then mostly independent and can re-order.

| Phase | Branch                        | Theme                                                                                          | Rough effort | Depends on                    |
| ----- | ----------------------------- | ---------------------------------------------------------------------------------------------- | ------------ | ----------------------------- |
| **0** | `fix/security-and-foundation` | Security, bug fixes, CI skeleton, tests scaffold, `.env` migration, TS strict, ESLint/Prettier | 1 PR         | —                             |
| **1** | `feat/ui-refresh`             | New design system, landing page, refactored components                                         | 1 PR         | Phase 0                       |
| **2** | `feat/ml-platform`            | FastAPI model service, training pipeline, MLflow, 4 models, UI integrations                    | 1 PR         | Phase 0                       |
| **3** | `feat/rag-agent-trainer`      | Replace AI trainer with RAG + tool-using agent, eval harness                                   | 1 PR         | Phase 0 (can run alongside 2) |
| **4** | `feat/cv-form-checker`        | Pose estimation, real-time UI feedback, rule-based form analyzer                               | 1 PR         | Phase 1 (UI hooks)            |
| **5** | `feat/mlops-observability`    | Drift monitoring, eval dashboard, Docker Compose, GitHub Actions workflows, runbook            | 1 PR         | Phase 2 + 3                   |

Total: 6 PRs, each independently valuable.

---

## 4. Phase 0 — Foundation (`fix/security-and-foundation`)

**Goal:** stop bleeding before building. Every subsequent phase depends on this.

### 4.1 Security

- Migrate auth to Supabase Auth proper (drop custom signup/login). Supabase Auth handles password hashing, email verification, JWT, refresh tokens.
- All Edge Function routes validate JWT via `Authorization: Bearer` and derive `userId` from the verified token — never trust client-provided `userId`.
- Rotate leaked anon key; move `projectId` / `publicAnonKey` to `.env` consumed via `import.meta.env`; commit `.env.example`.
- Tighten CORS to a whitelist (`localhost:5173`, prod domain).
- Fix `handleLogout` key mismatch and `routines` DELETE endpoint.

### 4.2 Engineering hygiene

- Add `react` and `react-dom` as real deps.
- `tsconfig` → `strict: true`, `noUncheckedIndexedAccess: true`.
- Add ESLint (typescript-eslint, react, react-hooks) + Prettier, wire into `npm run lint`.
- Add Vitest + React Testing Library; write smoke tests for reducers and critical components; add Playwright smoke test for login → dashboard.
- Fold existing Markdown docs (`DEPLOYMENT.md`, `DEPLOY_CHECKLIST.md`, `GITHUB_GUIDE.md`, `QUICKSTART.md`, `START_HERE.md`, `SUMMARY.md`, `TROUBLESHOOTING.md`) into a `docs/` folder and collapse duplication into a single `docs/README.md` + `docs/operations.md`.
- Strong types for `UserProfile`, `Workout`, `Meal`, `Routine`; shared types in `src/app/types/`.

### 4.3 CI skeleton (prep for Phase 5)

- `.github/workflows/ci.yml` running `typecheck`, `lint`, `test`, and `build` on every PR.
- Dependabot config for JS deps.
- `CODEOWNERS`, `PULL_REQUEST_TEMPLATE.md`.

### 4.4 Exit criteria

- All critical security bugs fixed; passwords never stored by app.
- Strict TypeScript compiles clean.
- CI green on a hello-world PR.
- A real logout works.

---

## 5. Phase 1 — UI/UX Refresh (`feat/ui-refresh`)

**Goal:** make Forge _feel_ premium. You asked for "good aesthetic design"; this is the look.

### 5.1 Design language

- **Concept:** _"Athletic minimalism."_ Crafted cards, generous negative space, purposeful motion. Keep the stone/emerald palette but make it richer and more intentional.
- **Color tokens** (Tailwind theme extension):
  - Neutrals: `stone.950` base, `stone.900` surface, `stone.800` raised, `stone.100` text-high, `stone.400` text-mid.
  - Accent: `emerald.500` primary, `emerald.300` highlight, plus `amber.400` for PRs/records, `rose.500` for warnings/deload flags.
  - Gradients for hero cards: `from-emerald-500/10 via-stone-900 to-stone-950`.
- **Type:** `Inter Tight` for display, `Inter` for body, `JetBrains Mono` for numbers (adds athletic "dashboard" feel).
- **Motion:** use the existing `motion` package. Standardize enter (0.25s ease-out), list stagger (60ms), page (0.35s), and micro-interaction (120ms). No motion on data-critical elements during updates.
- **Spacing grid:** 4pt base; never use raw `px-2` — always tokens (`space-card`, `space-section`).

### 5.2 Component library

- Extract a `src/app/components/primitives/` layer on top of Radix with our tokens (Card, Section, Stat, MetricRing, Sparkline, TabBar).
- New `MetricRing` (SVG ring gauge) for calorie and volume targets.
- New `StatCard` variants: `default`, `trend` (with sparkline), `goal` (with ring).
- `AppShell` owns navigation + header; pages become pure content.

### 5.3 New / redesigned screens

- **Landing page** at `/` (new marketing route) — hero, three feature pillars, AI trainer demo GIF, screenshots, CTA. Separate from the authed app.
- **Onboarding** — three-step wizard, per-step illustration, progress pill, back/next with motion.
- **Dashboard** — top band with today's ring (calories vs target), center with "Next workout" card (AI suggestion), "Week at a glance" calendar heatmap, recent achievements, AI insights stream.
- **Workout logger** — sticky exercise header, auto-advance rest timer, weight/reps steppers sized for thumbs, set-history chip under each input.
- **Nutrition** — segmented macro ring, quick-log chips (water, coffee, snack), "Meal plan" tab from agent (Phase 3).
- **Progress** — proper time-range picker, toggle between volume/PR/weight, correlation card ("your bench went up when your sleep went up").
- **AI trainer** — redesign the chat to feel like a trainer conversation: avatar + timeline, inline "action cards" when the agent performs a tool call (e.g., "Logged 5 sets of squats").

### 5.4 Accessibility + responsiveness

- Contrast audit (all text ≥ WCAG AA on its surface).
- Keyboard navigable logger (number inputs, arrow keys, enter-to-advance).
- Mobile-first; ensure existing bottom nav works for new screens.

### 5.5 Exit criteria

- Lighthouse ≥ 90 on landing and dashboard.
- Visual regression screenshots committed (Playwright).
- Story-like preview page (`src/app/dev/StyleGuide.tsx`, dev-only route) for design tokens.

---

## 6. Phase 2 — ML Platform (`feat/ml-platform`)

**Goal:** ship a real, end-to-end ML workflow — the "Area 1 + 2" project from the post.

### 6.1 Models (4 of them, all small and explainable)

1. **1RM Estimator** — predicts 1-rep max from recent set history per lift. Baseline: Epley/Brzycki formulas. Upgrade: gradient-boosted regressor on `(weight, reps, RPE, exercise_id, user_features)` with per-user calibration. Output: estimated 1RM + confidence band.
2. **Plateau Detector** — binary classifier ("plateauing on lift X"). Features: rolling slope of estimated 1RM, volume trend, rep-scheme variance, rest patterns. Output: flag + suggested intervention (deload / vary rep range / accessory focus).
3. **Volume Recommender** — regression for next-session volume per muscle group, constrained by recovery features (sleep if we have it, days since last session, RPE).
4. **Churn (drop-off) Predictor** — probability user stops logging in next 14 days. Classifier on logging cadence, streak, goal progress, days since last session.

### 6.2 Pipeline

- New `ml/` directory (Python) — not shipped to the browser bundle:
  - `ml/data/` — raw → bronze → silver → gold (parquet) using DuckDB locally, with a Supabase pull script as the ingestion step.
  - `ml/features/` — feature engineering with explicit contracts (pydantic schemas per feature view). A lightweight "feature store" pattern using Parquet + DuckDB; no heavy Feast dependency unless you want it.
  - `ml/training/` — scripts per model (`train_1rm.py`, etc.) using scikit-learn + XGBoost/LightGBM. All runs logged to **MLflow** (local `mlruns/` for dev, S3-backed or Supabase-backed for "prod").
  - `ml/evaluation/` — per-model eval scripts, fairness-ish checks (does performance vary by activity level or starting weight bucket?), and a golden-dataset regression harness.
  - `ml/registry/` — thin wrapper around MLflow Model Registry with stage transitions (Staging/Production).

### 6.3 Serving

- `services/predict/` — **FastAPI** microservice with one endpoint per model under `/predict/{model}`. Pydantic request/response. Health, readiness, version endpoints.
- Dockerfile + `docker-compose.yml` that spins up: FastAPI predict service + MLflow server + Redis (for feature cache).
- Frontend talks to predict service through a Supabase Edge Function proxy so we don't expose the service directly.

### 6.4 Frontend integrations

- **Dashboard:** "Estimated bench 1RM: 102.5 kg · next PR likely in 11 days" card.
- **Workout logger:** inline plateau badge per exercise + recommended next set (from volume recommender).
- **Progress:** a "Projected PR" chart overlay.
- **Admin (dev-only):** model health widget showing last eval metrics + current stage.

### 6.5 Exit criteria

- `make train-all` trains all 4 models against a sample dataset bundled in repo.
- `docker compose up` → predict service healthy, MLflow UI reachable on localhost.
- Each model has an eval report checked in (`ml/evaluation/reports/*.md`).
- Frontend renders predictions from the real service.

---

## 7. Phase 3 — RAG + Agentic Trainer (`feat/rag-agent-trainer`)

**Goal:** replace the `if/else` trainer with a real RAG-grounded, tool-using agent.

### 7.1 Knowledge base

- Curate ~200 authoritative sources across lifting, programming, nutrition, recovery (e.g., open-access textbooks, ACSM guidelines summaries, published hypertrophy literature summaries; respect licensing). Ship metadata + short excerpts in repo; fetch full texts at ingest time.
- Chunking: 300–500 tokens with 15% overlap, semantic splitting on headings.
- Dual retrieval: BM25 (via `rank_bm25` or `opensearch`) + dense embeddings (`text-embedding-3-small` or a small open model via `sentence-transformers`).
- Vector DB: **Qdrant** in Docker locally (also works hosted). Metadata filters for source, muscle group, experience level.

### 7.2 Agent

- Orchestrator: **LangGraph** or **Claude Agent SDK** — I recommend Claude Agent SDK since your environment already has strong Claude tooling. State machine: `interpret → retrieve → plan → act → summarize`.
- Tools the agent can call (implemented as server endpoints, each with strict schemas):
  1. `search_knowledge(query, filters)` — RAG retriever.
  2. `get_user_context(user_id)` — profile, recent workouts, goals, recent PRs.
  3. `log_workout(user_id, exercises[])` — writes to Supabase.
  4. `create_routine(user_id, routine)` — persistent routine.
  5. `suggest_meal_plan(user_id, constraints)` — returns meals using macro targets.
  6. `set_goal(user_id, goal)` — updates profile goals.
  7. `call_ml_model(model, payload)` — queries the Phase 2 predict service.
- Every user-visible agent response carries grounded **citations** (source title + quote hash) and an "actions taken" footer.
- Safety: injury-risk refusals (hard ceilings, "consult a doctor" for red flags), tool-call sandbox ("actions require user confirm" toggle).

### 7.3 Evaluation

- Golden test set (`eval/rag_agent/golden.jsonl`): 100 questions x expected behavior (retrieval hits, correct tool used, correct final answer category).
- Per-component metrics: retrieval Recall@k / MRR; tool-use precision; response faithfulness (LLM-as-judge with a rubric).
- Automated eval job runs on every PR touching `agent/`.

### 7.4 Frontend

- AITrainerChat becomes an _agent view_: streaming tokens, inline citation chips, action cards, "Confirm action" prompts when the agent wants to write.

### 7.5 Exit criteria

- Agent answers 90%+ of a held-out fitness question set correctly (per rubric).
- Retrieval Recall@10 ≥ 0.8 on golden set.
- Every write action confirmed by user before persistence.

---

## 8. Phase 4 — Computer Vision Form Checker (`feat/cv-form-checker`)

**Goal:** live form analysis for squat, bench, deadlift.

### 8.1 Approach

- **Client-side (default):** MediaPipe Pose (via `@mediapipe/tasks-vision` WASM) — runs entirely in-browser via webcam, no video leaves the device. Excellent fit for privacy + cost.
- **Server-side (optional):** upload a short clip; backend runs a heavier model (MoveNet Thunder or a fine-tuned MMPose model) for advanced biomechanics (joint angles over time, bar-path estimation).

### 8.2 Form rules (per lift)

Per-lift rule engine over pose keypoints:

- **Squat:** knee valgus detection (hip-knee-ankle angle), depth (hip below knee crease), bar path (approximated from shoulder keypoint), torso angle variance.
- **Bench:** elbow flare (elbow-torso angle), bar path (wrist trajectory), scapular retraction proxy.
- **Deadlift:** lumbar rounding (hip-shoulder-head line curvature), hip rise vs shoulder rise timing, bar distance from shins.

### 8.3 UI

- New screen: **Form Check** under the workout tab.
- Live overlay: skeleton + color-coded joints (green/amber/red), textual cues ("knees caving — push out").
- Post-set summary: rep-by-rep breakdown, worst cue, one suggested drill (comes from the RAG agent if Phase 3 is merged).
- Record-and-review mode with frame scrubber.

### 8.4 Exit criteria

- 30+ FPS on a mid-range laptop, 15+ FPS on mid-range mobile.
- Hand-labeled validation set of 50 clips; rule engine agrees with a human coach on 80%+ of form-flag calls.
- Feature gracefully degrades if webcam permission denied.

---

## 9. Phase 5 — MLOps & Observability (`feat/mlops-observability`)

**Goal:** prove this is production-grade, not a notebook.

### 9.1 CI/CD (expanded)

- `ci.yml` — lint, typecheck, test, build (already from Phase 0).
- `ml-ci.yml` — on changes under `ml/`: run training smoke test on tiny fixtures, run model eval, upload report artifact, post comment on PR.
- `agent-ci.yml` — on changes under `agent/`: run retrieval + generation eval set, fail if Recall@10 drops > 5% or faithfulness drops > 3pp from `main`.
- `deploy.yml` — build and push Docker images for `predict`, `agent`, and a vector-db seeder; deploy to Fly.io or Render (user's call).
- Every workflow uses reusable composite actions so `ml-ci` and `agent-ci` share setup.

### 9.2 Monitoring & drift

- **Evidently AI** for drift: daily job computes feature + prediction drift against a reference window; emits a JSON report committed to `ml/monitoring/` and/or pushed to a Slack webhook.
- **Prometheus + Grafana** (optional, for the portfolio): FastAPI exposes `/metrics`; Grafana dashboard shipped as JSON under `ops/grafana/`.
- Scheduled evaluation: GitHub Actions cron that reruns golden-set eval weekly, opens an issue if metrics regress.

### 9.3 Cost + trade-off documentation

- `docs/architecture/` with ADRs for each major decision (e.g., "why MediaPipe in browser vs server", "why Qdrant over pgvector").
- `docs/cost-model.md` — back-of-envelope cost per 1k trainer conversations, per 1k predictions, etc.
- Honest trade-off tables: self-hosted vs managed APIs.

### 9.4 Exit criteria

- CI badges in README, all green.
- Drift report exists for at least one model and renders from GitHub Pages.
- A `docs/runbook.md` with on-call steps (even if it's just you).

---

## 10. Repo / Branching / PR Strategy

- **Main branch:** protected — requires passing CI and 1 review.
- One phase = one feature branch = one PR.
- Each PR includes: description, migration notes, screenshots (for UI), an eval/metrics section (for ML), and a `--dry-run` story of how to verify locally.
- **I will not force-push or amend** except on your explicit request.
- Every PR bumps `CHANGELOG.md` under Keep-a-Changelog formatting.

Commit convention: **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`).

---

## 11. Proposed Directory Layout (post all phases)

```
forge-fitness/
├── src/app/                      # existing React app
│   ├── components/               # UI (refactored in Phase 1)
│   ├── components/primitives/    # new design-system layer (Phase 1)
│   ├── features/                 # agent-chat, form-check, progress (Phase 1/3/4)
│   ├── types/                    # shared TS types (Phase 0)
│   └── lib/                      # api clients, hooks
├── supabase/functions/           # edge functions (auth, proxy)
├── ml/                           # Phase 2
│   ├── data/                     # ETL + DuckDB pipelines
│   ├── features/
│   ├── training/
│   ├── evaluation/
│   └── monitoring/               # Phase 5
├── services/
│   ├── predict/                  # FastAPI model service (Phase 2)
│   └── agent/                    # agent + RAG (Phase 3)
├── agent/                        # optional co-located agent code
├── eval/                         # golden datasets, eval harness
├── docs/
│   ├── architecture/             # ADRs
│   ├── runbook.md
│   └── cost-model.md
├── ops/
│   ├── docker-compose.yml
│   └── grafana/
└── .github/workflows/
```

---

## 12. Open Questions I Need You to Answer

Answer these and I kick off Phase 0 immediately.

1. **Auth migration** — OK to migrate from the custom password store to Supabase Auth and drop the custom signup/login? (Strongly recommended.)
2. **LLM provider for the agent** — Claude (via Claude Agent SDK) or OpenAI or both with a router? I recommend **Claude + an OpenAI fallback** since your existing code already has OpenAI scaffolding.
3. **Hosting targets** — Vercel/Netlify for the frontend is fine; for the predict + agent services, do you want **Fly.io**, **Render**, or **self-hosted on a cheap VPS**?
4. **Vector DB** — **Qdrant** in Docker (default) or **Supabase pgvector** (cheaper, fewer moving parts)? I'd lean Qdrant for the portfolio story, pgvector if you want to minimize infra.
5. **Training data** — for real model quality we need either (a) **seed data** we generate (synthetic users + realistic logs), or (b) a public dataset. Recommend shipping a synthetic-data generator plus a small public dataset (e.g., OpenPowerlifting anonymized subset) so training is reproducible.
6. **"Your Name"** — the README currently says `[Your Name]` — use **Anuroop Jajoba** or something else?
7. **License** — keep MIT?
8. **Existing Supabase keys in repo** — do you want me to rotate them as part of Phase 0? If yes, you'll need to regenerate them in the Supabase dashboard.
9. **Skip or include Phase 5 drift monitoring?** It's the most infra-heavy phase; some people prefer to stop after 4.

---

## 13. What Happens After Approval

Once you approve this plan (and answer the open questions), I will:

1. Create branch `fix/security-and-foundation` from `main`.
2. Implement Phase 0 in roughly this order: security → hygiene → CI → tests → merge-ready.
3. Push the branch and open a PR with the full summary, screenshots, and a `Test plan` checklist.
4. **Stop** and wait for your review.
5. Repeat for Phases 1–5 one at a time, each behind its own PR.

No surprises, no big-bang merges. You see each change, review it on GitHub, and give the go-ahead before the next phase starts.

---

**Next step:** reply with approval + answers to the open questions in §12, and I'll start Phase 0.
