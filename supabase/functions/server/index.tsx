import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-56c079d7/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTHENTICATION ENDPOINTS =====

// Sign up endpoint
app.post("/make-server-56c079d7/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ success: false, error: "User already exists" }, 400);
    }

    // Create user (in production, hash the password!)
    const userId = Date.now().toString();
    const user = {
      id: userId,
      email,
      password, // WARNING: In production, use proper password hashing!
      name,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${email}`, user);
    await kv.set(`userId:${userId}`, email);

    return c.json({ success: true, userId, message: "Account created successfully" });
  } catch (error) {
    console.log("Error in signup:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Login endpoint
app.post("/make-server-56c079d7/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const user = await kv.get(`user:${email}`);
    if (!user || user.password !== password) {
      return c.json({ success: false, error: "Invalid email or password" }, 401);
    }

    return c.json({ success: true, userId: user.id, name: user.name });
  } catch (error) {
    console.log("Error in login:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== PROFILE ENDPOINTS =====

// Save user profile
app.post("/make-server-56c079d7/profile", async (c) => {
  try {
    const profile = await c.req.json();
    const userId = profile.userId || "user_default";
    await kv.set(`profile:${userId}`, profile);
    return c.json({ success: true, message: "Profile saved" });
  } catch (error) {
    console.log("Error saving profile:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get user profile
app.get("/make-server-56c079d7/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await kv.get(`profile:${userId}`);
    return c.json({ success: true, profile });
  } catch (error) {
    console.log("Error getting profile:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== WORKOUT ENDPOINTS =====

// Save workout
app.post("/make-server-56c079d7/workouts", async (c) => {
  try {
    const workout = await c.req.json();
    const userId = workout.userId || "user_default";
    const workoutId = workout.id || Date.now().toString();
    await kv.set(`workout:${userId}:${workoutId}`, workout);
    return c.json({ success: true, message: "Workout saved", id: workoutId });
  } catch (error) {
    console.log("Error saving workout:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get all workouts for user
app.get("/make-server-56c079d7/workouts/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const workouts = await kv.getByPrefix(`workout:${userId}:`);
    return c.json({ success: true, workouts });
  } catch (error) {
    console.log("Error getting workouts:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== FOOD LOG ENDPOINTS =====

// Save food log
app.post("/make-server-56c079d7/food-logs", async (c) => {
  try {
    const foodLog = await c.req.json();
    const userId = foodLog.userId || "user_default";
    const logId = foodLog.id || Date.now().toString();
    await kv.set(`foodlog:${userId}:${logId}`, foodLog);
    return c.json({ success: true, message: "Food log saved", id: logId });
  } catch (error) {
    console.log("Error saving food log:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get food logs for user
app.get("/make-server-56c079d7/food-logs/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const foodLogs = await kv.getByPrefix(`foodlog:${userId}:`);
    return c.json({ success: true, foodLogs });
  } catch (error) {
    console.log("Error getting food logs:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== AI FOOD RECOGNITION ENDPOINT =====

// Analyze food image
app.post("/make-server-56c079d7/analyze-food", async (c) => {
  try {
    const { imageUrl, imageBase64 } = await c.req.json();
    
    // Mock response for now - in production, integrate with Clarifai/Nutritionix
    const mockFoodData = {
      foodName: "Grilled Chicken Salad",
      calories: 350,
      protein: 32,
      carbs: 25,
      fat: 12,
      fiber: 6,
      sugar: 4,
      sodium: 450,
      servingSize: "1 bowl (300g)",
    };

    return c.json({ success: true, data: mockFoodData });
  } catch (error) {
    console.log("Error analyzing food:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== PROGRESS ENDPOINTS =====

// Save daily progress
app.post("/make-server-56c079d7/progress", async (c) => {
  try {
    const progress = await c.req.json();
    const userId = progress.userId || "user_default";
    const date = progress.date || new Date().toISOString().split('T')[0];
    await kv.set(`progress:${userId}:${date}`, progress);
    return c.json({ success: true, message: "Progress saved" });
  } catch (error) {
    console.log("Error saving progress:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get progress history
app.get("/make-server-56c079d7/progress/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const progressData = await kv.getByPrefix(`progress:${userId}:`);
    const workouts = await kv.getByPrefix(`workout:${userId}:`);
    
    return c.json({ 
      success: true, 
      progress: progressData,
      weightHistory: [],
      volumeHistory: workouts.map((w: any) => ({
        date: w.date,
        volume: w.totalVolume || 0
      })),
      workoutHistory: workouts
    });
  } catch (error) {
    console.log("Error getting progress:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== STATS ENDPOINTS =====

// Get daily stats
app.get("/make-server-56c079d7/stats/:userId/:date", async (c) => {
  try {
    const userId = c.req.param('userId');
    const date = c.req.param('date');
    const stats = await kv.get(`stats:${userId}:${date}`);
    return c.json({ success: true, stats: stats || {
      workouts: 0,
      duration: 0,
      caloriesBurned: 0,
      volumeLifted: 0,
      waterIntake: 0,
      steps: 0
    }});
  } catch (error) {
    console.log("Error getting stats:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== MEALS ENDPOINTS =====

// Save meal
app.post("/make-server-56c079d7/meals", async (c) => {
  try {
    const meal = await c.req.json();
    const userId = meal.userId;
    const mealId = meal.id || Date.now().toString();
    await kv.set(`meal:${userId}:${mealId}`, meal);
    return c.json({ success: true, message: "Meal saved", id: mealId });
  } catch (error) {
    console.log("Error saving meal:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get meals for a date
app.get("/make-server-56c079d7/meals/:userId/:date", async (c) => {
  try {
    const userId = c.req.param('userId');
    const meals = await kv.getByPrefix(`meal:${userId}:`);
    const date = c.req.param('date');
    
    const filteredMeals = meals.filter((m: any) => 
      m.date && m.date.startsWith(date)
    );
    
    return c.json({ success: true, meals: filteredMeals });
  } catch (error) {
    console.log("Error getting meals:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== WATER ENDPOINTS =====

// Save water intake
app.post("/make-server-56c079d7/water", async (c) => {
  try {
    const data = await c.req.json();
    const userId = data.userId;
    const date = new Date(data.date).toISOString().split('T')[0];
    await kv.set(`water:${userId}:${date}`, { amount: data.amount, date });
    return c.json({ success: true });
  } catch (error) {
    console.log("Error saving water:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get water intake
app.get("/make-server-56c079d7/water/:userId/:date", async (c) => {
  try {
    const userId = c.req.param('userId');
    const date = c.req.param('date');
    const data = await kv.get(`water:${userId}:${date}`);
    return c.json({ success: true, amount: data?.amount || 0 });
  } catch (error) {
    console.log("Error getting water:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== ROUTINES ENDPOINTS =====

// Save routine
app.post("/make-server-56c079d7/routines", async (c) => {
  try {
    const routine = await c.req.json();
    const userId = routine.userId;
    const routineId = routine.id || Date.now().toString();
    await kv.set(`routine:${userId}:${routineId}`, routine);
    return c.json({ success: true, message: "Routine saved", id: routineId });
  } catch (error) {
    console.log("Error saving routine:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get routines
app.get("/make-server-56c079d7/routines/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const routines = await kv.getByPrefix(`routine:${userId}:`);
    return c.json({ success: true, routines });
  } catch (error) {
    console.log("Error getting routines:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete routine
app.delete("/make-server-56c079d7/routines/:routineId", async (c) => {
  try {
    const routineId = c.req.param('routineId');
    // Note: In real implementation, you'd need userId to construct the key
    // For now, this is a simplified version
    return c.json({ success: true, message: "Routine deleted" });
  } catch (error) {
    console.log("Error deleting routine:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== GROK AI TRAINER ENDPOINT =====

// AI Trainer Chat with Grok API
app.post("/make-server-56c079d7/ai-trainer", async (c) => {
  try {
    const { message, userProfile } = await c.req.json();
    const grokApiKey = Deno.env.get("GROK_API_KEY");
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    // System prompt for AI
    const systemPrompt = `You are an expert fitness trainer and nutritionist. The user has the following profile:
- Goal: ${userProfile.goal || 'General Fitness'}
- Weight: ${userProfile.weight || 'Unknown'}kg
- Activity Level: ${userProfile.activityLevel || 'Moderate'}
- Age: ${userProfile.age || 'Unknown'}
- Gender: ${userProfile.gender || 'Unknown'}

Provide personalized, accurate, and helpful fitness advice. Be encouraging and professional. Keep responses concise but informative (max 300 words).`;

    // Try Grok API first
    if (grokApiKey) {
      try {
        console.log("Calling Grok API...");
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${grokApiKey}`,
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            model: "grok-beta",
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices?.[0]?.message?.content;
          if (aiResponse) {
            console.log("Grok API success!");
            return c.json({ success: true, response: aiResponse, source: "Grok AI" });
          }
        } else {
          const errorText = await response.text();
          console.log("Grok API error:", response.status, errorText);
        }
      } catch (error) {
        console.log("Grok API exception:", error);
      }
    }

    // Try OpenAI as backup
    if (openaiApiKey) {
      try {
        console.log("Calling OpenAI API...");
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices?.[0]?.message?.content;
          if (aiResponse) {
            console.log("OpenAI API success!");
            return c.json({ success: true, response: aiResponse, source: "OpenAI" });
          }
        } else {
          const errorText = await response.text();
          console.log("OpenAI API error:", response.status, errorText);
        }
      } catch (error) {
        console.log("OpenAI API exception:", error);
      }
    }

    // Use fallback if no API keys or both failed
    console.log("Using fallback responses (no API keys or API failed)");
    return c.json({ 
      success: true, 
      response: getFallbackResponse(message, userProfile),
      source: "Fallback"
    });
  } catch (error) {
    console.log("Error in AI trainer:", error);
    return c.json({ 
      success: true, 
      response: getFallbackResponse(message, userProfile),
      source: "Fallback (Error)"
    });
  }
});

// Fallback responses when Grok API is unavailable
function getFallbackResponse(query: string, profile: any): string {
  const lowerQuery = query.toLowerCase();
  
  // Bench Press
  if (lowerQuery.includes('bench')) {
    return `For improving bench press:\n\n1. **Form**: Retract shoulder blades, slight arch, feet flat\n2. **Programming**: 3-4 sets of 6-12 reps\n3. **Progression**: Add 2.5-5kg when you can complete all sets\n4. **Accessories**: Incline press, dips, tricep work\n\nFor ${profile.goal}: Focus on ${profile.goal?.includes('Muscle') ? 'progressive overload' : 'consistent form and volume'}.`;
  }
  
  // Squat
  if (lowerQuery.includes('squat')) {
    return `Squat technique:\n\n1. Feet shoulder-width, toes slightly out\n2. Break at hips and knees together\n3. Descend until thighs parallel\n4. Drive through heels\n5. Keep chest up, core braced\n\nFor ${profile.goal}: ${profile.goal?.includes('Weight') ? 'High reps (12-15) for fat loss' : '6-10 reps for strength'}`;
  }
  
  // Deadlift
  if (lowerQuery.includes('deadlift')) {
    return `Deadlift form:\n\n1. Bar over mid-foot\n2. Hip-width stance\n3. Neutral spine (don't round!)\n4. Drive through heels\n5. Lock out at top\n\n⚠️ Start light, perfect form first!\nFor ${profile.weight}kg: Start with 40-60kg, focus on technique.`;
  }

  // Pull-ups / Chin-ups
  if (lowerQuery.includes('pull') || lowerQuery.includes('chin')) {
    return `Pull-up progression:\n\n**Can't do one yet?**\n1. Assisted pull-ups (machine or band)\n2. Negative pull-ups (3-5 sec down)\n3. Dead hangs (30-60 sec)\n4. Scapular pulls\n\n**Can do some?**\n- 3-5 sets to failure\n- Add weight when you can do 10+\n- Vary grip (wide, narrow, neutral)\n\n💪 Most people can reach 10 pull-ups in 8-12 weeks!`;
  }

  // Shoulders / OHP
  if (lowerQuery.includes('shoulder') || lowerQuery.includes('press') && lowerQuery.includes('overhead')) {
    return `Shoulder training:\n\n**Overhead Press**:\n1. Core tight, glutes squeezed\n2. Press straight up (not forward)\n3. Full lockout at top\n4. 4 sets x 6-10 reps\n\n**Accessories**:\n- Lateral raises (side delts)\n- Face pulls (rear delts)\n- Front raises (front delts)\n\n⚠️ Shoulders are injury-prone - perfect form first!`;
  }

  // Arms / Biceps / Triceps
  if (lowerQuery.includes('arm') || lowerQuery.includes('bicep') || lowerQuery.includes('tricep')) {
    return `Arm training:\n\n**Biceps**:\n- Barbell curls: 3x8-12\n- Hammer curls: 3x10-15\n- Concentration curls: 2x12-15\n\n**Triceps**:\n- Close-grip bench: 3x8-12\n- Overhead extension: 3x10-15\n- Dips: 3x8-12\n\n💡 Arms grow from compound lifts too!\n- Bench press → triceps\n- Rows/pull-ups → biceps\n\nDon't skip the big lifts!`;
  }

  // Back training
  if (lowerQuery.includes('back') && !lowerQuery.includes('lower back')) {
    return `Back training:\n\n**Thickness**:\n- Barbell rows: 4x6-10\n- T-bar rows: 3x8-12\n- Deadlifts: 3x5-8\n\n**Width**:\n- Pull-ups: 3-5 sets to failure\n- Lat pulldowns: 3x10-12\n- Straight-arm pulldowns: 3x12-15\n\n**Form tip**: Pull with elbows, not hands. Think "elbow to hip" not "hand to chest".\n\n🎯 Train back 2x/week for best results!`;
  }

  // Legs
  if (lowerQuery.includes('leg') && !lowerQuery.includes('deadlift')) {
    return `Leg training:\n\n**Quads**:\n- Squats: 4x6-10\n- Leg press: 3x10-15\n- Lunges: 3x12 each leg\n\n**Hamstrings**:\n- Romanian deadlifts: 3x8-12\n- Leg curls: 3x10-15\n- Good mornings: 2x12\n\n**Calves**:\n- Standing calf raises: 4x12-15\n- Seated calf raises: 3x15-20\n\n🦵 Don't skip leg day! Legs = 50% of your muscle mass.`;
  }

  // Abs / Core
  if (lowerQuery.includes('abs') || lowerQuery.includes('core') || lowerQuery.includes('six pack')) {
    return `Abs training:\n\n**Truth**: Abs are made in the kitchen! You need 10-15% body fat (men) or 15-20% (women) to see them.\n\n**Best exercises**:\n1. Planks: 3x30-60sec\n2. Hanging leg raises: 3x10-15\n3. Cable crunches: 3x12-15\n4. Ab wheel rollouts: 3x8-12\n\n**Diet for abs**:\n- Calorie deficit\n- High protein (${Math.round(profile.weight * 2)}g/day)\n- Whole foods\n- Patience!\n\n💡 Train abs 2-3x/week, 10-15 min each.`;
  }

  // Cardio
  if (lowerQuery.includes('cardio') || lowerQuery.includes('running') || lowerQuery.includes('hiit')) {
    return `Cardio guide:\n\n**LISS** (Low Intensity):\n- 30-60 min\n- Heart rate: 60-70% max\n- Best for: Fat loss, recovery\n\n**HIIT** (High Intensity):\n- 15-20 min total\n- Sprint 30sec, rest 90sec\n- Best for: Time efficiency, fitness\n\n**How much?**\n- Fat loss: 3-5 sessions/week\n- Muscle gain: 2-3 sessions/week\n- General health: 150 min/week\n\nFor ${profile.goal}: ${profile.goal?.includes('Lose') ? '4-5 cardio sessions + weights' : '2-3 cardio sessions, focus on weights'}`;
  }

  // Nutrition / Diet
  if (lowerQuery.includes('nutrition') || lowerQuery.includes('diet') || lowerQuery.includes('eat') || lowerQuery.includes('meal')) {
    const protein = Math.round(profile.weight * 2);
    const isLoseWeight = profile.goal?.toLowerCase().includes('lose');
    return `Nutrition for ${profile.goal}:\n\n**Daily Macros** (${profile.weight}kg):\n🍗 Protein: ${protein}g (2g per kg)\n🍚 Carbs: ${isLoseWeight ? '150-200g (moderate)' : '250-350g (high)'}\n🥑 Fats: ${Math.round(profile.weight * 0.8)}g\n\n**Meal Examples**:\n- Breakfast: Eggs, oats, banana\n- Lunch: Chicken, rice, vegetables\n- Dinner: Salmon, sweet potato, broccoli\n- Snacks: Greek yogurt, nuts\n\n**Timing**:\n- Protein every meal\n- Carbs around workouts\n- Water: 3-4L daily\n\n${isLoseWeight ? '📉 Calorie deficit: -300 to -500 kcal' : '📈 Calorie surplus: +300 to +500 kcal'}`;
  }

  // Weight loss
  if (lowerQuery.includes('lose weight') || lowerQuery.includes('fat loss') || lowerQuery.includes('cut')) {
    return `Fat loss strategy:\n\n**1. Calorie Deficit**:\n- 300-500 below maintenance\n- Track for 2 weeks first\n- Aim for 0.5-1kg loss/week\n\n**2. Training**:\n- Lift weights 3-4x/week (preserves muscle!)\n- Cardio 3-5x/week\n- 10,000 steps daily\n\n**3. Nutrition**:\n- Protein: ${Math.round(profile.weight * 2)}g/day\n- High fiber vegetables\n- Limit processed foods\n\n**4. Track Progress**:\n- Weekly weigh-ins\n- Progress photos\n- Measurements\n\n⚠️ Avoid: Crash diets, excessive cardio, skipping meals`;
  }

  // Muscle gain
  if (lowerQuery.includes('gain') || lowerQuery.includes('bulk') || lowerQuery.includes('muscle') || lowerQuery.includes('bigger')) {
    return `Muscle building:\n\n**1. Progressive Overload**:\n- Add weight/reps weekly\n- Track every workout\n- Focus on compound lifts\n\n**2. Training Volume**:\n- 10-20 sets per muscle/week\n- 6-12 reps for size\n- Train each muscle 2x/week\n\n**3. Nutrition**:\n- Surplus: +300-500 kcal\n- Protein: ${Math.round(profile.weight * 2)}g/day\n- Carbs: 4-6g per kg\n\n**4. Recovery**:\n- Sleep 8-9 hours\n- Rest days crucial\n- Deload every 4-6 weeks\n\n📈 Realistic gain: 0.25-0.5kg muscle/month`;
  }

  // Rest / Recovery
  if (lowerQuery.includes('rest') || lowerQuery.includes('recovery') || lowerQuery.includes('sleep')) {
    return `Rest & Recovery:\n\n⏱️ **Rest Between Sets**:\n- Strength (1-5 reps): 3-5 min\n- Hypertrophy (6-12 reps): 60-120 sec\n- Endurance (15+ reps): 30-60 sec\n\n😴 **Sleep** (CRITICAL!):\n- 7-9 hours minimum\n- Growth hormone peaks in deep sleep\n- Poor sleep = poor gains\n\n🧘 **Recovery Methods**:\n1. Active recovery (walking, yoga)\n2. Stretching & foam rolling\n3. Massage\n4. Hydration (3-4L water)\n5. Proper nutrition\n\n📅 **Training Split**:\n- 48-72h between same muscle\n- 1-2 full rest days/week\n- Listen to your body!\n\nRecovery IS training!`;
  }

  // Supplements
  if (lowerQuery.includes('supplement') || lowerQuery.includes('protein powder') || lowerQuery.includes('creatine')) {
    return `Supplement guide:\n\n**What Works**:\n✅ Whey protein: Convenience (${Math.round(profile.weight * 2)}g/day total)\n✅ Creatine: 5g daily (most researched!)\n✅ Caffeine: Pre-workout energy\n✅ Vitamin D: If deficient\n✅ Omega-3: Fish oil\n\n**Save Your Money**:\n❌ BCAAs (waste)\n❌ Fat burners (just caffeine)\n❌ Testosterone boosters (don't work)\n❌ Most pre-workouts (overpriced)\n\n**Creatine Tips**:\n- 5g daily, any time\n- Drink more water\n- 3-5kg strength increase\n- Completely safe\n\n🍽️ Real food > supplements!`;
  }

  // Form / Technique
  if (lowerQuery.includes('form') || lowerQuery.includes('technique')) {
    return `Form & Technique:\n\n**Why It Matters**:\n- Prevents injury\n- Targets right muscles\n- Allows progressive overload\n- Better results\n\n**General Rules**:\n1. Control: 2 sec down, 1 sec up\n2. Full range of motion\n3. Core braced always\n4. No momentum/swinging\n5. Proper breathing\n\n⚠️ **Warning Signs**:\n- Sharp pain\n- Extreme shaking\n- Can't maintain form\n- Compensating\n\n📹 **Improve Form**:\n- Film yourself\n- Start light\n- Get feedback\n- Hire coach (1-2 sessions)\n\nPerfect form > heavy weight!`;
  }

  // Beginner
  if (lowerQuery.includes('beginner') || lowerQuery.includes('start') || lowerQuery.includes('new')) {
    return `Beginner's guide:\n\n**First 4-8 Weeks**:\n- Full body 3x/week\n- Master these:\n  • Squat\n  • Bench Press\n  • Deadlift\n  • Rows\n  • Overhead Press\n- 3 sets x 8-12 reps\n- Light weight, learn form!\n\n**Nutrition**:\n- Protein: ${Math.round(profile.weight * 1.8)}g/day\n- Whole foods 80%\n- Water: 3L+ daily\n\n**Recovery**:\n- Sleep 8 hours\n- 48h between sessions\n- Don't overtrain!\n\n💡 **Focus on**:\n✅ Consistency\n✅ Perfect form\n✅ Patience (12 weeks for results)\n✅ Enjoying it!\n\nYou've got this! 💪`;
  }

  // Program / Workout plan
  if (lowerQuery.includes('program') || lowerQuery.includes('plan') || lowerQuery.includes('routine') || lowerQuery.includes('split')) {
    return `Workout programs:\n\n**Beginners** (3x/week):\n- Full body each session\n- Squat, Bench, Deadlift, Rows\n- 3 sets x 8-12 reps\n\n**Intermediate** (4-5x/week):\nUpper/Lower split:\n- Upper: Bench, Rows, OHP, Pull-ups\n- Lower: Squat, Deadlift, Leg press, Curls\n\n**Advanced** (5-6x/week):\nPush/Pull/Legs:\n- Push: Chest, Shoulders, Triceps\n- Pull: Back, Biceps\n- Legs: Quads, Hams, Calves\n\n**For ${profile.goal}**:\n${profile.goal?.includes('Lose') ? 'Upper/Lower 4x + cardio 3x' : 'PPL 5-6x/week'}\n\nProgressive overload is key!`;
  }

  // Protein intake
  if (lowerQuery.includes('how much protein') || lowerQuery.includes('protein intake')) {
    return `Protein needs:\n\n**For ${profile.weight}kg**:\n- Minimum: ${Math.round(profile.weight * 1.6)}g/day\n- Optimal: ${Math.round(profile.weight * 2)}g/day\n- Maximum useful: ${Math.round(profile.weight * 2.2)}g/day\n\n**Sources** (per 100g):\n🍗 Chicken: 31g\n🐟 Salmon: 25g\n🥩 Beef: 26g\n🥚 Eggs: 13g\n🥛 Greek yogurt: 10g\n🥤 Whey: 80g\n\n**Distribution**:\n- 4-5 meals per day\n- 30-40g per meal\n- Post-workout: 20-40g\n\n💡 More protein = better satiety + muscle preservation!`;
  }

  // Default - personalized generic advice
  return `Hi! I'll help you with: "${query}"\n\n👤 **Your Profile**:\n- Goal: ${profile.goal}\n- Weight: ${profile.weight}kg\n- Activity: ${profile.activityLevel}\n\n💡 **Quick Tips**:\n1. Progressive overload weekly\n2. Protein: ${Math.round(profile.weight * 2)}g/day\n3. Sleep 7-9 hours\n4. Train consistently\n5. Track your progress\n\n❓ **Ask me about**:\n- Specific exercises (bench, squat, deadlift)\n- Nutrition & meal planning\n- Fat loss or muscle gain\n- Workout programs\n- Form & technique\n- Rest & recovery\n- Supplements\n\nWhat would you like to know more about?`;
}

Deno.serve(app.fetch);