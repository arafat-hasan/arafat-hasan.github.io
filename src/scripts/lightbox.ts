/**
 * Lightbox functionality for photo gallery (CSP-compliant)
 * Handles modal display, navigation, and keyboard shortcuts
 */

// Get DOM elements
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxLocation = document.getElementById('lightbox-location');
const lightboxDate = document.getElementById('lightbox-date');
const lightboxCurrent = document.getElementById('lightbox-current');
const lightboxTotal = document.getElementById('lightbox-total');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// Photo data
let photos: HTMLElement[] = [];
let currentIndex = 0;

/**
 * Initialize lightbox
 */
function initLightbox() {
    // Get all photo cards
    photos = Array.from(document.querySelectorAll('[data-photo-id]')) as HTMLElement[];

    if (photos.length === 0) return;

    // Update total count
    if (lightboxTotal) {
        lightboxTotal.textContent = photos.length.toString();
    }

    // Add click handlers to photo cards
    photos.forEach((photo, index) => {
        photo.addEventListener('click', () => openLightbox(index));
        photo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Add navigation handlers
    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', showPrevPhoto);
    lightboxNext?.addEventListener('click', showNextPhoto);

    // Click outside to close
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
}

/**
 * Open lightbox at specific photo index
 */
function openLightbox(index: number) {
    currentIndex = index;
    showPhoto(currentIndex);

    if (lightbox) {
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    // Focus on lightbox for keyboard navigation
    lightbox?.focus();
}

/**
 * Close lightbox
 */
function closeLightbox() {
    if (lightbox) {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

/**
 * Show specific photo
 */
function showPhoto(index: number) {
    if (index < 0 || index >= photos.length) return;

    const photo = photos[index];
    const src = photo.dataset.photoSrc || '';
    const title = photo.dataset.photoTitle || '';
    const alt = photo.dataset.photoAlt || '';
    const location = photo.dataset.photoLocation || '';
    const date = photo.dataset.photoDate || '';

    if (lightboxImage) {
        lightboxImage.src = src;
        lightboxImage.alt = alt;
    }

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxLocation) lightboxLocation.textContent = `📍 ${location}`;
    if (lightboxDate) lightboxDate.textContent = date;
    if (lightboxCurrent) lightboxCurrent.textContent = (index + 1).toString();

    currentIndex = index;
}

/**
 * Show previous photo
 */
function showPrevPhoto() {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    showPhoto(newIndex);
}

/**
 * Show next photo
 */
function showNextPhoto() {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    showPhoto(newIndex);
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboard(e: KeyboardEvent) {
    if (!lightbox || lightbox.classList.contains('hidden')) return;

    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPrevPhoto();
            break;
        case 'ArrowRight':
            showNextPhoto();
            break;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
} else {
    initLightbox();
}
