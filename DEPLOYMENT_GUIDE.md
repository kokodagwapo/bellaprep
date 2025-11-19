# GitHub Pages Deployment Guide

## Steps to Ensure Your Commits Sync to GitHub

### 1. Verify Your Git Configuration

```bash
cd /Users/jgd/Documents/GitHub/BellaNew/bellaNew
git remote -v
# Should show: origin https://github.com/kokodagwapo/bellaNew.git
```

### 2. Check Your Current Status

```bash
git status
# Should show: "Your branch is up-to-date with 'origin/main'"
```

### 3. Standard Push Workflow

After making changes, always run:

```bash
# Stage all changes
git add -A

# Commit with a descriptive message
git commit -m "Your commit message here"

# Push to GitHub
git push origin main
```

### 4. Verify Push Was Successful

```bash
# Check if local and remote are in sync
git log origin/main..HEAD
# If empty, everything is synced

# View recent commits
git log --oneline -5
```

### 5. Check GitHub Actions Deployment

After pushing, check:
- **GitHub Actions**: https://github.com/kokodagwapo/bellaNew/actions
- The workflow should automatically trigger on push to `main`
- Wait 2-5 minutes for deployment to complete

### 6. Manual Workflow Trigger (If Needed)

If automatic deployment doesn't trigger:
1. Go to: https://github.com/kokodagwapo/bellaNew/actions
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select "main" branch and click "Run workflow"

### 7. Verify GitHub Pages Settings

Ensure GitHub Pages is configured:
1. Go to: https://github.com/kokodagwapo/bellaNew/settings/pages
2. Source should be: "GitHub Actions"
3. If not set, select "GitHub Actions" as the source

### 8. Troubleshooting

**If commits aren't showing on GitHub:**
```bash
# Force push (use with caution)
git push origin main --force-with-lease

# Or check if you're on the right branch
git branch
# Should show: * main
```

**If GitHub Actions isn't running:**
- Check if `.github/workflows/deploy.yml` exists in the repository root
- Verify the workflow file is committed and pushed
- Check GitHub Actions tab for any error messages

**If site isn't updating:**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait 5-10 minutes for CDN propagation
- Check the deployment status in GitHub Actions

### 9. Quick Sync Command

Use this one-liner to sync everything:

```bash
cd /Users/jgd/Documents/GitHub/BellaNew/bellaNew && git add -A && git commit -m "Update: $(date +%Y-%m-%d)" && git push origin main
```

### 10. Verify Deployment

After deployment completes:
- Visit: https://kokodagwapo.github.io/bellaNew/
- Check browser console for any errors
- Verify all features are working

## Current Status

✅ Git remote is configured correctly
✅ Workflow file exists at `.github/workflows/deploy.yml`
✅ Workflow triggers on push to `main` branch
✅ Builds from `bellaNew` subdirectory
✅ Deploys `bellaNew/dist` to GitHub Pages

