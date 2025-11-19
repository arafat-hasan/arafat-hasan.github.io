# Setup and Customization Guide

This guide will help you customize the portfolio website with your own information.

## Quick Setup Checklist

- [ ] Replace placeholder content in landing page
- [ ] Update About page with your information
- [ ] Add your resume PDF
- [ ] Update contact information
- [ ] Customize social media links
- [ ] Add your blog posts
- [ ] Update site metadata
- [ ] Test the build

## Step-by-Step Customization

### 1. Personal Information

#### Landing Page (`src/pages/index.astro`)

Replace the placeholder text with your own introduction:

```astro
<h1 class="text-5xl font-bold mb-6 text-gray-900">
  Hello, I'm [Your Name]
</h1>

<p class="text-xl text-gray-700 leading-relaxed mb-8">
  [Your personal introduction paragraph - describe who you are,
  what you do, and what you're passionate about]
</p>
```

#### About Page (`src/pages/about.astro`)

This should be generated from your resume. Replace all sections with your:
- Background
- Skills & Expertise
- Philosophy
- Interests

#### Resume Page (`src/pages/resume.astro`)

Update with your actual:
- Professional experience
- Education
- Skills
- Achievements

### 2. Resume PDF

Replace the placeholder file:

```bash
# Remove placeholder
rm public/resume.pdf

# Add your resume
cp /path/to/your/resume.pdf public/resume.pdf
```

### 3. Contact Information

#### Update Email (`src/pages/contact.astro`)

```astro
<a href="mailto:your-email@example.com">
  your-email@example.com
</a>
```

#### Update Social Links (`src/components/Footer.astro`)

```astro
<a href="https://github.com/your-username">GitHub</a>
<a href="https://linkedin.com/in/your-profile">LinkedIn</a>
<a href="mailto:your-email@example.com">Email</a>
```

### 4. Site Metadata

#### Update `astro.config.mjs`

```javascript
export default defineConfig({
  site: 'https://your-domain.com',
  // ... other config
});
```

#### Update `src/layouts/BaseLayout.astro`

Change the default description:

```astro
const {
  title,
  description = 'Your default site description'
} = Astro.props;
```

#### Update `src/components/Navbar.astro`

Change the site name:

```astro
<a href="/" class="text-xl font-semibold">
  Your Name
</a>
```

### 5. Blog Posts

#### Remove Example Posts

```bash
rm src/content/blog/*.md
```

#### Add Your Posts

Create new files in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
publishedAt: "2025-01-18"
description: "Brief description"
tags: ["tag1", "tag2"]
---

Your content here...
```

### 6. Styling Customization

#### Colors (`tailwind.config.mjs`)

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
},
```

#### Fonts

Update the Google Fonts import in `src/layouts/BaseLayout.astro`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Then update `tailwind.config.mjs`:

```javascript
fontFamily: {
  sans: ['YourFont', 'system-ui', 'sans-serif'],
},
```

### 7. Favicon

Replace `public/favicon.svg` with your own icon or create a new one.

## Testing Your Changes

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:4321` to see your changes.

### Build for Production

```bash
npm run build
```

This will create a `dist/` folder with all static files.

### Preview Production Build

```bash
npm run preview
```

## Content Writing Tips

### Blog Posts

- Use descriptive titles
- Include relevant tags
- Write clear descriptions for SEO
- Use proper Markdown formatting
- Add code blocks with syntax highlighting
- Include images in the `public/` folder

### SEO Optimization

- Write unique, descriptive titles for each page
- Keep descriptions between 150-160 characters
- Use semantic HTML headings (h1, h2, h3)
- Add alt text to images
- Use descriptive URLs (handled automatically by file names)

## Common Customizations

### Adding a New Page

1. Create `src/pages/new-page.astro`
2. Add navigation link in `src/components/Navbar.astro`
3. Use BaseLayout for consistency

### Changing Navigation

Edit the `navLinks` array in `src/components/Navbar.astro`:

```javascript
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Your Page', href: '/your-page' },
  // ... add more links
];
```

### Adding Analytics

Add your analytics script to `src/layouts/BaseLayout.astro` in the `<head>` section.

### Custom 404 Page

Create `src/pages/404.astro` for a custom not-found page.

## Troubleshooting

### Build Errors

- Check that all blog posts have required frontmatter fields
- Ensure TypeScript types are correct
- Verify all file paths are correct

### Styling Issues

- Clear browser cache
- Check Tailwind class names
- Verify font imports

### Content Not Showing

- Check file extensions (.md, .astro)
- Verify frontmatter format
- Check for `draft: true` in blog posts

## Next Steps

1. Test all pages thoroughly
2. Check responsive design on mobile
3. Verify all links work
4. Run a production build
5. Deploy to your hosting platform

## Getting Help

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Markdown Guide](https://www.markdownguide.org/)

Happy building!
