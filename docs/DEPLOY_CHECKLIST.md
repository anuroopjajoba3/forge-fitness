# ✅ Deployment Checklist - Forge Fitness

Use this checklist to ensure smooth deployment. Check off each item as you complete it.

---

## 📦 Pre-Deployment (Do This First)

### Update Configuration
- [ ] Open `/utils/supabase/info.tsx`
- [ ] Replace `projectId` with YOUR Supabase project ID
- [ ] Replace `publicAnonKey` with YOUR Supabase anon key
- [ ] Save the file

### Test Locally
- [ ] Run `npm install` (if you haven't)
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Test sign up (create account)
- [ ] Test login
- [ ] Log a workout
- [ ] Track nutrition
- [ ] Chat with AI trainer
- [ ] Everything works? ✅ Continue!

---

## 🗄️ Supabase Setup

### Create Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign in/create account
- [ ] Click "New Project"
- [ ] Project name: `forge-fitness`
- [ ] Set strong database password (SAVE IT!)
- [ ] Choose region closest to you
- [ ] Click "Create new project"
- [ ] Wait ~2 minutes for project to initialize

### Get Credentials
- [ ] Project is ready? (green checkmark)
- [ ] Go to Settings → API
- [ ] Copy **Project URL** → Save it
- [ ] Copy **Project ID** (from URL) → Save it
- [ ] Copy **anon public** key → Save it
- [ ] Copy **service_role** key → Save it (KEEP SECRET!)
- [ ] Save all credentials in secure notes app

### Install Supabase CLI
Choose your OS:

**macOS:**
- [ ] Run: `brew install supabase/tap/supabase`

**Windows:**
- [ ] Install Scoop: https://scoop.sh
- [ ] Run: `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git`
- [ ] Run: `scoop install supabase`

**Linux:**
- [ ] Run: `brew install supabase/tap/supabase`

### Deploy Edge Function
- [ ] Run: `supabase login`
- [ ] Authenticate in browser
- [ ] Run: `supabase link --project-ref YOUR_PROJECT_ID`
- [ ] Run: `supabase functions deploy make-server-56c079d7`
- [ ] Wait for deployment to complete
- [ ] See "Deployed successfully" message? ✅

### Set Environment Secrets
- [ ] Run: `supabase secrets set SUPABASE_URL=https://YOUR_PROJECT.supabase.co`
- [ ] Run: `supabase secrets set SUPABASE_ANON_KEY=your_anon_key`
- [ ] Run: `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`
- [ ] All secrets set? ✅

### Test Edge Function
- [ ] Run this curl command (replace with your details):
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-56c079d7/health \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```
- [ ] Response shows `{"status": "healthy"}`? ✅

---

## 🐙 GitHub Setup

### Create Repository
- [ ] Go to [github.com](https://github.com)
- [ ] Sign in/create account
- [ ] Click "+" → "New repository"
- [ ] Name: `forge-fitness`
- [ ] Description: `Comprehensive fitness tracking app`
- [ ] Choose Public or Private
- [ ] ❌ DO NOT check "Initialize with README"
- [ ] Click "Create repository"
- [ ] Keep the page open for next steps

### Initialize Git Locally
Open terminal in your project folder:
- [ ] Run: `git init`
- [ ] Run: `git branch -M main`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit - Forge Fitness Tracker"`

### Connect to GitHub
- [ ] Copy your repo URL from GitHub
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/forge-fitness.git`
- [ ] Run: `git push -u origin main`
- [ ] Enter GitHub credentials if prompted
- [ ] Push successful? ✅

### Verify on GitHub
- [ ] Refresh your GitHub repository page
- [ ] See all your files? ✅
- [ ] README.md displays nicely? ✅

---

## 🚀 Deploy to Vercel (Recommended)

### Connect Repository
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign in with GitHub
- [ ] Click "New Project"
- [ ] Find your `forge-fitness` repository
- [ ] Click "Import"

### Configure Build
Vercel should auto-detect settings:
- [ ] Framework Preset: **Vite** (auto-selected)
- [ ] Build Command: `npm run build` ✅
- [ ] Output Directory: `dist` ✅
- [ ] Install Command: `npm install` ✅
- [ ] Settings look correct? ✅

### Deploy
- [ ] Click "Deploy"
- [ ] Wait 1-2 minutes
- [ ] See "Congratulations" screen? 🎉
- [ ] Click "Visit" to see your live app
- [ ] App loads? ✅

---

## 🧪 Testing Production

### Test Authentication
- [ ] Open your live app URL
- [ ] Click "Sign Up"
- [ ] Create new account with email/password
- [ ] Sign up successful? ✅
- [ ] Redirected to onboarding? ✅

### Test Onboarding
- [ ] Fill in name, age, gender
- [ ] Click "Next"
- [ ] Fill in height, weight
- [ ] See BMI calculated? ✅
- [ ] Click "Next"
- [ ] Select activity level
- [ ] Select goal
- [ ] Click "Complete Setup"
- [ ] Redirected to dashboard? ✅

### Test Core Features
- [ ] Dashboard loads with stats
- [ ] Click "Workout" tab
- [ ] Add an exercise (e.g., Bench Press)
- [ ] Log sets and reps
- [ ] Finish workout
- [ ] Workout saved? ✅
- [ ] Click "Nutrition" tab
- [ ] Add a meal
- [ ] See macros calculated? ✅
- [ ] Click "Progress" tab
- [ ] See charts? ✅
- [ ] Click "AI" tab
- [ ] Ask AI a question
- [ ] Get response? ✅

### Test on Mobile
- [ ] Open app on mobile browser
- [ ] Navigation works? ✅
- [ ] Can log workout? ✅
- [ ] Everything responsive? ✅

### Test Different Browsers
- [ ] Chrome ✅
- [ ] Safari ✅
- [ ] Firefox ✅
- [ ] Edge ✅

---

## 🔒 Security Check

### Code Security
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT in frontend code
- [ ] Only in Supabase Edge Function secrets? ✅
- [ ] `.gitignore` includes `.env` files
- [ ] No API keys in GitHub repository
- [ ] Check: Go to GitHub repo, search for "service_role"
- [ ] No results found? ✅ (Good!)

### Supabase Security
- [ ] Row Level Security enabled (if using direct DB)
- [ ] Edge function has CORS configured
- [ ] Only necessary permissions granted

---

## 📊 Performance Check

### Run Lighthouse Audit
- [ ] Open your live app in Chrome
- [ ] Press F12 (DevTools)
- [ ] Click "Lighthouse" tab
- [ ] Select "Mobile" + "Performance"
- [ ] Click "Analyze page load"
- [ ] Performance score: ___/100
- [ ] Accessibility score: ___/100
- [ ] Best Practices score: ___/100
- [ ] SEO score: ___/100
- [ ] All scores 70+? ✅ (90+ is excellent!)

---

## 🎯 Post-Deployment

### Update Repository
- [ ] Go to your GitHub repo
- [ ] Edit README.md
- [ ] Add live demo link: `**Live Demo**: https://your-app.vercel.app`
- [ ] Update "Made by" section with your name
- [ ] Commit changes

### Add Topics to GitHub Repo
- [ ] Go to repo → About section
- [ ] Click settings gear icon
- [ ] Add topics: `fitness`, `react`, `typescript`, `supabase`, `tailwindcss`
- [ ] Save

### Share Your Work
- [ ] Add to portfolio
- [ ] Share on LinkedIn
- [ ] Tweet about it
- [ ] Post in relevant subreddits (r/SideProject, r/webdev)
- [ ] Show friends and family

### Monitor
- [ ] Check Supabase dashboard for usage
- [ ] Monitor Vercel analytics
- [ ] Check for errors in logs
- [ ] First week: Check daily
- [ ] After that: Check weekly

---

## 📈 Optional Enhancements

### Custom Domain (Optional)
- [ ] Purchase domain (Namecheap, Google Domains)
- [ ] Go to Vercel → Project Settings → Domains
- [ ] Add custom domain
- [ ] Configure DNS records
- [ ] Wait for DNS propagation (~24 hours)
- [ ] HTTPS automatically enabled? ✅

### Analytics (Optional)
- [ ] Enable Vercel Analytics
- [ ] Or add Google Analytics
- [ ] Or add privacy-friendly analytics (Plausible, Fathom)

### SEO (Optional)
- [ ] Add meta tags to index.html
- [ ] Create sitemap
- [ ] Submit to Google Search Console
- [ ] Add Open Graph images

---

## 🐛 Troubleshooting

If something doesn't work, check:

### Edge Function Issues
- [ ] Function deployed? Run `supabase functions list`
- [ ] Secrets set? Run `supabase secrets list`
- [ ] Check logs: `supabase functions logs make-server-56c079d7`

### Frontend Issues
- [ ] Correct project ID in `/utils/supabase/info.tsx`?
- [ ] Check browser console for errors (F12)
- [ ] Try clearing cache and reload (Ctrl+Shift+R)

### Build Fails on Vercel
- [ ] Check Vercel deployment logs
- [ ] Does `npm run build` work locally?
- [ ] All dependencies in package.json?
- [ ] Node version 18+ in Vercel settings?

### Can't Sign Up/Login
- [ ] Edge function deployed and healthy?
- [ ] Environment secrets set correctly?
- [ ] Check Supabase logs for errors

---

## ✅ Final Verification

All green? You're done! 🎉

**Essential Checks:**
- [ ] ✅ Supabase project created and configured
- [ ] ✅ Edge function deployed and tested
- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Deployed to Vercel/Netlify
- [ ] ✅ Live app accessible
- [ ] ✅ Can sign up and login
- [ ] ✅ Can log workouts
- [ ] ✅ Can track nutrition
- [ ] ✅ AI trainer works
- [ ] ✅ Mobile responsive
- [ ] ✅ No security issues
- [ ] ✅ Performance good

---

## 🎉 Congratulations!

Your Forge fitness tracker is LIVE! 🚀

**Your Links:**
- 🌐 **Live App**: https://_________________.vercel.app
- 📦 **GitHub**: https://github.com/_________/forge-fitness
- 🗄️ **Supabase**: https://supabase.com/dashboard/project/_________

**What's Next?**
1. Share with friends for feedback
2. Monitor user engagement
3. Fix bugs as they come up
4. Plan new features
5. Iterate and improve!

---

**Need Help?**
- 📖 Check `DEPLOYMENT.md` for detailed guides
- 📖 Check `QUICKSTART.md` for quick reference
- 🐛 Open GitHub issue for bugs
- 💬 Ask in Supabase Discord for backend help

**You did it!** 💪🔥

Now go help people achieve their fitness goals!
