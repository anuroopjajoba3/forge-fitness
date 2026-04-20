# 🚀 Deployment Guide - Forge Fitness Tracker

This guide will help you deploy your Forge fitness app to production.

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Edge function deployed
- [ ] Database configured
- [ ] Environment variables set
- [ ] Code pushed to GitHub
- [ ] App tested locally

---

## 🔧 Supabase Setup (Required)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `forge-fitness`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to initialize (~2 minutes)

### 2. Get Your Credentials

Once project is ready:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project ID**: The `xxxxx` part from URL
   - **anon/public key**: Under "Project API keys"
   - **service_role key**: Under "Project API keys" (keep secret!)

### 3. Update Supabase Info File

Edit `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'your-actual-project-id'; // Just the ID, not full URL
export const publicAnonKey = 'your-anon-public-key';
```

**⚠️ Important**: Never commit `service_role` key to GitHub! It's only used in the Edge Function.

### 4. Deploy Edge Function

Install Supabase CLI:

```bash
# macOS
brew install supabase/tap/supabase

# Windows (using Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

Login and link your project:

```bash
supabase login
supabase link --project-ref your-project-id
```

Deploy the server function:

```bash
cd supabase/functions
supabase functions deploy make-server-56c079d7
```

Set environment secrets:

```bash
supabase secrets set SUPABASE_URL=https://xxxxx.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set SUPABASE_DB_URL=your-db-connection-string
```

Verify function is running:

```bash
supabase functions list
```

### 5. Test Edge Function

Test locally first:

```bash
curl https://your-project-id.supabase.co/functions/v1/make-server-56c079d7/health \
  -H "Authorization: Bearer your-anon-key"
```

Expected response: `{"status": "healthy"}`

---

## 🌐 Frontend Deployment Options

### Option 1: Vercel (Recommended)

**Best for**: Easy deployment, automatic CI/CD, excellent performance

#### Steps:

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit - Forge Fitness Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/forge-fitness.git
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-app.vercel.app`

#### Automatic Deployments

- Every push to `main` automatically deploys
- Pull requests get preview deployments
- Zero-downtime deployments

---

### Option 2: Netlify

**Best for**: Simple static hosting, great free tier

#### Steps:

1. **Push to GitHub** (same as Vercel)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Base directory**: (leave empty)
   - Click "Deploy site"

3. **Custom Domain** (Optional)
   - Go to Site settings → Domain management
   - Add custom domain
   - Configure DNS records

---

### Option 3: GitHub Pages

**Best for**: Free hosting, simple static sites

#### Steps:

1. **Install gh-pages**

```bash
npm install --save-dev gh-pages
```

2. **Update package.json**
   Add these scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/forge-fitness"
}
```

3. **Deploy**

```bash
npm run deploy
```

4. **Enable GitHub Pages**
   - Go to repository settings
   - Pages section
   - Source: `gh-pages` branch
   - Save

---

### Option 4: Custom VPS (Advanced)

**Best for**: Full control, custom configurations

#### Steps:

1. **Build app**

```bash
npm run build
```

2. **Upload `dist` folder** to your server

3. **Nginx Configuration** (example)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/forge-fitness/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

4. **SSL Certificate** (Let's Encrypt)

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 🔐 Security Checklist

Before going live, ensure:

- [ ] `service_role` key is NOT in frontend code
- [ ] `.env` files are in `.gitignore`
- [ ] Supabase RLS policies are configured (if using direct DB access)
- [ ] CORS is configured in Edge Function
- [ ] Rate limiting enabled (Supabase handles this)
- [ ] User passwords meet minimum requirements

---

## 🧪 Testing Production

After deployment:

1. **Test Authentication**
   - Sign up with new account
   - Verify email confirmation (if enabled)
   - Login/logout functionality

2. **Test Core Features**
   - Log a workout
   - Track nutrition
   - View analytics
   - Chat with AI trainer

3. **Test on Multiple Devices**
   - Desktop browser
   - Mobile browser
   - Different browsers (Chrome, Safari, Firefox)

4. **Check Performance**
   - Use Lighthouse in Chrome DevTools
   - Target: 90+ performance score
   - Optimize images if needed

---

## 📊 Monitoring

### Supabase Dashboard

- Monitor API usage
- Check Edge Function logs
- Database queries
- Authentication metrics

### Vercel Analytics (if using Vercel)

- Page views
- Core Web Vitals
- Geographic distribution

---

## 🐛 Troubleshooting

### Edge Function 500 Error

```bash
# Check function logs
supabase functions logs make-server-56c079d7

# Common fixes:
# 1. Verify environment secrets are set
# 2. Check CORS configuration
# 3. Verify service_role key is correct
```

### Build Fails on Vercel

```bash
# Common fixes:
# 1. Verify Node version (use 18+)
# 2. Clear build cache
# 3. Check for TypeScript errors locally
# 4. Ensure all dependencies are in package.json
```

### Can't Connect to Supabase

```bash
# Verify:
# 1. Project ID is correct in /utils/supabase/info.tsx
# 2. Anon key is correct
# 3. Edge function is deployed
# 4. CORS allows your domain
```

---

## 🔄 Updating Production

### Quick Updates (Frontend only)

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel/Netlify will auto-deploy in ~2 minutes.

### Edge Function Updates

```bash
# Make changes to /supabase/functions/server/index.tsx
# Then redeploy:
supabase functions deploy make-server-56c079d7
```

---

## 📈 Scaling Considerations

### When to upgrade Supabase plan:

- **Free tier limits**:
  - 500MB database
  - 50,000 monthly active users
  - 2GB bandwidth

### Performance optimizations:

1. Enable database indexes for common queries
2. Implement caching for static data
3. Use CDN for images (Cloudinary, Imgix)
4. Optimize bundle size (code splitting)

---

## ✅ Post-Deployment

After successful deployment:

1. **Share your app!**
   - Update README with live URL
   - Add to portfolio
   - Share on social media

2. **Gather feedback**
   - Ask friends to test
   - Monitor error logs
   - Create feedback form

3. **Plan next features**
   - Social features?
   - Workout sharing?
   - Premium tier?
   - Mobile app?

---

## 🎉 You're Live!

Congratulations! Your Forge fitness tracker is now deployed and ready to help people achieve their fitness goals.

**Live App**: `https://your-app.vercel.app`
**API Status**: `https://your-project.supabase.co/functions/v1/make-server-56c079d7/health`

Need help? Open an issue on GitHub!
