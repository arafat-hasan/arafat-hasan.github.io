# Quick Deployment Workflow

This is a quick reference for deploying your portfolio to GitHub Pages.

## First-Time Setup (One-time only)

1. **Enable GitHub Pages**
   - Go to: https://github.com/arafat-hasan/arafat-hasan.com/settings/pages
   - Under "Source", select: **GitHub Actions**
   - Click Save

2. **Push the workflow file**
   ```bash
   git add .github/workflows/deploy.yml astro.config.mjs DEPLOYMENT.md README.md
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

## Deploying Your Site

Every time you want to deploy:

1. **Go to Actions**
   - Visit: https://github.com/arafat-hasan/arafat-hasan.com/actions

2. **Run the workflow**
   - Click "Deploy to GitHub Pages" in the left sidebar
   - Click "Run workflow" button (green button on the right)
   - Select branch: `main`
   - Click "Run workflow"

3. **Wait for completion**
   - Watch the workflow run (takes ~1-2 minutes)
   - Green checkmark = Success ✅
   - Red X = Failed ❌ (check logs)

4. **Visit your site**
   - https://arafat-hasan.com

## Regular Update Workflow

```bash
# 1. Make your changes locally
# ... edit files ...

# 2. Test locally
npm run dev

# 3. Build and test production version
npm run build
npm run preview

# 4. Commit and push
git add .
git commit -m "Update portfolio content"
git push origin main

# 5. Go to GitHub Actions and manually trigger deployment
# (Follow steps in "Deploying Your Site" above)
```

## Troubleshooting

**Build fails?**
- Check the Actions logs for errors
- Test locally: `npm run build`
- Ensure all dependencies are in package.json

**Site not updating?**
- Clear browser cache (Ctrl+Shift+R)
- Wait 2-3 minutes for CDN
- Check workflow completed successfully

**404 errors?**
- Verify GitHub Pages is enabled
- Check the workflow deployed successfully
- Ensure `base: '/'` in astro.config.mjs

## Files You Modified

- `.github/workflows/deploy.yml` - Deployment workflow
- `astro.config.mjs` - Added base path
- `DEPLOYMENT.md` - Full documentation
- `README.md` - Updated deployment section

For detailed information, see [DEPLOYMENT.md](DEPLOYMENT.md)
