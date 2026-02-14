# 📦 GitHub Push & Deployment Guide

Complete step-by-step instructions to push your Forge app to GitHub and deploy it.

---

## 📋 Prerequisites

Before starting, make sure you have:

- [x] Git installed on your computer
- [x] GitHub account created
- [x] Your Forge app working locally
- [x] Terminal/Command Prompt access

### Install Git (if needed)

**Windows:**
Download from [git-scm.com](https://git-scm.com/download/win)

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # CentOS/RHEL
```

### Configure Git (first time only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 🚀 Step-by-Step: Push to GitHub

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in repository details:
   - **Name**: `forge-fitness` (or any name you like)
   - **Description**: `A comprehensive fitness tracking app with workout logging, nutrition tracking, and AI trainer`
   - **Public or Private**: Choose based on preference
   - ⚠️ **DO NOT** check "Initialize with README" (we already have files)
   - ⚠️ **DO NOT** add .gitignore or license (already created)
4. Click **"Create repository"**

✅ You'll see a page with setup instructions - keep it open!

---

### Step 2: Initialize Git in Your Project

Open terminal/command prompt in your project folder:

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init

# Set default branch to 'main'
git branch -M main
```

---

### Step 3: Stage All Files

```bash
# Add all files to git
git add .

# Check what will be committed (optional)
git status
```

You should see all your files listed in green, ready to commit.

---

### Step 4: Commit Your Code

```bash
git commit -m "Initial commit - Forge Fitness Tracker

- Complete fitness tracking app
- Workout logger with 100+ exercises
- Nutrition tracking with macro breakdown
- Progress analytics with charts
- AI fitness trainer
- Supabase authentication
- Dark theme with emerald accents"
```

✅ Your code is now committed locally!

---

### Step 5: Connect to GitHub

Copy the repository URL from GitHub (looks like this):
- **HTTPS**: `https://github.com/YOUR_USERNAME/forge-fitness.git`
- **SSH**: `git@github.com:YOUR_USERNAME/forge-fitness.git`

```bash
# Add GitHub as remote (use your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/forge-fitness.git

# Verify remote was added
git remote -v
```

---

### Step 6: Push to GitHub

```bash
# Push code to GitHub
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Your GitHub Personal Access Token (not your actual password!)

**Need a token?** See "Creating Personal Access Token" section below.

---

### Step 7: Verify on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/forge-fitness`
2. Refresh the page
3. You should see all your files! 🎉

---

## 🔑 Creating Personal Access Token (if needed)

GitHub requires tokens instead of passwords for authentication:

1. Go to GitHub → **Settings** (your profile)
2. Scroll down → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. Click **"Generate new token (classic)"**
5. Settings:
   - **Note**: "Forge Fitness Deploy"
   - **Expiration**: 90 days (or No expiration)
   - **Scopes**: Check `repo` (all sub-options)
6. Click **"Generate token"**
7. **COPY THE TOKEN** - you won't see it again!
8. Save it securely (password manager)

Use this token as your password when pushing to GitHub.

---

## 📝 Future Commits (Daily Workflow)

After making changes to your code:

```bash
# 1. Check what changed
git status

# 2. Add changed files
git add .
# OR add specific files
git add src/app/components/Dashboard.tsx

# 3. Commit with descriptive message
git commit -m "Add new feature: workout templates"

# 4. Push to GitHub
git push origin main
```

**That's it!** Changes appear on GitHub in seconds.

---

## 🌿 Working with Branches (Optional but Recommended)

For larger features, use branches:

```bash
# Create and switch to new branch
git checkout -b feature/workout-sharing

# Make changes and commit
git add .
git commit -m "Add workout sharing feature"

# Push branch to GitHub
git push origin feature/workout-sharing

# On GitHub, create Pull Request to merge into main
```

---

## 🎨 Customizing Your Repository

### Add Repository Topics
1. Go to your repo on GitHub
2. Click **"Add topics"** (under About section)
3. Add: `fitness`, `react`, `typescript`, `supabase`, `tailwindcss`, `workout-tracker`

### Add Repository Description
Click the ⚙️ icon next to About and add:
> A comprehensive fitness tracking application with workout logging, nutrition tracking, progress analytics, and an AI-powered fitness trainer. Built with React, TypeScript, Tailwind CSS, and Supabase.

### Enable GitHub Pages (Optional)
If you deployed to Vercel/Netlify, add the live URL:
1. Settings → scroll to "Website"
2. Add your deployed URL

---

## 📊 Repository Settings Recommendations

### General Settings
- ✅ Enable "Issues" (for bug reports)
- ✅ Enable "Discussions" (for community)
- ❌ Disable "Wikis" (unless you plan to use it)
- ❌ Disable "Projects" (unless needed)

### Branch Protection (for main branch)
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Settings:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass (if using CI/CD)

---

## 🔄 Syncing with GitHub

### Pull latest changes (if working from multiple computers)
```bash
git pull origin main
```

### Clone on another computer
```bash
git clone https://github.com/YOUR_USERNAME/forge-fitness.git
cd forge-fitness
npm install
```

---

## 📦 .gitignore Explained

Your `.gitignore` file prevents these from being pushed:

```
node_modules/       # Dependencies (too large, reinstall with npm install)
.env                # Secrets (NEVER commit these!)
dist/               # Build output (generated, not source code)
.DS_Store           # macOS system files
*.log               # Log files
.vscode/            # Editor settings (personal preference)
```

✅ This is already set up for you!

---

## 🚨 Common Issues & Solutions

### Issue: "git: command not found"
**Solution**: Git not installed. Install from [git-scm.com](https://git-scm.com)

### Issue: "Permission denied (publickey)"
**Solution**: Use HTTPS instead of SSH, or set up SSH keys

### Issue: "Updates were rejected because the remote contains work"
**Solution**: 
```bash
git pull origin main --rebase
git push origin main
```

### Issue: "Large files warning"
**Solution**: GitHub has 100MB file limit. Remove large files:
```bash
git rm --cached large-file.zip
git commit -m "Remove large file"
```

### Issue: "Accidentally committed .env file"
**Solution**:
```bash
# Remove from git but keep locally
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking"
git push origin main

# Then regenerate all your secrets!
```

---

## 📚 Useful Git Commands

```bash
# View commit history
git log --oneline

# Undo last commit (keeps changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD

# View differences
git diff

# Create branch
git branch feature-name

# Switch branch
git checkout feature-name

# Delete branch
git branch -d feature-name

# Merge branch into main
git checkout main
git merge feature-name

# View remote URL
git remote -v

# Change remote URL
git remote set-url origin https://new-url.git
```

---

## 🎯 Best Practices

1. **Commit Often**: Small, focused commits are better than large ones
2. **Descriptive Messages**: "Fix login bug" not "fix stuff"
3. **Use Branches**: For features, use separate branches
4. **Pull Before Push**: Always `git pull` before `git push`
5. **Review Before Commit**: Check `git status` and `git diff`
6. **Never Commit Secrets**: Use `.env` and `.gitignore`
7. **Tag Releases**: Use `git tag v1.0.0` for versions

---

## 📖 Commit Message Format (Recommended)

```bash
# Format:
git commit -m "Type: Short description

Optional detailed explanation
- Bullet point 1
- Bullet point 2"

# Types:
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style (formatting, no logic change)
refactor: Code restructuring
test:     Adding tests
chore:    Maintenance tasks
```

**Examples:**
```bash
git commit -m "feat: Add workout sharing functionality"
git commit -m "fix: Resolve login authentication error"
git commit -m "docs: Update README with deployment instructions"
git commit -m "style: Format components with Prettier"
```

---

## ✅ Checklist Before First Push

- [ ] All secrets removed from code
- [ ] `.gitignore` file exists
- [ ] Code builds successfully (`npm run build`)
- [ ] No large files (>50MB)
- [ ] README.md is updated with your info
- [ ] package.json has correct name and description
- [ ] License added (if open source)
- [ ] GitHub repository created
- [ ] Git initialized and remote added
- [ ] Files staged and committed

---

## 🎉 Success!

Your Forge fitness tracker is now on GitHub! 

**Next Steps:**
1. ⭐ Star your own repo (why not?)
2. 📝 Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy
3. 🚀 Deploy to Vercel/Netlify
4. 📣 Share with the world!

**Repository URL**: `https://github.com/YOUR_USERNAME/forge-fitness`

---

## 🆘 Need Help?

- 📖 [Git Documentation](https://git-scm.com/doc)
- 📖 [GitHub Guides](https://guides.github.com)
- 🎓 [Git Tutorial](https://www.atlassian.com/git/tutorials)
- 💬 [GitHub Community](https://github.community)

Good luck with your deployment! 🚀💪
