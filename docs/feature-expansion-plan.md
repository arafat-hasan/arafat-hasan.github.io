# Portfolio Website Feature Expansion Plan

**Version:** 1.0  
**Date:** 2025-11-20  
**Author:** Product Planning  
**Status:** Draft for Review

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Feature Requirements](#feature-requirements)
4. [Information Architecture](#information-architecture)
5. [Technical Architecture](#technical-architecture)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Design Principles](#design-principles)
8. [Content Security Policy (CSP) Strategy](#content-security-policy-csp-strategy)
9. [File Structure](#file-structure)
10. [Component Design](#component-design)
11. [Development Phases](#development-phases)
12. [Testing & Quality Assurance](#testing--quality-assurance)
13. [Deployment Strategy](#deployment-strategy)
14. [Future Considerations](#future-considerations)

---

## Executive Summary

This document outlines a comprehensive plan to expand the portfolio website with four major content domains while maintaining the minimalist design philosophy and implementing strict security practices. The expansion includes:

- **Multi-domain Writing Platform**: Separating content into distinct categories (Software Engineering, Geo-Politics, Literature, Philosophy, Fiction)
- **Activities Section**: Showcasing cycling adventures and other physical activities
- **Gallery Section**: Displaying travel photography and experiences

**Key Principles:**
- Maintain minimal, clean design aesthetic
- Follow professional software engineering practices
- Implement strict Content Security Policy (no inline styles/scripts)
- Create modular, reusable components
- Ensure optimal performance and accessibility
- SEO-optimized for all content types

---

## Current State Analysis

### Existing Structure
```
Current Navigation: Home | Blog | About | Resume | Contact

Pages:
- index.astro (Landing page)
- about.astro (About page)
- resume.astro (Resume page)
- contact.astro (Contact page)
- blog/index.astro (Blog listing)
- blog/[...slug].astro (Individual blog posts)

Content:
- /src/content/blog/ (4 sample blog posts)
```

### Technical Stack
- **Framework:** Astro (Static Site Generation)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Content:** Markdown with Content Collections
- **Deployment:** GitHub Pages

### Strengths
✅ Clean, minimal design  
✅ Mobile responsive with hamburger menu  
✅ Good accessibility features  
✅ SEO-friendly structure  
✅ Fast performance (static generation)  
✅ TypeScript for type safety  

### Gaps to Address
❌ Single "Blog" category for all writing  
❌ No activities/adventures section  
❌ No photo gallery  
❌ Limited content organization for diverse topics  
❌ No inline script/style separation (CSP not fully implemented)  

---

## Feature Requirements

### 1. Multi-Domain Writing Platform

**Objective:** Separate different writing domains to help readers find content relevant to their interests.

**Writing Categories:**
1. **Tech** - Software engineering, programming, algorithms, system design
2. **Geo-Politics** - International relations, political analysis, current affairs
3. **Literature** - Book reviews, literary analysis, reading notes
4. **Philosophy** - Philosophical musings, ethical discussions, thought experiments
5. **Fiction** - Short stories, creative writing, narrative experiments

**Requirements:**
- Each category has its own listing page
- Shared blog post layout for consistency
- Tag system for cross-category themes
- Search/filter functionality (future enhancement)
- Reading time estimation
- Publication date display
- Draft mode support

### 2. Activities Section

**Objective:** Showcase physical activities, primarily cycling adventures.

**Content Types:**
- Cycling routes (100-200 km rides)
- Activity photos
- Route maps (future: GPX integration)
- Activity statistics (distance, elevation, date)
- Personal reflections/stories

**Requirements:**
- Activity cards with featured images
- Grid/list view
- Filter by activity type
- Chronological sorting
- Location information
- Markdown-based content for flexibility

### 3. Gallery Section

**Objective:** Display travel photography in an elegant, minimal gallery.

**Requirements:**
- Photo grid layout (masonry or grid)
- Image optimization (responsive images, lazy loading)
- Location tagging
- Date/caption support
- Lightbox view (accessible)
- Gallery collections (by trip/location)
- EXIF data preservation

---

## Information Architecture

### Proposed Navigation Structure

```
Primary Navigation:
┌─────────────────────────────────────────────────────────────┐
│ Home | Writing ▼ | Activities | Gallery | About | Resume | Contact │
└─────────────────────────────────────────────────────────────┘

Writing Dropdown (Desktop) / Sub-menu (Mobile):
├── All Writing
├── Tech
├── Geo-Politics
├── Literature
├── Philosophy
└── Fiction
```

### URL Structure

```
/                          → Home
/writing                   → All writing (unified view)
/writing/tech              → Tech posts
/writing/geopolitics       → Geo-politics posts
/writing/literature        → Literature posts
/writing/philosophy        → Philosophy posts
/writing/fiction           → Fiction posts
/writing/[category]/[slug] → Individual post
/activities                → Activities listing
/activities/[slug]         → Individual activity
/gallery                   → Photo gallery
/gallery/[collection]      → Gallery collection
/about                     → About page
/resume                    → Resume page
/contact                   → Contact page
```

### Site Map

```
Portfolio Website
│
├── Home
│   ├── Hero Section
│   ├── Featured Writing Highlights (3-4 recent from any category)
│   ├── Latest Activity Highlight
│   ├── Gallery Preview (3-4 recent photos)
│   └── Quick Links
│
├── Writing
│   ├── All Writing (combined feed)
│   ├── Tech
│   ├── Geo-Politics
│   ├── Literature
│   ├── Philosophy
│   └── Fiction
│
├── Activities
│   ├── Activity Grid
│   └── Individual Activity Pages
│
├── Gallery
│   ├── All Photos
│   └── Collections
│
├── About
├── Resume
└── Contact
```

---

## Technical Architecture

### Content Collections Schema

**New Collections:**

```typescript
// src/content/config.ts

import { defineCollection, z } from 'astro:content';

// Writing collection (replaces 'blog')
const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.string().transform((str) => new Date(str)),
    updatedAt: z.string().transform((str) => new Date(str)).optional(),
    category: z.enum(['tech', 'geopolitics', 'literature', 'philosophy', 'fiction']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

// Activities collection
const activities = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().transform((str) => new Date(str)),
    activityType: z.enum(['cycling', 'hiking', 'running', 'other']),
    location: z.string(),
    distance: z.number().optional(), // in km
    duration: z.string().optional(), // e.g., "4h 30m"
    elevation: z.number().optional(), // in meters
    featuredImage: z.string(),
    images: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    gpxFile: z.string().optional(), // future enhancement
  }),
});

// Gallery collection
const gallery = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().transform((str) => new Date(str)),
    location: z.string(),
    collection: z.string().optional(), // e.g., "Japan 2024", "Iceland 2023"
    image: z.string(),
    thumbnail: z.string().optional(),
    alt: z.string(),
    camera: z.string().optional(),
    settings: z.object({
      aperture: z.string().optional(),
      shutter: z.string().optional(),
      iso: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  'writing': writing,
  'activities': activities,
  'gallery': gallery,
};
```

### Component Architecture

**New Modular Components:**

```
src/components/
├── Navbar.astro                    (UPDATE: Add dropdown for Writing)
├── Footer.astro                    (EXISTING)
├── ExternalLink.astro              (EXISTING)
├── writing/
│   ├── WritingCard.astro           (Display writing preview)
│   ├── WritingList.astro           (List of writing cards)
│   ├── CategoryFilter.astro        (Filter by category)
│   └── ReadingTime.astro           (Calculate reading time)
├── activities/
│   ├── ActivityCard.astro          (Display activity preview)
│   ├── ActivityGrid.astro          (Grid of activities)
│   ├── ActivityStats.astro         (Stats display)
│   └── ActivityMap.astro           (Future: Map integration)
├── gallery/
│   ├── PhotoGrid.astro             (Masonry/grid layout)
│   ├── PhotoCard.astro             (Individual photo)
│   ├── Lightbox.astro              (Modal view)
│   └── CollectionFilter.astro      (Filter by collection)
└── common/
    ├── Card.astro                  (Reusable card component)
    ├── Badge.astro                 (Tags, categories)
    ├── Section.astro               (Page section wrapper)
    └── Empty.astro                 (Empty state component)
```

---

## Implementation Roadmap

### Phase 1: Foundation & Content Migration (Week 1)
**Goal:** Restructure content architecture and implement CSP

**Tasks:**
1. Create `docs/` directory and save this plan
2. Update content collections configuration
3. Migrate existing blog posts to `writing` collection
4. Implement CSP headers
5. Extract all inline styles to external CSS
6. Extract all inline scripts to external JavaScript files
7. Update `constants.ts` for new navigation
8. Create base component structure

**Deliverables:**
- ✅ Updated content schema
- ✅ CSP-compliant codebase
- ✅ Migrated content

### Phase 2: Writing Platform (Week 2)
**Goal:** Build multi-domain writing system

**Tasks:**
1. Create writing category pages
2. Build `WritingCard` component
3. Build `WritingList` component
4. Implement category filtering
5. Update navigation with dropdown
6. Create unified `/writing` page
7. Add reading time component
8. Update individual post pages

**Deliverables:**
- ✅ All 5 writing categories functional
- ✅ Navigation updated
- ✅ Category filtering working

### Phase 3: Activities Section (Week 3)
**Goal:** Implement activities showcase

**Tasks:**
1. Create activities content collection
2. Build `ActivityCard` component
3. Build `ActivityGrid` component
4. Create `/activities` listing page
5. Create individual activity page template
6. Add sample cycling activities
7. Implement image optimization

**Deliverables:**
- ✅ Activities section live
- ✅ At least 3 sample activities
- ✅ Responsive design

### Phase 4: Gallery Section (Week 4)
**Goal:** Build photo gallery

**Tasks:**
1. Create gallery content collection
2. Build `PhotoGrid` component
3. Build `PhotoCard` component
4. Implement image lazy loading
5. Create accessible lightbox
6. Add collection filtering
7. Optimize images for web
8. Create gallery data files

**Deliverables:**
- ✅ Gallery section live
- ✅ Lightbox functional
- ✅ Collection filtering working

### Phase 5: Homepage Integration (Week 5)
**Goal:** Update homepage to showcase all sections

**Tasks:**
1. Redesign homepage layout
2. Add featured writing section
3. Add latest activity highlight
4. Add gallery preview
5. Update quick links
6. Ensure mobile responsiveness

**Deliverables:**
- ✅ Updated homepage
- ✅ All sections integrated
- ✅ Mobile-friendly

### Phase 6: Polish & Testing (Week 6)
**Goal:** Final refinements and quality assurance

**Tasks:**
1. Performance optimization
2. Accessibility audit
3. SEO optimization for all pages
4. Cross-browser testing
5. Mobile device testing
6. Content validation
7. Documentation updates

**Deliverables:**
- ✅ 100% accessible
- ✅ High performance
- ✅ Documentation complete

---

## Design Principles

### Visual Design

**Minimalist Aesthetic:**
- Clean white/light gray backgrounds
- Generous whitespace
- Typography-focused design
- Subtle borders and dividers
- Limited color palette (grays + one accent)

**Typography:**
- Font: Inter (existing)
- Clear hierarchy (h1 → h6)
- Readable line length (max-w-4xl)
- Adequate line spacing

**Color Palette:**
```
Primary:
- Gray 900: #111827 (text, primary actions)
- Gray 700: #374151 (secondary text)
- Gray 600: #4B5563 (tertiary text)
- Gray 200: #E5E7EB (borders, dividers)
- Gray 100: #F3F4F6 (backgrounds)
- Gray 50:  #F9FAFB (subtle backgrounds)
- White:    #FFFFFF (main background)

Accent (optional, for badges/highlights):
- Blue 600: #2563EB (tech category)
- Red 600:  #DC2626 (geopolitics category)
- Purple 600: #9333EA (philosophy category)
- Green 600: #16A34A (literature category)
- Orange 600: #EA580C (fiction category)
```

**Layout Patterns:**
- Consistent max-width container (max-w-4xl)
- Grid layouts for cards (2-3 columns desktop, 1 column mobile)
- Subtle hover states
- Smooth transitions

### Interaction Design

**Navigation:**
- Desktop: Dropdown menu for "Writing" categories
- Mobile: Expandable accordion in hamburger menu
- Active state indicators
- Keyboard navigation support

**Cards:**
- Hover: Subtle shadow increase
- Focus: Visible outline
- Click area: Entire card
- Content preview: Title + description + metadata

**Images:**
- Lazy loading
- Blur-up effect
- Responsive sizes
- Alt text for all images

---

## Content Security Policy (CSP) Strategy

### CSP Headers

**Goal:** Strict CSP with no `unsafe-inline` for scripts or styles

**Recommended CSP:**
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data: https://fonts.gstatic.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### Implementation Strategy

**1. Extract Inline Styles:**
- Move all `<style>` blocks to external `.css` files
- Use CSS modules or scoped styles via Astro
- Tailwind classes are fine (compiled to external CSS)

**2. Extract Inline Scripts:**
- Move all `<script>` content to external `.js` or `.ts` files
- Use Astro's client-side script bundling
- Event handlers via JavaScript, not HTML attributes

**3. External Resources:**
- Google Fonts: Already external (allowed in CSP)
- Images: Self-hosted or via approved CDN
- No third-party analytics/tracking by default

**4. Configuration Files:**

**/public/_headers** (for Netlify/Cloudflare Pages):
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**/public/.htaccess** (for Apache/GitHub Pages with custom domain):
```apache
<IfModule mod_headers.c>
  Header set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  Header set X-Frame-Options "DENY"
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

---

## File Structure

### Proposed Directory Structure

```
/home/arafat/Work/github_personal/arafat-hasan.github.io/
├── public/
│   ├── favicon.svg
│   ├── resume.pdf
│   ├── og-image.jpg
│   ├── _headers                      (NEW - CSP headers)
│   ├── images/
│   │   ├── activities/               (NEW - Activity photos)
│   │   └── gallery/                  (NEW - Gallery photos)
│   └── scripts/
│       ├── navbar.js                 (NEW - External navbar script)
│       ├── lightbox.js               (NEW - Gallery lightbox)
│       └── accordion.js              (NEW - Mobile accordion)
├── src/
│   ├── components/
│   │   ├── Navbar.astro              (UPDATE)
│   │   ├── Footer.astro              (EXISTING)
│   │   ├── ExternalLink.astro        (EXISTING)
│   │   ├── writing/                  (NEW)
│   │   │   ├── WritingCard.astro
│   │   │   ├── WritingList.astro
│   │   │   ├── CategoryFilter.astro
│   │   │   └── ReadingTime.astro
│   │   ├── activities/               (NEW)
│   │   │   ├── ActivityCard.astro
│   │   │   ├── ActivityGrid.astro
│   │   │   └── ActivityStats.astro
│   │   ├── gallery/                  (NEW)
│   │   │   ├── PhotoGrid.astro
│   │   │   ├── PhotoCard.astro
│   │   │   ├── Lightbox.astro
│   │   │   └── CollectionFilter.astro
│   │   └── common/                   (NEW)
│   │       ├── Card.astro
│   │       ├── Badge.astro
│   │       ├── Section.astro
│   │       └── Empty.astro
│   ├── content/
│   │   ├── config.ts                 (UPDATE - New schemas)
│   │   ├── writing/                  (NEW - Replaces 'blog')
│   │   │   ├── tech/
│   │   │   ├── geopolitics/
│   │   │   ├── literature/
│   │   │   ├── philosophy/
│   │   │   └── fiction/
│   │   ├── activities/               (NEW)
│   │   │   └── [activity-slug].md
│   │   └── gallery/                  (NEW)
│   │       └── [photo-id].json
│   ├── layouts/
│   │   ├── BaseLayout.astro          (EXISTING)
│   │   ├── BlogLayout.astro          (UPDATE → WritingLayout.astro)
│   │   ├── ActivityLayout.astro      (NEW)
│   │   └── GalleryLayout.astro       (NEW)
│   ├── pages/
│   │   ├── index.astro               (UPDATE - New sections)
│   │   ├── about.astro               (EXISTING)
│   │   ├── resume.astro              (EXISTING)
│   │   ├── contact.astro             (EXISTING)
│   │   ├── writing/                  (NEW - Replaces 'blog')
│   │   │   ├── index.astro           (All writing)
│   │   │   ├── tech.astro
│   │   │   ├── geopolitics.astro
│   │   │   ├── literature.astro
│   │   │   ├── philosophy.astro
│   │   │   ├── fiction.astro
│   │   │   └── [...slug].astro       (Individual posts)
│   │   ├── activities/               (NEW)
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── gallery/                  (NEW)
│   │       ├── index.astro
│   │       └── [collection].astro    (Optional)
│   ├── styles/                       (NEW)
│   │   ├── components/
│   │   │   ├── navbar.css
│   │   │   ├── card.css
│   │   │   └── lightbox.css
│   │   └── global.css
│   ├── scripts/                      (NEW - External scripts)
│   │   ├── navbar.ts
│   │   ├── lightbox.ts
│   │   └── utils.ts
│   ├── config/
│   │   └── constants.ts              (UPDATE - New nav links)
│   └── utils/
│       ├── content.ts                (EXISTING)
│       └── images.ts                 (NEW - Image optimization)
├── docs/                             (NEW)
│   ├── feature-expansion-plan.md     (THIS FILE)
│   ├── content-migration.md          (Future)
│   └── deployment-guide.md           (Future)
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Component Design

### 1. Navigation Component Update

**File:** `src/components/Navbar.astro`

**Changes:**
- Add dropdown for "Writing" menu item
- Sub-items: All, Tech, Geo-Politics, Literature, Philosophy, Fiction
- Desktop: Hover dropdown
- Mobile: Accordion within hamburger menu
- Maintain CSP compliance (external scripts)

**Key Features:**
- Accessible (ARIA attributes)
- Keyboard navigable
- Active state for current category
- Smooth animations

---

### 2. Writing Components

#### WritingCard.astro
**Purpose:** Display a writing preview card

**Props:**
- `title: string`
- `description: string`
- `publishedAt: Date`
- `category: string`
- `slug: string`
- `tags: string[]`
- `featured?: boolean`

**Design:**
```
┌─────────────────────────────────────┐
│ [Category Badge]                    │
│ Title                               │
│ Description...                      │
│ 📅 Date  •  ⏱️ 5 min read           │
│ [tag1] [tag2]                       │
└─────────────────────────────────────┘
```

#### CategoryFilter.astro
**Purpose:** Filter writing by category

**Design:**
```
All  |  Tech  |  Geo-Politics  |  Literature  |  Philosophy  |  Fiction
            (active state underlined/bold)
```

---

### 3. Activities Components

#### ActivityCard.astro
**Purpose:** Display an activity preview

**Props:**
- `title: string`
- `description: string`
- `date: Date`
- `location: string`
- `distance?: number`
- `featuredImage: string`
- `slug: string`

**Design:**
```
┌─────────────────────────────────────┐
│  [Featured Image]                   │
│                                     │
├─────────────────────────────────────┤
│ 🚴 Cycling                          │
│ Title                               │
│ 📍 Location  •  📏 150 km           │
│ 📅 Date                             │
└─────────────────────────────────────┘
```

#### ActivityStats.astro
**Purpose:** Display activity statistics

**Props:**
- `distance?: number`
- `duration?: string`
- `elevation?: number`

**Design:**
```
┌──────────────────────────────────────┐
│  📏 Distance    ⏱️ Duration   ⛰️ Elevation │
│    150 km       4h 30m       850m    │
└──────────────────────────────────────┘
```

---

### 4. Gallery Components

#### PhotoGrid.astro
**Purpose:** Display photos in a responsive grid

**Design:**
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Masonry layout (optional)
- Lazy loading

#### Lightbox.astro
**Purpose:** Full-screen photo viewer

**Features:**
- Accessible (keyboard navigation, ESC to close)
- Previous/Next navigation
- Photo metadata display
- Click outside to close
- Focus trap

---

### 5. Common Components

#### Badge.astro
**Purpose:** Display tags, categories, activity types

**Variants:**
- Category badge (colored by category)
- Tag badge (neutral gray)
- Activity type badge

#### Card.astro
**Purpose:** Reusable card wrapper

**Props:**
- `href?: string` (makes entire card clickable)
- `padding?: string`
- `hover?: boolean`

---

## Development Phases

### Phase 1: Foundation (Estimated: 5-7 days)

**Day 1-2: Content Architecture**
- [ ] Update `src/content/config.ts` with new collections
- [ ] Create `src/content/writing/` directory structure
- [ ] Migrate existing blog posts to appropriate categories
- [ ] Create sample content for all categories

**Day 3-4: CSP Implementation**
- [ ] Create `src/styles/` directory
- [ ] Extract navbar styles to `src/styles/components/navbar.css`
- [ ] Extract navbar script to `src/scripts/navbar.ts`
- [ ] Update `Navbar.astro` to reference external assets
- [ ] Create `public/_headers` with CSP
- [ ] Test CSP compliance

**Day 5: Configuration Updates**
- [ ] Update `src/config/constants.ts` with new navigation
- [ ] Update README.md with new structure
- [ ] Create documentation in `docs/`

**Day 6-7: Base Components**
- [ ] Create `src/components/common/Card.astro`
- [ ] Create `src/components/common/Badge.astro`
- [ ] Create `src/components/common/Section.astro`
- [ ] Create `src/components/common/Empty.astro`

---

### Phase 2: Writing Platform (Estimated: 7-10 days)

**Day 1-3: Writing Components**
- [ ] Create `WritingCard.astro`
- [ ] Create `WritingList.astro`
- [ ] Create `CategoryFilter.astro`
- [ ] Create `ReadingTime.astro`
- [ ] Test components with sample data

**Day 4-5: Writing Pages**
- [ ] Create `/src/pages/writing/index.astro` (all writing)
- [ ] Create `/src/pages/writing/tech.astro`
- [ ] Create `/src/pages/writing/geopolitics.astro`
- [ ] Create `/src/pages/writing/literature.astro`
- [ ] Create `/src/pages/writing/philosophy.astro`
- [ ] Create `/src/pages/writing/fiction.astro`

**Day 6-7: Individual Writing Page**
- [ ] Rename `BlogLayout.astro` to `WritingLayout.astro`
- [ ] Update layout with category badge
- [ ] Create `/src/pages/writing/[...slug].astro`
- [ ] Add breadcrumb navigation
- [ ] Add related posts section (same category)

**Day 8-9: Navigation Update**
- [ ] Update `Navbar.astro` with dropdown
- [ ] Create dropdown styles (external CSS)
- [ ] Create dropdown script (external JS)
- [ ] Mobile: Add accordion for writing sub-menu
- [ ] Test accessibility

**Day 10: Testing & Polish**
- [ ] Cross-browser testing
- [ ] Mobile responsive testing
- [ ] Accessibility audit
- [ ] Performance check

---

### Phase 3: Activities Section (Estimated: 6-8 days)

**Day 1-2: Activities Components**
- [ ] Create `ActivityCard.astro`
- [ ] Create `ActivityGrid.astro`
- [ ] Create `ActivityStats.astro`
- [ ] Test components

**Day 3-4: Activities Pages**
- [ ] Create `ActivityLayout.astro`
- [ ] Create `/src/pages/activities/index.astro`
- [ ] Create `/src/pages/activities/[...slug].astro`
- [ ] Add image optimization

**Day 5-6: Sample Content**
- [ ] Create 3-5 sample cycling activities
- [ ] Optimize activity images
- [ ] Add to `/src/content/activities/`

**Day 7-8: Testing & Polish**
- [ ] Mobile testing
- [ ] Image loading performance
- [ ] Accessibility check

---

### Phase 4: Gallery Section (Estimated: 8-10 days)

**Day 1-3: Gallery Components**
- [ ] Create `PhotoGrid.astro`
- [ ] Create `PhotoCard.astro`
- [ ] Create `CollectionFilter.astro`
- [ ] Test grid layouts

**Day 4-6: Lightbox Implementation**
- [ ] Create `Lightbox.astro`
- [ ] Create `src/scripts/lightbox.ts` (external, CSP-compliant)
- [ ] Create `src/styles/components/lightbox.css`
- [ ] Implement keyboard navigation
- [ ] Add touch gestures (swipe)
- [ ] Test accessibility

**Day 7-8: Gallery Pages**
- [ ] Create `/src/pages/gallery/index.astro`
- [ ] Create `/src/pages/gallery/[collection].astro` (optional)
- [ ] Implement lazy loading
- [ ] Add collection filtering

**Day 9-10: Image Optimization & Content**
- [ ] Create image optimization utility
- [ ] Generate responsive images
- [ ] Create sample gallery data
- [ ] Add 15-20 sample photos

---

### Phase 5: Homepage Integration (Estimated: 4-5 days)

**Day 1-2: Homepage Redesign**
- [ ] Update hero section
- [ ] Add featured writing section (latest 3-4 from all categories)
- [ ] Add latest activity highlight
- [ ] Add gallery preview (3-4 recent photos)

**Day 3: Quick Links Update**
- [ ] Update quick links section
- [ ] Add links to writing categories
- [ ] Add link to activities
- [ ] Add link to gallery

**Day 4-5: Testing & Polish**
- [ ] Mobile responsive testing
- [ ] Performance optimization
- [ ] Cross-browser testing

---

### Phase 6: Polish & Testing (Estimated: 5-7 days)

**Day 1-2: Performance Optimization**
- [ ] Run Lighthouse audit
- [ ] Optimize images (WebP, responsive sizes)
- [ ] Minimize JavaScript
- [ ] Review bundle size
- [ ] Implement caching strategies

**Day 3: Accessibility Audit**
- [ ] WCAG 2.1 AA compliance check
- [ ] Screen reader testing
- [ ] Keyboard navigation testing
- [ ] Color contrast verification
- [ ] Focus indicator review

**Day 4: SEO Optimization**
- [ ] Meta tags for all pages
- [ ] Open Graph images
- [ ] Sitemap generation
- [ ] robots.txt update
- [ ] Structured data (JSON-LD)

**Day 5: Cross-browser Testing**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

**Day 6: Documentation**
- [ ] Update README.md
- [ ] Create content creation guides
- [ ] Document component APIs
- [ ] Update deployment guide

**Day 7: Final Review**
- [ ] Code review
- [ ] Content review
- [ ] Final testing

---

## Testing & Quality Assurance

### Performance Targets
- **Lighthouse Score:** 95+ (all categories)
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1

### Accessibility Targets
- **WCAG 2.1 Level:** AA compliance
- **Screen Reader:** Full support
- **Keyboard Navigation:** 100% operable
- **Color Contrast:** 4.5:1 minimum

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Testing Checklist

**Functionality:**
- [ ] All links work
- [ ] Navigation functional on desktop/mobile
- [ ] Dropdown menus work
- [ ] Forms submit correctly
- [ ] Search/filter works (if implemented)
- [ ] Lightbox opens/closes properly

**Responsive Design:**
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1440px+)

**Content:**
- [ ] All images load
- [ ] Alt text present
- [ ] No broken links
- [ ] No typos
- [ ] Dates formatted correctly

**SEO:**
- [ ] Meta descriptions present
- [ ] Page titles unique
- [ ] Open Graph tags
- [ ] Sitemap generated
- [ ] robots.txt correct

---

## Deployment Strategy

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Performance targets met
- [ ] Accessibility compliance verified
- [ ] CSP headers configured
- [ ] Images optimized
- [ ] Documentation updated

### Deployment Steps
1. Build production bundle (`npm run build`)
2. Test production build locally (`npm run preview`)
3. Commit changes to main branch
4. Push to GitHub
5. Trigger GitHub Actions deployment
6. Verify live site
7. Monitor for errors

### Post-Deployment Verification
- [ ] Homepage loads correctly
- [ ] All writing categories accessible
- [ ] Activities section functional
- [ ] Gallery loads properly
- [ ] Navigation works on mobile
- [ ] CSP not blocking resources
- [ ] Analytics tracking (if enabled)

---

## Future Considerations

### Phase 7 (Future Enhancements)

**Search Functionality:**
- Full-text search across all writing
- Filter by tags, category, date
- Fuzzy search support

**Activity Map Integration:**
- GPX file upload
- Interactive route maps (Mapbox/Leaflet)
- Elevation profiles
- Route statistics

**Gallery Enhancements:**
- EXIF data display
- Photo editing metadata
- Download options
- Sharing functionality

**Writing Enhancements:**
- Reading progress indicator
- Table of contents (auto-generated)
- Code syntax highlighting
- Footnotes support
- Series/multi-part posts

**Social Features:**
- RSS feeds per category
- Newsletter subscription
- Social sharing buttons
- Comments (optional, static-friendly)

**Analytics:**
- Privacy-focused analytics (Plausible/Umami)
- Reading time tracking
- Popular posts widget

**Internationalization:**
- Multi-language support
- Language switcher
- Translated content

---

## Conclusion

This plan provides a comprehensive, phased approach to expanding your portfolio website while maintaining its minimalist aesthetic and implementing professional software engineering practices. The modular component architecture, strict CSP compliance, and focus on performance and accessibility ensure the website will be both beautiful and functional.

### Key Success Metrics
- ✅ Minimal, clean design maintained
- ✅ Strict CSP implemented (no inline styles/scripts)
- ✅ Modular, reusable components
- ✅ Professional code organization
- ✅ High performance (Lighthouse 95+)
- ✅ Fully accessible (WCAG 2.1 AA)
- ✅ SEO-optimized
- ✅ Mobile-responsive

### Next Steps
1. **Review this plan** with stakeholders
2. **Prioritize phases** based on content availability
3. **Set up development environment** with new structure
4. **Begin Phase 1** implementation
5. **Iterate and refine** based on feedback

---

**Questions? Feedback?**  
This plan is a living document and should be updated as requirements evolve and new insights emerge during development.

**Document Version Control:**
- v1.0 (2025-11-20): Initial plan created
