# Bug Fixes - Post Phase 4

**Date:** 2025-11-20  
**Issues Fixed:** 2

---

## Issue 1: Gallery Collection Pages 404 ❌→✅

### Problem
When clicking on a collection filter (e.g., "Bangladesh 2024"), the URL `/gallery/bangladesh-2024` resulted in a 404 error.

### Root Cause
The `CollectionFilter` component was generating links to collection pages, but no dynamic route existed to handle those URLs.

### Solution
Created `/src/pages/gallery/[collection].astro` - a dynamic route that:
- Generates static paths for each unique collection
- Filters photos by collection
- Displays collection-specific photos
- Maintains the collection filter navigation
- Shows photo count for the collection

### Files Created
- `src/pages/gallery/[collection].astro`

### Routes Now Generated
- `/gallery/bangladesh-2024` (2 photos)
- `/gallery/nepal-2024` (1 photo)

### Testing
✅ Clicking "Bangladesh 2024" → Shows 2 photos  
✅ Clicking "Nepal 2024" → Shows 1 photo  
✅ Clicking "All" → Shows all 3 photos  
✅ Active tab highlights correctly  

---

## Issue 2: Writing Posts Double Category in URL ❌→✅

### Problem
Clicking on a writing post generated incorrect URLs with duplicated category:
- ❌ Expected: `/writing/tech/getting-started-with-competitive-programming`
- ❌ Actual: `/writing/tech/tech/getting-started-with-competitive-programming`
- Result: 404 error

### Root Cause
In Astro, when content files are nested in directories like:
```
src/content/writing/tech/post-name.md
```

The `post.slug` value already includes the directory path: `tech/post-name`

The `WritingCard` component was building URLs as:
```javascript
const url = `/writing/${category}/${slug}`;
//                    ↑tech     ↑tech/post-name
//  Result: /writing/tech/tech/post-name ❌
```

### Solution
Updated `WritingCard.astro` to use the slug directly since it already contains the category:
```javascript
// Before (incorrect):
const url = `/writing/${category}/${slug}`;

// After (correct):
const url = `/writing/${slug}`;
```

### Files Modified
- `src/components/writing/WritingCard.astro`

### Routes Now Working
✅ `/writing/tech/getting-started-with-competitive-programming`  
✅ `/writing/tech/building-scalable-web-applications`  
✅ `/writing/tech/the-philosophy-of-clean-code`  
✅ `/writing/tech/understanding-time-complexity`  

### Testing
✅ All tech posts clickable from `/writing/tech`  
✅ All posts clickable from `/writing` (all categories)  
✅ Correct URLs generated in cards  
✅ No 404 errors  

---

## Build Results

**Before Fixes:**
- Gallery collections: 404 errors
- Writing posts: 404 errors
- User experience: Broken

**After Fixes:**
```
✅ 52 files checked (0 errors, 0 warnings)
✅ 25 pages generated in 3.21s
✅ All links functional
```

**New Routes Added:**
- `/gallery/bangladesh-2024/` (+1)
- `/gallery/nepal-2024/` (+1)

**Total Pages:** 25 (up from 23)

---

## Lessons Learned

### 1. Astro Content Collections & Slugs
Astro's `slug` property includes the **full directory path** from the collection root:
```
Content: src/content/writing/tech/post.md
Slug:    tech/post (NOT just "post")
```

**Implication:** When building URLs, avoid adding the category again if the slug already contains it.

### 2. Dynamic Routes Require Explicit Creation
Static Site Generators like Astro don't automatically create routes for filtered views. Even if you have filtering UI (like `CollectionFilter`), you must:
1. Create the dynamic route file (`[param].astro`)
2. Implement `getStaticPaths()` to generate all possible paths
3. Filter data appropriately in the component

### 3. Testing All Click Paths
Important to test:
- Direct navigation (typing URLs)
- Clicking from index pages
- Clicking from filtered views
- Mobile vs. desktop navigation

---

## Code Changes Summary

### Added Files (1)
```
src/pages/gallery/[collection].astro
```

### Modified Files (1)
```
src/components/writing/WritingCard.astro
  - Line 41: Changed URL building logic
  - Removed duplicate category in path
```

---

## Verification Checklist

✅ Gallery index page loads (`/gallery`)  
✅ Gallery collection pages load (`/gallery/bangladesh-2024`, `/gallery/nepal-2024`)  
✅ Collection filter tabs work correctly  
✅ Active collection highlights properly  
✅ Writing index page loads (`/writing`, `/writing/tech`, etc.)  
✅ Individual writing posts load with correct URLs  
✅ All writing cards link to correct destinations  
✅ No duplicate categories in URLs  
✅ Build completes with 0 errors, 0 warnings  
✅ All 25 pages generated successfully  

---

## Impact

### User Experience
- ✅ **Gallery:** Users can now browse by collection
- ✅ **Writing:** All posts are clickable and load correctly
- ✅ **Navigation:** Seamless browsing experience

### Developer Experience
- ✅ **Clean URLs:** Proper URL structure
- ✅ **Maintainable:** Clear separation of concerns
- ✅ **Scalable:** Easy to add more collections/categories

### SEO
- ✅ **Proper URLs:** SEO-friendly, descriptive paths
- ✅ **No 404s:** All internal links work
- ✅ **Collection Pages:** Separate pages for each collection (good for SEO)

---

## Status

**Both Issues: ✅ RESOLVED**

The website now functions correctly with:
- 25 working pages
- Proper URL structure
- No 404 errors
- Complete navigation functionality

Ready to proceed with Phase 5 (Homepage Integration)!
