# Arafat Hasan - Portfolio Website

A minimalist, production-ready portfolio website showcasing software engineering expertise, multidisciplinary writing, cycling adventures, and travel photography. Built with Astro for blazing-fast performance and modern web standards.

## Features

### Core Functionality
- **Ultra-fast** - Static site generation with Astro
- **Multi-Domain Writing Platform** - 5 categories (Tech, Geo-Politics, Literature, Philosophy, Fiction)
- **Activities Section** - Cycling adventures with stats and photo galleries
- **Photo Gallery** - Travel photography with lightbox viewer
- **Minimalist Design** - Clean, professional aesthetic with Tailwind CSS
- **Fully Responsive** - Mobile-first design with hamburger menu
- **Accessible** - WCAG AA compliant, keyboard navigation
- **Secure** - Strict Content Security Policy (CSP), no inline scripts
- **SEO-Optimized** - Meta tags, Open Graph, sitemap
- **Type-Safe** - Full TypeScript coverage

### Technical Highlights
- **Zero build errors** - 51 TypeScript files, 0 errors
- **Fast builds** - Average build time ~2.5s
- **Minimal JavaScript** - Only ~10KB total JS
- **Modern architecture** - Component-based, modular design
- **Comprehensive documentation** - 11 detailed guides


## Project Structure

```
/
├── docs/                           # Comprehensive documentation
│   ├── DEPLOYMENT.md               # Deployment guide
│   ├── SETUP.md                    # Setup guide
│   └── performance-guide.md        # Performance optimization
├── public/
│   ├── _headers                    # CSP and security headers
│   ├── robots.txt                  # SEO configuration
│   ├── favicon.svg
│   ├── resume.pdf
│   └── images/
│       ├── activities/             # Activity photos
│       ├── gallery/                # Travel photography
│       │   ├── dhal-char/          # Collections
│       │   └── nepal-2025/
│       └── hero-portrait.jpg       # Homepage image
├── src/
│   ├── components/
│   │   ├── common/                 # Reusable components
│   │   │   ├── Card.astro
│   │   │   ├── Badge.astro
│   │   │   ├── Section.astro
│   │   │   ├── Empty.astro
│   │   │   └── SEO.astro
│   │   ├── writing/                # Writing components
│   │   │   ├── ReadingTime.astro
│   │   │   ├── WritingCard.astro
│   │   │   ├── WritingList.astro
│   │   │   └── CategoryFilter.astro
│   │   ├── activities/             # Activity components
│   │   │   ├── ActivityStats.astro
│   │   │   ├── ActivityCard.astro
│   │   │   └── ActivityGrid.astro
│   │   ├── gallery/                # Gallery components
│   │   │   ├── PhotoCard.astro
│   │   │   ├── PhotoGrid.astro
│   │   │   ├── Lightbox.astro
│   │   │   └── CollectionFilter.astro
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   └── ExternalLink.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro        # Core layout
│   │   ├── WritingLayout.astro     # Writing posts
│   │   └── ActivityLayout.astro    # Activity pages
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── resume.astro
│   │   ├── writing/                # Multi-domain writing
│   │   │   ├── index.astro         # All writing
│   │   │   ├── tech.astro
│   │   │   ├── geopolitics.astro
│   │   │   ├── literature.astro
│   │   │   ├── philosophy.astro
│   │   │   ├── fiction.astro
│   │   │   └── [...slug].astro     # Individual posts
│   │   ├── activities/             # Activities
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── gallery/                # Photo gallery
│   │       ├── index.astro
│   │       └── [collection].astro
│   ├── content/
│   │   ├── config.ts               # Content collections
│   │   ├── writing/                # Writing content
│   │   │   ├── tech/               # 4 posts
│   │   │   ├── geopolitics/
│   │   │   ├── literature/
│   │   │   ├── philosophy/
│   │   │   └── fiction/
│   │   ├── activities/             # 1 cycling adventure
│   │   └── gallery/                # 8 photos
│   │       ├── dhal-char/
│   │       └── nepal-2025/
│   ├── scripts/                    # External JS (CSP-compliant)
│   │   ├── navbar.ts
│   │   ├── dropdown.ts
│   │   ├── mobile-writing-toggle.ts
│   │   └── lightbox.ts
│   ├── styles/                     # External CSS
│   │   └── components/
│   │       ├── navbar.css
│   │       └── dropdown.css
│   ├── config/
│   │   └── constants.ts            # Site configuration
│   └── env.d.ts
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm**, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/arafat-hasan/arafat-hasan.github.io.git
cd arafat-hasan.github.io

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env with your actual values
# See Configuration section below
```

### Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
# Site Configuration
SITE_URL=https://arafathasan.com
SITE_TITLE=Arafat Hasan
SITE_DESCRIPTION=Software engineer specializing in resilient architectures and systems thinking...

# Google Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Social Profiles
MYGITHUB_URL=https://github.com/your-username/
LINKEDIN_URL=https://www.linkedin.com/in/your-profile/
TWITTER_URL=https://x.com/your-handle
STACKOVERFLOW_URL=https://stackoverflow.com/users/your-id/your-name
SUBSTACK_URL=https://substack.com/@your-handle
```

**Important:** 
- Never commit `.env` to version control (already in `.gitignore`)
- Update `.env.example` when adding new environment variables
- All values have fallback defaults in the code
```

### Development

```bash
# Start development server
npm run dev

# Visit http://localhost:4321
```

### Production Build

```bash
# Build static site
npm run build

# Preview production build
npm run preview
```

## Content Management

### Adding Writing Post

Create a new markdown file in `src/content/writing/{category}/`:

```markdown
---
title: "Your Post Title"
publishedAt: "2025-01-20"
description: "Brief description"
category: "tech"  # tech | geopolitics | literature | philosophy | fiction
tags: ["tag1", "tag2"]
draft: false  # Set to true to exclude from build and website
featured: false
url: "custom-url-slug"  # Optional: custom URL (default: uses filename)
---

Your content here in Markdown...
```

**Draft Mode:**
- Posts with `draft: true` will NOT appear in listings
- They will NOT have pages generated in the `dist` directory
- Useful for works-in-progress

**Custom URLs:**
- Use `url` field to specify a custom slug (e.g., `url: "my-article"`)
- The post will be accessible at `/writing/{category}/my-article`
- If omitted, the filename is used as the URL

**The post automatically:**
- Appears in `/writing` and `/writing/{category}`
- Gets its own page at `/writing/{category}/{slug}`
- Shows reading time
- Displays category badge

### Adding Activity

Create markdown file in `src/content/activities/`:

```markdown
---
title: "Activity Name"
description: "Brief description"
date: "2025-01-20"
activityType: "cycling"  # cycling | hiking | running | other
location: "City, Country"
distance: 50  # km (optional)
duration: "3h 15m"  # optional
elevation: 250  # meters (optional)
featuredImage: "/images/activities/photo.jpg"
images:  # optional gallery
  - "/images/activities/photo1.jpg"
tags: ["tag1"]
draft: false  # Set to true to exclude from build and website
url: "custom-activity-slug"  # Optional: custom URL (default: uses filename)
---

Your narrative here...
```

**Draft Mode:** Same as writing posts - activities with `draft: true` won't appear on the site.

**Custom URLs:** Use `url` field to customize the activity URL (e.g., `/activities/my-trip`).

### Adding Gallery Photos

Create JSON file in `src/content/gallery/{collection}/`:

```json
{
  "title": "Photo Title",
  "description": "Photo description",
  "date": "2025-01-20",
  "location": "City, Country",
  "collection": "Collection Name",
  "image": "/images/gallery/collection/photo.jpg",
  "alt": "Descriptive alt text",
  "featured": true
}
```

### Updating Pages

- **Homepage**: `src/pages/index.astro`
- **About**: `src/pages/about.astro`
- **Contact**: `src/pages/contact.astro`
- **Resume**: `src/pages/resume.astro`
- **Resume PDF**: `public/resume.pdf`

## Customization

### Site Configuration

**File:** `src/config/constants.ts`

```typescript
export const SITE_CONFIG = {
  name: 'Your Name',
  title: 'Your Title',
  description: 'Your description',
  url: 'https://yoursite.com',
};

export const WRITING_CATEGORIES = {
  // Configure writing categories
};
```

### Styling

The site uses **Tailwind CSS**:
- Modify `tailwind.config.mjs` for theme customization
- Edit component styles in `.astro` files
- Add global styles in `src/layouts/BaseLayout.astro`

### Navigation

**File:** `src/components/Navbar.astro`

Update `mainNavLinks` array to modify navigation.


### Build Settings

All platforms:
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 18+

## Performance

### Current Stats
- **Build Time:** ~2.5s
- **JavaScript:** ~10KB total
- **Pages:** 20 static pages
- **Lighthouse Targets:** 90+ across all metrics

### Optimization Tips

See `docs/performance-guide.md` for detailed recommendations:
- Image optimization (compress to <200KB)
- WebP format conversion
- Responsive images with srcset
- CDN integration

## Accessibility

### Features
- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation (full site)
- Skip-to-content link
- Color contrast WCAG AA
- `prefers-reduced-motion` support
- Screen reader friendly

See `docs/accessibility-audit.md` for full checklist.

## Security

### Content Security Policy

**File:** `public/_headers`

Strict CSP configured:
- No inline scripts or styles
- External scripts from `'self'` only
- Fonts from Google Fonts only

### Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`


## Tech Stack

- **[Astro](https://astro.build)** v4.x - Static site generator
- **[Tailwind CSS](https://tailwindcss.com)** v3.x - Utility-first CSS
- **[TypeScript](https://www.typescriptlang.org/)** v5.x - Type safety
- **Markdown** - Content management

## Build Output

```bash
npm run build
```

## 🧪 Testing

```bash
# Type check
npm run build

# Local preview
npm run preview

# Performance audit
npx lighthouse http://localhost:4321 --view
```

## Support & Contributing

### Issues & Questions
Open an issue on GitHub for:
- Bug reports
- Feature requests
- Documentation improvements


## License

MIT License - Feel free to use this template for your own portfolio!

See `LICENSE` file for details.

## Author

**Arafat Hasan**

Software engineer, multidisciplinary thinker and critic, outsider observer.

- **Website:** [arafathasan.com](https://arafathasan.com)
- **Email:** opendoor.arafat[at]gmail[dot]com
- **GitHub:** [@arafat-hasan](https://github.com/arafat-hasan)
- **LinkedIn:** [arafat-hasan](https://linkedin.com/in/arafat-hasan)

## Acknowledgments

Built with modern web technologies and best practices:
- Static site generation for performance
- Accessibility-first approach
- Security by design (CSP)
- Comprehensive documentation

---


_Last Updated: 2025-11-20_
