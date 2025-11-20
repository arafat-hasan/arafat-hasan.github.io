# Performance Optimization Guide

**Project:** Arafat Hasan Portfolio  
**Target:** Lighthouse Score 90+  
**Date:** 2025-11-20

---

## 📊 Current Performance

Build stats:
- **Pages:** 20
- **Build Time:** ~2.5s
- **TypeScript Files:** 52 (0 errors)

---

## ✅ Implemented Optimizations

### 1. Static Site Generation
- ✅ All pages pre-rendered at build time
- ✅ No client-side JavaScript rendering
- ✅ Fast Time to First Byte (TTFB)

### 2. Image Optimization
- ✅ Lazy loading on non-critical images
- ✅ Aspect ratio boxes prevent layout shift
- ✅ WebP format support ready

**Current Status:**
```astro
<!-- Gallery & Activity Cards -->
<img loading="lazy" />

<!-- Aspect ratio preservation -->
<div class="aspect-square">
<div class="aspect-video">
```

### 3. CSS Optimization
- ✅ Tailwind CSS with purging
- ✅ External CSS files (no inline styles)
- ✅ Minimal critical CSS
- ✅ No unused styles in production

### 4. JavaScript Optimization
- ✅ Minimal JavaScript usage
- ✅ External scripts (CSP-compliant)
- ✅ No heavy frameworks
- ✅ TypeScript for type safety

**JavaScript Files:**
- `navbar.ts` - Navigation (3KB)
- `dropdown.ts` - Writing menu (2KB)
- `mobile-writing-toggle.ts` - Mobile menu (1KB)
- `lightbox.ts` - Gallery viewer (4KB)

**Total JS:** ~10KB (excellent!)

### 5. Font Loading
- ✅ Google Fonts with preconnect
- ✅ Font display: swap

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

---

## 🔧 Recommended Optimizations

### High Priority

#### 1. Image Optimization
**Current:** Images are in original format and size  
**Recommended:** Optimize and convert to WebP

```bash
# Install sharp for image processing
npm install -D @astrojs/image

# Or use external tools
npm install -D imagemin imagemin-webp
```

**Action Items:**
- Resize images to appropriate dimensions
- Convert to WebP format
- Implement responsive images with `srcset`

#### 2. Add Resource Hints
**In BaseLayout.astro:**
```html
<!-- Preload critical assets -->
<link rel="preload" as="image" href="/images/hero-portrait.jpg">

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

#### 3. Implement Critical CSS
Extract above-the-fold CSS and inline it:
```html
<style>
  /* Critical CSS for hero section */
  .hero { /* ...  */ }
</style>
```

### Medium Priority

#### 4.Add Service Worker (PWA)
Make site work offline:
```bash
npm install -D @vite-pwa/astro
```

#### 5. Code Splitting
Astro already does this, but verify:
```bash
# Check bundle sizes
npm run build && ls -lh dist/_astro/
```

#### 6. Compress Images
**Current image sizes (estimate):**
- Gallery photos: ~2-3MB each (too large!)
- Activity photos: ~1-2MB each

**Target:**
- Gallery photos: <200KB each
- Activity photos: <300KB each

**Tools:**
```bash
# Compress JPEGs
npx imagemin "public/images/**/*.{jpg,jpeg}" --plugin=mozjpeg > compressed/

# Convert to WebP
npx imagemin "public/images/**/*.{jpg,jpeg}" --plugin=webp > webp/
```

### Low Priority

#### 7. HTTP/2 Push
Configure server to push critical resources.

#### 8. CDN Integration
Serve static assets from CDN.

#### 9. Bundle Analysis
Identify any large dependencies:
```bash
npx vite-bundle-visualizer
```

---

## 🎯 Performance Targets

### Lighthouse Scores (Target: 90+)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Performance | 90+ | TBD | 🔄 |
| Accessibility | 95+ | 95+ | ✅ |
| Best Practices | 95+ | TBD | 🔄 |
| SEO | 100 | 100 | ✅ |

### Core Web Vitals

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | <2.5s | Largest Contentful Paint |
| FID | <100ms | First Input Delay |
| CLS | <0.1 | Cumulative Layout Shift |

**Current Status:** Likely good due to static generation, but needs testing.

---

## 📝 Testing Commands

```bash
# Build production bundle
npm run build

# Analyze bundle size
npx vite-bundle-visualizer

# Run Lighthouse
npx lighthouse https://arafathasan.com --view

# Test local build
npx serve dist
npx lighthouse http://localhost:3000 --view

# Check image sizes
du -sh public/images/**/*
```

---

## 🖼️ Image Optimization Script

Create `scripts/optimize-images.sh`:

```bash
#!/bin/bash

# Optimize JPEGs
find public/images -name "*.jpg" -o -name "*.jpeg" | while read img; do
  echo "Optimizing $img..."
  # Resize to max 1920px width, 85% quality
  convert "$img" -resize '1920x1920>' -quality 85 "$img"
done

# Convert to WebP
find public/images -name "*.jpg" -o -name "*.jpeg" | while read img; do
  echo "Converting $img to WebP..."
  cwebp -q 85 "$img" -o "${img%.*}.webp"
done
```

---

## ✅ Quick Wins (Immediate)

1. **Compress existing images**
   ```bash
   # Use TinyPNG, ImageOptim, or similar
   ```

2. **Add width/height to images**
   ```astro
   <img width="800" height="600" ... />
   ```

3. **Defer non-critical JavaScript**
   ```html
   <script defer src="..."></script>
   ```

4. **Add meta tags for performance**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
   ```

---

## 🎓 Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web.dev Performance](https://web.dev/performance/)
- [ImageOptim](https://imageoptim.com/)
- [Squoosh](https://squoosh.app/) - Online image optimizer
- [WebPageTest](https://www.webpagetest.org/)

---

## 📊 Performance Checklist

### Build
- [x] Production build generates optimized assets
- [x] No console errors in build
- [x] Tailwind CSS purged
- [x] Images optimized (automated via CI/CD)

### Runtime
- [x] Lazy loading images
- [x] Minimal JavaScript
- [x] No render-blocking resources
- [x] Fast font loading

### Deployment
- [x] Gzip/Brotli compression enabled (via _headers)
- [x] Cache headers set (1-year for static assets)
- [x] Image optimization automated (Sharp in CI/CD)
- [x] Lighthouse CI integrated
- [x] Bundle size analysis in CI
- [ ] SSL/HTTPS enabled (GitHub Pages default)
- [ ] CDN configured (GitHub Pages CDN)

---

**Status:** Performance foundation is solid. ✅ **Image optimization, Lighthouse CI, and bundle analysis are now automated in GitHub Actions!**

**See:** [PERFORMANCE-CI.md](PERFORMANCE-CI.md) for full implementation details.

**Recommendation:** Run the automated pipeline on next deployment to verify all optimizations are working.
