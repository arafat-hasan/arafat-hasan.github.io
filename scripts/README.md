# Scripts

This directory contains automation scripts for the project.

## Available Scripts

### `optimize-images.mjs`

Optimizes all images in the `public/images/` directory:

- **Resizes** large images to max 1920x1920 pixels
- **Compresses** JPEGs and PNGs (85% quality)
- **Generates** WebP versions automatically
- **Reports** savings and statistics

**Usage:**
```bash
npm run optimize-images
```

**When to run:**
- Before committing new images
- After adding gallery or activity photos
- Automatically runs in CI/CD pipeline

**Important:**
- Backs up originals to `.tmp` files during processing
- Only replaces if optimized version is smaller
- Always generates WebP versions
- Safe to run multiple times (idempotent)

---

## Performance Benefits

Running image optimization typically results in:
- **50-80% size reduction** on unoptimized images
- **Faster page loads** (improved LCP)
- **Lower bandwidth** costs
- **Better Core Web Vitals** scores

---

## CI/CD Integration

These scripts are automatically executed in the GitHub Actions workflow during deployment. No manual intervention required for production builds.
