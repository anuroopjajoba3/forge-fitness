# ⚡ Quick Start Guide - Forge Fitness Tracker

Get your Forge app running in under 10 minutes!

## 🎯 Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Forge Fitness Tracker"

# Create repository on GitHub
# Go to github.com → New repository → Name it "forge-fitness"

# Link and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/forge-fitness.git
git push -u origin main
```

✅ **Done!** Your code is now on GitHub.

---

## 🗄️ Step 2: Set Up Supabase (3 minutes)

### Create Project

1. Go to [supabase.com](https://supabase.com) → Sign in/up
2. Click **"New Project"**
3. Fill in:
   - **Name**: `forge-fitness`
   - **Password**: (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** (takes ~2 min)

### Get Your Keys

1. Once ready, go to **Settings** → **API**
2. Copy these:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project ID**: The `xxxxx` from URL
   - **anon public key**: Long string starting with `eyJ...`
   - **service_role key**: Another long string (keep secret!)

### Update Your Code

Edit `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'xxxxx'; // Your project ID here
export const publicAnonKey = 'eyJhbGc...'; // Your anon key here
```

✅ **Done!** Supabase is configured.

---

## 🚀 Step 3: Deploy Edge Function (2 minutes)

### Install Supabase CLI

**macOS/Linux:**

```bash
brew install supabase/tap/supabase
```

**Windows:**

```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Deploy Function

```bash
# Login
supabase login

# Link to your project
supabase link --project-ref xxxxx  # Use your project ID

# Deploy
supabase functions deploy make-server-56c079d7

# Set secrets
supabase secrets set SUPABASE_URL=https://xxxxx.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Test It

```bash
curl https://xxxxx.supabase.co/functions/v1/make-server-56c079d7/health \
  -H "Authorization: Bearer your-anon-key"
```

Should return: `{"status": "healthy"}`

✅ **Done!** Backend is live.

---

## 🌐 Step 4: Deploy Frontend (2 minutes)

### Option A: Vercel (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repo
4. Settings auto-detected:
   - Framework: Vite ✅
   - Build: `npm run build` ✅
   - Output: `dist` ✅
5. Click **"Deploy"**
6. Wait ~1 minute
7. **Done!** 🎉

Your app is live at: `https://forge-fitness-xxxxx.vercel.app`

### Option B: Netlify (Also Easy)

1. Go to [netlify.com](https://netlify.com)
2. **"Add new site"** → **"Import from Git"**
3. Choose GitHub → Select repo
4. Build settings:
   - Build: `npm run build`
   - Publish: `dist`
5. Click **"Deploy"**
6. **Done!** 🎉

Your app is live at: `https://forge-fitness-xxxxx.netlify.app`

---

## ✅ Step 5: Test Your App (1 minute)

1. Open your deployed URL
2. Click **"Sign Up"**
3. Create account
4. Complete onboarding
5. Log a workout
6. Track some nutrition
7. Chat with AI trainer

**Everything working?** 🎉 Congratulations!

---

## 🎯 Quick Links

- **GitHub Repo**: `https://github.com/YOUR_USERNAME/forge-fitness`
- **Live App**: `https://your-app.vercel.app`
- **Supabase Dashboard**: `https://supabase.com/dashboard/project/xxxxx`
- **API Health**: `https://xxxxx.supabase.co/functions/v1/make-server-56c079d7/health`

---

## 🐛 Common Issues

### "Cannot connect to server"

- ✅ Check `/utils/supabase/info.tsx` has correct project ID
- ✅ Verify edge function is deployed: `supabase functions list`
- ✅ Test health endpoint with curl

### "Build failed on Vercel"

- ✅ Check Node version is 18+
- ✅ Run `npm run build` locally first
- ✅ Check for TypeScript errors

### "Login doesn't work"

- ✅ Edge function must be deployed
- ✅ Environment secrets must be set
- ✅ Check browser console for errors

---

## 📚 Next Steps

1. **Customize**: Update branding, colors, features
2. **Custom Domain**: Add your own domain in Vercel/Netlify
3. **Analytics**: Enable Vercel Analytics or Google Analytics
4. **Share**: Tell people about your app!
5. **Iterate**: Gather feedback and improve

---

## 💡 Pro Tips

- 🔐 **Never commit secrets** - they're only in Supabase Edge Function
- 🚀 **Every git push deploys** - automatic CI/CD
- 📊 **Monitor usage** - Check Supabase dashboard for API calls
- 💾 **Free tiers are generous** - Good for 1000s of users
- 🎨 **Easy customization** - All styling in Tailwind classes

---

## 🆘 Need Help?

- 📖 Read full [DEPLOYMENT.md](./DEPLOYMENT.md)
- 📖 Check [README.md](./README.md) for features
- 🐛 Open GitHub issue
- 💬 Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

**Total Time: ~10 minutes**

You now have a fully-deployed, production-ready fitness tracking app! 🔥💪

Happy coding!
