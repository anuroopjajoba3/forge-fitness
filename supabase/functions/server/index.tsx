/**
 * Forge Edge Function — Hono server backing all protected REST endpoints.
 *
 * Security model (Phase 0 hardening):
 *   - All protected routes require a verified Supabase JWT.
 *   - `userId` is ALWAYS derived from the verified token, never from the
 *     request body or URL params. Clients cannot impersonate other users.
 *   - CORS is restricted to the configured ALLOWED_ORIGINS list.
 *   - No custom password auth. Signup/login goes through Supabase Auth on
 *     the client; this server only handles authenticated data operations.
 */
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

/**
 * Comma-separated list of allowed origins. Set via:
 *   supabase secrets set ALLOWED_ORIGINS="https://forge.example.com,http://localhost:5173"
 */
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  '/*',
  cors({
    origin: (origin) => {
      if (!origin) return '';
      if (ALLOWED_ORIGINS.includes('*')) return origin;
      return ALLOWED_ORIGINS.includes(origin) ? origin : '';
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

// ---------------------------------------------------------------------------
// Auth middleware — verifies JWT and injects { userId, email }
// ---------------------------------------------------------------------------
const ROUTE_PREFIX = '/make-server-56c079d7';

app.use(`${ROUTE_PREFIX}/*`, async (c, next) => {
  // Open endpoints that don't need an authenticated user
  const openPaths = [`${ROUTE_PREFIX}/health`];
  if (openPaths.includes(new URL(c.req.url).pathname)) {
    return next();
  }

  const authHeader = c.req.header('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token || token === SUPABASE_ANON_KEY) {
    return c.json({ success: false, error: 'Unauthorized: missing user token' }, 401);
  }

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) {
    return c.json({ success: false, error: 'Unauthorized: invalid token' }, 401);
  }

  c.set('userId', data.user.id);
  c.set('email', data.user.email ?? null);
  await next();
});

function getAuth(c: { get: (k: string) => string | null }): { userId: string; email: string | null } {
  const userId = c.get('userId');
  if (!userId) throw new Error('auth middleware missing');
  return { userId, email: c.get('email') };
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
app.get(`${ROUTE_PREFIX}/health`, (c) => c.json({ status: 'ok' }));

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
app.post(`${ROUTE_PREFIX}/profile`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const body = await c.req.json();
    const profile = { ...body, userId }; // ignore any userId in body
    await kv.set(`profile:${userId}`, profile);
    return c.json({ success: true });
  } catch (err) {
    console.log('Error saving profile:', err);
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

app.get(`${ROUTE_PREFIX}/profile`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const profile = await kv.get(`profile:${userId}`);
    return c.json({ success: true, profile });
  } catch (err) {
    console.log('Error getting profile:', err);
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// Legacy path kept for a brief migration window — ignores URL userId
app.get(`${ROUTE_PREFIX}/profile/:userId`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const profile = await kv.get(`profile:${userId}`);
    return c.json({ success: true, profile });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// ---------------------------------------------------------------------------
// Workouts
// ---------------------------------------------------------------------------
app.post(`${ROUTE_PREFIX}/workouts`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const workout = await c.req.json();
    const workoutId = String(workout.id ?? Date.now());
    await kv.set(`workout:${userId}:${workoutId}`, { ...workout, userId, id: workoutId });
    return c.json({ success: true, id: workoutId });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

app.get(`${ROUTE_PREFIX}/workouts/:userId?`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const workouts = await kv.getByPrefix(`workout:${userId}:`);
    return c.json({ success: true, workouts });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// ---------------------------------------------------------------------------
// Food logs
// ---------------------------------------------------------------------------
app.post(`${ROUTE_PREFIX}/food-logs`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const log = await c.req.json();
    const logId = String(log.id ?? Date.now());
    await kv.set(`foodlog:${userId}:${logId}`, { ...log, userId, id: logId });
    return c.json({ success: true, id: logId });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

app.get(`${ROUTE_PREFIX}/food-logs/:userId?`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const foodLogs = await kv.getByPrefix(`foodlog:${userId}:`);
    return c.json({ success: true, foodLogs });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// ---------------------------------------------------------------------------
// Food analysis (stub — real integration in Phase 3)
// ---------------------------------------------------------------------------
app.post(`${ROUTE_PREFIX}/analyze-food`, async (c) => {
  try {
    getAuth(c); // require auth
    await c.req.json(); // drain body
    // TODO(phase-3): integrate real food-recognition API.
    return c.json({
      success: true,
      data: {
        foodName: 'Grilled Chicken Salad',
        calories: 350,
        protein: 32,
        carbs: 25,
        fat: 12,
        fiber: 6,
        sugar: 4,
        sodium: 450,
        servingSize: '1 bowl (300g)',
      },
    });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------
interface WorkoutRecord {
  date?: string;
  totalVolume?: number;
}

app.post(`${ROUTE_PREFIX}/progress`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const progress = await c.req.json();
    const date = String(progress.date ?? new Date().toISOString().split('T')[0]);
    await kv.set(`progress:${userId}:${date}`, { ...progress, userId, date });
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

app.get(`${ROUTE_PREFIX}/progress/:userId?`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const progressData = await kv.getByPrefix(`progress:${userId}:`);
    const workouts = (await kv.getByPrefix(`workout:${userId}:`)) as WorkoutRecord[];
    const weightData = await kv.getByPrefix(`weight:${userId}:`);

    return c.json({
      success: true,
      progress: progressData,
      weightHistory: weightData,
      volumeHistory: workouts.map((w) => ({
        date: w.date ?? '',
        volume: w.totalVolume ?? 0,
      })),
      workoutHistory: workouts,
    });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
app.get(`${ROUTE_PREFIX}/stats/:_userId/:date`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const date = c.req.param('date');
    const stats = await kv.get(`stats:${userId}:${date}`);
    return c.json({
      success: true,
      stats: stats ?? {
        workouts: 0,
        duration: 0,
        caloriesBurned: 0,
        volumeLifted: 0,
        waterIntake: 0,
        steps: 0,
      },
    });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// ---------------------------------------------------------------------------
// Meals
// ---------------------------------------------------------------------------
interface MealRecord {
  date?: string;
}

app.post(`${ROUTE_PREFIX}/meals`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const meal = await c.req.json();
    const mealId = String(meal.id ?? Date.now());
    await kv.set(`meal:${userId}:${mealId}`, { ...meal, userId, id: mealId });
    return c.json({ success: true, id: mealId });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

app.get(`${ROUTE_PREFIX}/meals/:_userId/:date`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const date = c.req.param('date');
    const meals = (await kv.getByPrefix(`meal:${userId}:`)) as MealRecord[];
    const filtered = meals.filter((m) => m.date && m.date.startsWith(date));
    return c.json({ success: true, meals: filtered });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// ---------------------------------------------------------------------------
// Water
// ---------------------------------------------------------------------------
app.post(`${ROUTE_PREFIX}/water`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const { amount, date: rawDate } = await c.req.json();
    const date = new Date(rawDate ?? Date.now()).toISOString().split('T')[0] ?? '';
    await kv.set(`water:${userId}:${date}`, { amount: Number(amount) || 0, date });
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

app.get(`${ROUTE_PREFIX}/water/:_userId/:date`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const date = c.req.param('date');
    const data = (await kv.get(`water:${userId}:${date}`)) as { amount?: number } | null;
    return c.json({ success: true, amount: data?.amount ?? 0 });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// ---------------------------------------------------------------------------
// Routines
// ---------------------------------------------------------------------------
app.post(`${ROUTE_PREFIX}/routines`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const routine = await c.req.json();
    const routineId = String(routine.id ?? Date.now());
    await kv.set(`routine:${userId}:${routineId}`, { ...routine, userId, id: routineId });
    return c.json({ success: true, id: routineId });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

app.get(`${ROUTE_PREFIX}/routines/:userId?`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const routines = await kv.getByPrefix(`routine:${userId}:`);
    return c.json({ success: true, routines });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// Fixed: previously ignored userId and never deleted anything. Now scoped to
// the authenticated user so a user can only delete their own routines.
app.delete(`${ROUTE_PREFIX}/routines/:routineId`, async (c) => {
  try {
    const { userId } = getAuth(c);
    const routineId = c.req.param('routineId');
    const key = `routine:${userId}:${routineId}`;
    const existing = await kv.get(key);
    if (!existing) {
      return c.json({ success: false, error: 'Routine not found' }, 404);
    }
    await kv.del(key);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// ---------------------------------------------------------------------------
// AI Trainer — thin LLM proxy. Phase 3 replaces this with a real agent.
// ---------------------------------------------------------------------------
interface UserProfileShape {
  goal?: string;
  weight?: number;
  activityLevel?: string;
  age?: number;
  gender?: string;
}

app.post(`${ROUTE_PREFIX}/ai-trainer`, async (c) => {
  try {
    getAuth(c);
    const { message, userProfile } = (await c.req.json()) as {
      message: string;
      userProfile: UserProfileShape;
    };
    const grokApiKey = Deno.env.get('GROK_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    const systemPrompt = `You are an expert fitness trainer and nutritionist. The user has the following profile:
- Goal: ${userProfile.goal ?? 'General Fitness'}
- Weight: ${userProfile.weight ?? 'Unknown'}kg
- Activity Level: ${userProfile.activityLevel ?? 'Moderate'}
- Age: ${userProfile.age ?? 'Unknown'}
- Gender: ${userProfile.gender ?? 'Unknown'}

Provide personalized, accurate, and helpful fitness advice. Be encouraging and professional. Keep responses concise but informative (max 300 words).`;

    const tryChat = async (
      url: string,
      apiKey: string,
      model: string,
    ): Promise<{ response: string; source: string } | null> => {
      try {
        const r = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message },
            ],
            model,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });
        if (!r.ok) return null;
        const data = await r.json();
        const content = data?.choices?.[0]?.message?.content;
        return content ? { response: content, source: model } : null;
      } catch {
        return null;
      }
    };

    if (grokApiKey) {
      const result = await tryChat('https://api.x.ai/v1/chat/completions', grokApiKey, 'grok-beta');
      if (result) return c.json({ success: true, ...result });
    }
    if (openaiApiKey) {
      const result = await tryChat('https://api.openai.com/v1/chat/completions', openaiApiKey, 'gpt-3.5-turbo');
      if (result) return c.json({ success: true, ...result });
    }

    return c.json({
      success: true,
      response: getFallbackResponse(message, userProfile),
      source: 'Fallback',
    });
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

/** Legacy rule-based fallback. Preserved; Phase 3 replaces it with a real agent. */
function getFallbackResponse(query: string, profile: UserProfileShape): string {
  const weight = profile.weight ?? 75;
  const q = query.toLowerCase();

  if (q.includes('bench')) {
    return `For improving bench press:\n\n1. Form: retract shoulder blades, slight arch, feet flat\n2. Programming: 3-4 sets of 6-12 reps\n3. Progression: add 2.5-5kg when you can complete all sets\n4. Accessories: incline press, dips, tricep work`;
  }
  if (q.includes('squat')) {
    return `Squat technique:\n\n1. Feet shoulder-width, toes slightly out\n2. Break at hips and knees together\n3. Descend until thighs parallel\n4. Drive through heels\n5. Keep chest up, core braced`;
  }
  if (q.includes('deadlift')) {
    return `Deadlift form:\n\n1. Bar over mid-foot\n2. Hip-width stance\n3. Neutral spine (don't round!)\n4. Drive through heels\n5. Lock out at top\n\nStart light, perfect form first.`;
  }
  return `Hi! I'll help you with: "${query}".\n\nQuick tips:\n- Progressive overload weekly\n- Protein: ${Math.round(weight * 2)}g/day\n- Sleep 7-9 hours\n- Train consistently`;
}

Deno.serve(app.fetch);
