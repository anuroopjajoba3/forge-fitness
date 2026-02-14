# 🔥 Forge - Comprehensive Fitness Tracker

A professional, full-featured fitness tracking application built with React, TypeScript, Tailwind CSS, and Supabase. Forge helps you track workouts, nutrition, progress, and provides AI-powered fitness guidance.

![Forge Fitness Tracker](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop)

## ✨ Features

### 🏋️ Workout Tracking
- **Professional Workout Logger**: Set-by-set tracking with rest timers
- **100+ Exercises**: Organized by muscle groups (Chest, Back, Legs, Shoulders, Arms, Core, Olympic, Cardio, Sports)
- **Exercise Library**: Searchable database with proper form guidance
- **Workout Routines**: Create and save custom workout plans
- **Volume Calculation**: Automatic tracking of total weight lifted
- **History Tracking**: Review past workouts and track progress

### 🍽️ Nutrition Tracking
- **Manual Food Logging**: Track meals with macro breakdowns
- **Calorie Tracking**: Daily calorie intake monitoring
- **Macro Distribution**: Protein, carbs, and fats visualization
- **Hydration Tracking**: Monitor daily water intake
- **Meal History**: Review past meals and nutrition patterns

### 📊 Progress Analytics
- **Weight Tracking**: Monitor bodyweight changes over time
- **Progress Charts**: Visual representation of fitness journey
- **Workout History**: Detailed logs of all training sessions
- **Volume Trends**: Track strength progression over weeks/months
- **Body Metrics**: Track measurements and body composition

### 🤖 AI Fitness Trainer
- **Personalized Advice**: Get recommendations based on your profile and goals
- **Exercise Guidance**: Form tips, programming, and progression advice
- **Nutrition Help**: Meal planning and macro calculations
- **Recovery Strategies**: Rest, sleep, and injury prevention guidance
- **Supplement Info**: Evidence-based supplement recommendations
- **Real Fitness Knowledge**: Comprehensive answers on squats, deadlifts, bench press, cardio, abs, and more

### 👤 User Management
- **Full Authentication**: Secure login and signup via Supabase Auth
- **User Profiles**: Personalized fitness profiles with goals
- **Onboarding Flow**: Guided setup for new users
- **Goal Setting**: Track goals like weight loss, muscle gain, or fitness improvement
- **Activity Levels**: Customized recommendations based on training frequency

### 🎨 Design
- **Dark Theme**: Professional "Wellness Studio" aesthetic
- **Stone, White, Emerald Color Palette**: Modern and clean design
- **Fully Responsive**: Optimized for mobile and desktop
- **Smooth Animations**: Polished user experience
- **Intuitive Navigation**: Easy-to-use bottom nav on mobile, side nav on desktop

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Supabase (Edge Functions, Auth, Database, Storage)
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account (free tier works)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/forge-fitness.git
cd forge-fitness
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up Supabase**

Create a new project at [supabase.com](https://supabase.com)

Get your project credentials:
- Project URL
- Anon/Public Key
- Service Role Key

4. **Configure environment variables**

Update `/utils/supabase/info.tsx` with your Supabase credentials:
```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

5. **Deploy Supabase Edge Function**

Install Supabase CLI:
```bash
npm install -g supabase
```

Login and link your project:
```bash
supabase login
supabase link --project-ref your-project-ref
```

Deploy the server function:
```bash
supabase functions deploy make-server-56c079d7
```

Set required secrets:
```bash
supabase secrets set SUPABASE_URL=your-project-url
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

6. **Run locally**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🗄️ Database Schema

The app uses Supabase's key-value store for data persistence:

- **Users**: Authentication via Supabase Auth
- **Profiles**: User fitness profiles and goals
- **Workouts**: Workout sessions and exercise logs
- **Nutrition**: Meal and nutrition tracking
- **Progress**: Weight tracking and measurements

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Configure build settings:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
- Deploy!

3. **Environment Variables** (if needed)
Add any required environment variables in Vercel dashboard

### Deploy to Netlify

1. **Push to GitHub** (same as above)

2. **Connect to Netlify**
- Go to [netlify.com](https://netlify.com)
- Import from GitHub
- Build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- Deploy!

## 🎯 Usage

### First Time Setup
1. Sign up with email and password
2. Complete onboarding flow (personal info, stats, goals)
3. Start logging workouts and tracking nutrition!

### Logging a Workout
1. Navigate to "Workout" tab
2. Click "Add Exercise"
3. Search and select exercises by muscle group
4. Log sets, reps, and weight
5. Use rest timer between sets
6. Finish workout to save

### Tracking Nutrition
1. Go to "Nutrition" tab
2. Add meals throughout the day
3. Monitor macros and calories
4. Track water intake
5. View daily/weekly trends

### Using AI Trainer
1. Navigate to "AI" tab
2. Ask questions about fitness, nutrition, or form
3. Get personalized advice based on your profile
4. Use quick questions or ask anything custom

## 📱 Screenshots

### Dashboard
Clean overview of daily stats, weekly activity, and AI recommendations

### Workout Logger
Professional set-by-set tracking with rest timers and volume calculation

### Nutrition Tracker
Comprehensive meal logging with macro breakdowns and calorie tracking

### Progress Analytics
Visual charts showing weight trends and workout history

### AI Trainer
Intelligent fitness chatbot with comprehensive knowledge

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)

## 📞 Support

For support, questions, or feature requests, please open an issue on GitHub.

---

**Made with 💪 by [Your Name]**

Track your gains, achieve your goals, and forge your fitness journey!
