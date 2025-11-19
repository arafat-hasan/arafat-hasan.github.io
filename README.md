# Arafat Hasan - Portfolio Website

A minimalistic, fast, and modern portfolio website built with Astro, featuring a blog, resume, and contact pages. All content is statically generated from Markdown files for optimal performance.

## Features

- **Ultra-fast static site generation** with Astro
- **Blog system** powered by Astro Content Collections
- **Minimalistic design** with Tailwind CSS
- **Fully responsive** layout
- **SEO-friendly** with proper meta tags
- **No JavaScript overhead** - pure static HTML
- **Type-safe** with TypeScript

## Project Structure

```
/
├── public/
│   ├── favicon.svg
│   └── resume.pdf          # Your PDF resume (replace placeholder)
├── src/
│   ├── components/
│   │   ├── Navbar.astro    # Site navigation
│   │   └── Footer.astro    # Site footer
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Base layout for all pages
│   │   └── BlogLayout.astro    # Layout for blog posts
│   ├── pages/
│   │   ├── index.astro         # Landing page
│   │   ├── about.astro         # About page
│   │   ├── contact.astro       # Contact page
│   │   ├── resume.astro        # Resume page
│   │   └── blog/
│   │       ├── index.astro         # Blog listing
│   │       └── [...slug].astro     # Individual blog posts
│   ├── content/
│   │   ├── config.ts           # Content collections config
│   │   └── blog/               # Blog posts (Markdown)
│   │       ├── getting-started-with-competitive-programming.md
│   │       ├── understanding-time-complexity.md
│   │       ├── building-scalable-web-applications.md
│   │       └── the-philosophy-of-clean-code.md
│   └── env.d.ts
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/arafat-hasan/arafat-hasan.com.git
cd arafat-hasan.com
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Building for Production

Build the static site:

```bash
npm run build
```

The built files will be in the `dist/` directory.

Preview the production build:

```bash
npm run preview
```

## Content Management

### Adding a New Blog Post

1. Create a new Markdown file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
publishedAt: "2025-01-18"
description: "A brief description of your post"
tags: ["tag1", "tag2"]
draft: false  # Set to true to hide from production
---

Your post content here in Markdown...
```

2. The post will automatically appear in the blog listing and have its own page at `/blog/your-post-slug`

### Updating Content

- **Landing page**: Edit `src/pages/index.astro`
- **About page**: Edit `src/pages/about.astro`
- **Contact page**: Edit `src/pages/contact.astro`
- **Resume page**: Edit `src/pages/resume.astro`
- **Resume PDF**: Replace `public/resume.pdf` with your actual resume

### Customization

#### Site Information

Update site information in:
- `astro.config.mjs` - Site URL and metadata
- `src/layouts/BaseLayout.astro` - Default page title and description
- `src/components/Navbar.astro` - Site name and navigation links
- `src/components/Footer.astro` - Footer links and social media

#### Styling

The site uses Tailwind CSS for styling. You can:
- Modify `tailwind.config.mjs` to customize colors, fonts, etc.
- Edit component styles directly in `.astro` files
- Add global styles in layouts

## Deployment

### GitHub Pages (Recommended)

This site is configured for easy deployment to GitHub Pages with GitHub Actions.

**Quick Start:**
1. Go to repository Settings → Pages → Source: Select "GitHub Actions"
2. Go to Actions tab → "Deploy to GitHub Pages" → Click "Run workflow"
3. Your site will be live at https://arafat-hasan.com

📖 **For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**

The deployment guide covers:
- GitHub Pages setup
- Custom domain configuration
- Manual and automatic deployment
- Troubleshooting common issues

### Other Platforms

The `dist/` folder contains all static files and can be deployed to:

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Other Options
- Cloudflare Pages
- AWS S3 + CloudFront
- Google Cloud Storage
- Any static hosting service

## Technology Stack

- **[Astro](https://astro.build)** - Static site generator
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **Markdown** - Content management

## License

MIT License - feel free to use this template for your own portfolio!

## Contact

- Email: opendoor.arafat[at]gmail[dot]com
- GitHub: [@arafat-hasan](https://github.com/arafat-hasan)
- LinkedIn: [arafat-hasan](https://linkedin.com/in/arafat-hasan)