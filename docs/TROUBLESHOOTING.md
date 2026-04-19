# 🔧 Troubleshooting Guide - Forge Fitness

Common issues and solutions for deployment and runtime problems.

---

## 🚨 Emergency Quick Fixes

### App Won't Load / White Screen

```bash
# 1. Check browser console (F12)
# 2. Look for red errors
# 3. Most common: Supabase connection issue

# Fix:
# Verify /utils/supabase/info.tsx has correct credentials
# Restart dev server: npm run dev
```

### "Cannot connect to server" Error

```bash
# Edge function not deployed or not healthy

# Check function status:
supabase functions list

# Redeploy:
supabase functions deploy make-server-56c079d7

# Test health:
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-56c079d7/health \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Login/Signup Not Working

```bash
# 1. Edge function must be deployed
# 2. Environment secrets must be set

# Set secrets:
supabase secrets set SUPABASE_URL=https://xxxxx.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Check secrets are set:
supabase secrets list
```

---

## 🐛 Deployment Issues

### Vercel Build Fails

**Error: "Command failed: npm run build"**

**Solutions:**

1. **Test locally first:**

```bash
npm run build
```

If it fails locally, fix errors before deploying.

2. **Check Node version:**
   - Vercel Settings → Node.js Version → 18.x
   - Update if needed

3. **Clear cache:**
   - Vercel Dashboard → Deployments → ...menu → Redeploy → Check "Clear cache"

4. **Check for TypeScript errors:**

```bash
npx tsc --noEmit
```

5. **Missing dependencies:**

```bash
npm install
# Make sure package.json has all dependencies
```

**Error: "Cannot find module"**

```bash
# Install missing package
npm install package-name

# Commit and push
git add package.json
git commit -m "Add missing dependency"
git push origin main
```

---

### Netlify Build Fails

**Error: "Build script returned non-zero exit code"**

**Solutions:**

1. **Check build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: (empty)

2. **Check build logs** for specific error

3. **Test locally:**

```bash
rm -rf node_modules dist
npm install
npm run build
```

4. **Environment variables:**
   - Usually not needed for Forge (config in code)
   - Only if you added custom env vars

---

### GitHub Pages Deployment Issues

**Site not loading / 404 errors**

1. **Verify branch:**
   - Settings → Pages
   - Source: `gh-pages` branch
   - Root directory

2. **Base URL issue:**
   - Add to `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/forge-fitness/', // Your repo name
  plugins: [react()],
});
```

3. **Redeploy:**

```bash
npm run deploy
```

---

## 🗄️ Supabase Issues

### Edge Function Won't Deploy

**Error: "Not logged in"**

```bash
supabase login
# Follow browser authentication
```

**Error: "Project not linked"**

```bash
supabase link --project-ref your-project-id
# Get project ID from Supabase dashboard URL
```

**Error: "Function deployment failed"**

```bash
# Check function code for errors
# Verify file exists: /supabase/functions/server/index.tsx

# Check logs:
supabase functions logs make-server-56c079d7

# Try redeploying:
supabase functions deploy make-server-56c079d7 --no-verify-jwt
```

---

### Edge Function Returns 500 Error

**Check logs:**

```bash
supabase functions logs make-server-56c079d7 --limit 50
```

**Common causes:**

1. **Missing environment secrets:**

```bash
# Check what's set:
supabase secrets list

# Set missing secrets:
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
```

2. **CORS issues:**
   - Edge function should have CORS enabled
   - Check `/supabase/functions/server/index.tsx`
   - Should import and use `cors` from `npm:hono/cors`

3. **Timeout:**
   - Function taking too long
   - Check for infinite loops
   - Optimize database queries

---

### Database Connection Errors

**Error: "relation does not exist"**

- KV store table should auto-create
- Check Supabase Dashboard → Table Editor
- Verify `kv_store_56c079d7` table exists

**Solution:**

```bash
# Function creates table on first use
# Make a test API call to trigger creation
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-56c079d7/health \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## 🐙 Git & GitHub Issues

### Can't Push to GitHub

**Error: "Permission denied (publickey)"**

**Solution: Use HTTPS instead:**

```bash
# Remove SSH remote
git remote remove origin

# Add HTTPS remote
git remote add origin https://github.com/YOUR_USERNAME/forge-fitness.git

# Push
git push -u origin main
```

**Error: "Authentication failed"**

**Solution: Use Personal Access Token:**

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Scopes: `repo` (all sub-options)
5. Copy token (you won't see it again!)
6. Use as password when pushing

---

### Repository Already Exists

**Error: "remote origin already exists"**

```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/forge-fitness.git

# Push
git push -u origin main
```

---

### Files Too Large

**Error: "File exceeds GitHub's file size limit"**

```bash
# Find large files
find . -type f -size +50M

# Remove from git (but keep locally)
git rm --cached large-file.zip

# Add to .gitignore
echo "large-file.zip" >> .gitignore

# Commit
git commit -m "Remove large file"
git push origin main
```

---

## 💻 Local Development Issues

### Port Already in Use

**Error: "Port 5173 is already in use"**

**Solution:**

```bash
# Kill process on port (macOS/Linux)
lsof -ti:5173 | xargs kill

# Or use different port
npm run dev -- --port 3000
```

**Windows:**

```bash
# Find process
netstat -ano | findstr :5173

# Kill process (replace PID)
taskkill /PID 1234 /F
```

---

### Module Not Found

**Error: "Cannot find module 'xyz'"**

**Solution:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or install specific package
npm install xyz
```

---

### TypeScript Errors

**Error: "Type 'X' is not assignable to type 'Y'"**

**Quick fix (not recommended for production):**

```typescript
// Add // @ts-ignore above the line
// @ts-ignore
const something: Type = value;
```

**Proper fix:**

- Read the error message carefully
- Fix type definitions
- Add proper type annotations

---

## 🔐 Authentication Issues

### Can't Sign Up

**Check:**

1. Edge function deployed? ✅
2. Secrets set? ✅
3. Network tab shows request? ✅
4. What's the response?

**Common responses:**

**500 Error:**

- Edge function issue
- Check Supabase function logs

**400 Error:**

- Invalid input
- Check password requirements
- Check email format

**No response:**

- CORS issue
- Check edge function CORS setup

---

### Can't Login

**"Invalid credentials" but password is correct:**

1. **Check user exists:**
   - Supabase Dashboard → Authentication → Users
   - Search for email

2. **Email not confirmed:**
   - By default, email_confirm is true in signup
   - Check user record

3. **Password mismatch:**
   - Case sensitive
   - Check for extra spaces

**Solution: Reset user**

```bash
# Create new test account
# Use different email
```

---

### Session Expires Immediately

**Issue: Logged out after refresh**

**Check:**

1. `localStorage` working?
   - Browser DevTools → Application → Local Storage
   - Should see `forge_user_id`

2. Using private/incognito mode?
   - LocalStorage may be disabled

**Solution:**

```typescript
// Verify localStorage is available
if (typeof window !== 'undefined' && window.localStorage) {
  // Safe to use
}
```

---

## 🎨 UI/Display Issues

### Styles Not Loading

**Tailwind classes not working:**

1. **Build the CSS:**

```bash
npm run dev
# Tailwind compiles on dev server start
```

2. **Check imports:**
   - `src/styles/index.css` imported in main app?

3. **Purge issue:**
   - Tailwind v4 auto-detects classes
   - Restart dev server

---

### Images Not Displaying

**Unsplash images:**

- Requires internet connection
- Check console for CORS errors
- Images may be rate-limited

**figma:asset images:**

- Only works in Figma Make environment
- Replace with regular image URLs for production

**Solution:**

```typescript
// Replace figma:asset imports with regular URLs
// Or use Unsplash for all images
```

---

### Mobile Layout Broken

**Issue: Desktop view on mobile**

**Check viewport meta tag:**

```html
<!-- In index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Test responsive:**

- Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
- Test on actual mobile device

---

## 📊 Data Issues

### Workouts Not Saving

**Check console for errors:**

1. F12 → Console
2. Log a workout
3. Look for red errors

**Common causes:**

1. **Edge function down:**

```bash
# Test health
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-56c079d7/health \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

2. **User not authenticated:**
   - Check localStorage has `forge_user_id`

3. **Network error:**
   - Check internet connection
   - Check Supabase status page

---

### Data Not Loading

**Dashboard shows 0 for everything:**

**This is normal for new users!**

- Dashboard shows actual data
- Log workouts to see stats update
- Track nutrition to see macros

**If you DID log data:**

1. Check userId matches
2. Check date format
3. Check API response in Network tab

---

## 🤖 AI Trainer Issues

### AI Not Responding

**Check:**

1. Input not empty?
2. Send button enabled?
3. Console errors?

**Issue: Infinite "typing"**

- Refresh page
- Ask question again

**Issue: Same answer every time**

- AI uses keyword matching
- Try more specific questions
- Different keywords trigger different responses

---

## 🔍 Debugging Tips

### General Debugging Process

1. **Check browser console (F12)**
   - Look for errors (red text)
   - Read error messages carefully

2. **Check Network tab**
   - See API requests
   - Check response codes (200 = good, 500 = server error)
   - Inspect response data

3. **Check Supabase logs**

```bash
supabase functions logs make-server-56c079d7
```

4. **Test in isolation**
   - Does it work locally?
   - Does it work in incognito?
   - Does it work on different browser?

5. **Binary search**
   - Comment out half the code
   - If error persists, issue is in other half
   - Repeat until you find the problem

---

### Useful Console Commands

```javascript
// In browser console (F12)

// Check if user is logged in
localStorage.getItem('forge_user_id');

// Clear all data (reset)
localStorage.clear();

// Check Supabase config
console.log('Project ID:', projectId);
console.log('Anon Key:', publicAnonKey);

// Test API call
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-56c079d7/health', {
  headers: { Authorization: 'Bearer YOUR_ANON_KEY' },
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 📞 When to Ask for Help

**Try these first:**

1. ✅ Check this troubleshooting guide
2. ✅ Check other .md documentation files
3. ✅ Search error message in guides (Ctrl+F)
4. ✅ Check browser console for errors
5. ✅ Check Supabase function logs
6. ✅ Google the error message
7. ✅ Check Supabase status page

**Then ask for help:**

- 💬 Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- 💬 React Discord: [discord.gg/react](https://discord.gg/react)
- 🐛 Stack Overflow: Tag with `supabase`, `react`, `vite`
- 🐛 Open GitHub issue on your repository

**When asking, include:**

1. What you were trying to do
2. What you expected to happen
3. What actually happened
4. Error messages (full text)
5. Browser console screenshot
6. Steps to reproduce
7. What you've already tried

---

## ✅ Prevention Checklist

**Before deploying:**

- [ ] Works locally (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors
- [ ] All features tested
- [ ] Supabase credentials updated
- [ ] Edge function deployed and tested

**After deploying:**

- [ ] Test immediately
- [ ] Monitor logs for first hour
- [ ] Test on mobile
- [ ] Test on different browsers
- [ ] Ask friend to test

---

## 🎯 Still Stuck?

**Nuclear option (start fresh):**

1. **Backend reset:**

```bash
# Delete and redeploy edge function
supabase functions delete make-server-56c079d7
supabase functions deploy make-server-56c079d7
```

2. **Frontend reset:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules dist
npm install
npm run build
```

3. **Deployment reset:**
   - Delete deployment on Vercel/Netlify
   - Redeploy from scratch

4. **Code reset:**

```bash
# Create new branch
git checkout -b fresh-start

# Start from last known working commit
git reset --hard <commit-hash>
```

---

## 📚 Additional Resources

### Official Docs

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Troubleshooting](https://supabase.com/docs/guides/platform/troubleshooting)
- [Vercel Troubleshooting](https://vercel.com/docs/concepts/deployments/troubleshoot-a-build)
- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)

### Community

- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

---

**Remember:** Every developer faces issues during deployment. It's part of the process! 💪

**You've got this!** 🚀

If you fix an issue not listed here, consider contributing to this guide!
