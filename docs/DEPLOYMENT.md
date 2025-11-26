# GitHub Pages Deployment Guide

This guide explains how to deploy your Astro portfolio site to GitHub Pages using GitHub Actions.

## Prerequisites

- GitHub repository: `arafat-hasan/arafat-hasan.com`
- GitHub Pages enabled in repository settings
- Custom domain configured (optional): `arafat-hasan.com`

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/arafat-hasan/arafat-hasan.com
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 2. Configure Custom Domain (Optional)

If you want to use a custom domain like `arafat-hasan.com`:

1. In the **Pages** settings, under **Custom domain**, enter: `arafat-hasan.com`
2. Click **Save**
3. Configure your DNS provider to point to GitHub Pages:
   - Add an `A` record pointing to GitHub's IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a `CNAME` record pointing to: `arafat-hasan.github.io`

### 3. Deploy Your Site

The GitHub Actions workflow is configured to run manually. To deploy:

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. Select **Deploy to GitHub Pages** workflow from the left sidebar
4. Click the **Run workflow** button (on the right side)
5. Select the branch (usually `main` or `master`)
6. Click **Run workflow**

The workflow will:
- Install dependencies
- Build your Astro site
- Deploy to GitHub Pages

### 4. Monitor Deployment

1. After triggering the workflow, you'll see it appear in the Actions tab
2. Click on the workflow run to see detailed logs
3. Wait for both the **build** and **deploy** jobs to complete (usually 1-2 minutes)
4. Once complete, your site will be live at:
   - Custom domain: https://arafathasan.com
   - Or GitHub Pages URL: https://arafat-hasan.github.io/arafat-hasan.com

## Workflow Configuration

The deployment workflow is located at `.github/workflows/deploy.yml` and includes:

- **Trigger**: Manual trigger via `workflow_dispatch`
- **Permissions**: Configured for GitHub Pages deployment
- **Build Job**: 
  - Checks out code
  - Sets up Node.js 20
  - Installs dependencies with `npm ci`
  - Builds the site with `npm run build`
  - Uploads the `dist` folder as an artifact
- **Deploy Job**: 
  - Deploys the artifact to GitHub Pages

## Local Testing Before Deployment

Before deploying, you can test the production build locally:

```bash
# Build the site
npm run build

# Preview the production build
npm run preview
```

This will start a local server (usually at http://localhost:4321) serving the production build.

## Troubleshooting

### Build Fails

- Check the Actions tab for error logs
- Ensure all dependencies are listed in `package.json`
- Test the build locally with `npm run build`

### Site Not Updating

- Clear your browser cache
- Wait a few minutes for CDN propagation
- Check if the workflow completed successfully

### 404 Errors

- Verify the `base` path in `astro.config.mjs` is set correctly
- For custom domains, use `base: '/'`
- For GitHub Pages without custom domain, use `base: '/arafat-hasan.com'`

### Custom Domain Not Working

- Verify DNS records are configured correctly
- Wait for DNS propagation (can take up to 24-48 hours)
- Check that HTTPS is enforced in GitHub Pages settings

## Making Updates

To update your site:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update portfolio content"
   git push origin main
   ```
3. Go to GitHub Actions and manually trigger the deployment workflow
4. Wait for deployment to complete

## Automatic Deployment (Optional)

If you want to automatically deploy on every push to main, modify `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

This will deploy automatically on push while still allowing manual triggers.

## Files Modified for GitHub Pages

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `astro.config.mjs` - Added `base: '/'` for proper routing

## Additional Resources

- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
