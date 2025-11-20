/**
 * Mobile navigation menu functionality
 * Handles hamburger menu toggle, keyboard navigation, and responsive behavior
 */

// Get DOM elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuPanel = document.getElementById('mobile-menu-panel');

let isMenuOpen = false;

/**
 * Toggle mobile menu open/close
 */
function toggleMenu() {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        // Open menu
        mobileMenuButton?.classList.add('menu-open');
        mobileMenuButton?.setAttribute('aria-expanded', 'true');
        mobileMenu?.classList.remove('pointer-events-none', 'opacity-0');
        mobileMenu?.setAttribute('aria-hidden', 'false');
        mobileMenuPanel?.classList.remove('translate-x-full');
        document.body.classList.add('menu-open');
    } else {
        // Close menu
        mobileMenuButton?.classList.remove('menu-open');
        mobileMenuButton?.setAttribute('aria-expanded', 'false');
        mobileMenu?.classList.add('pointer-events-none', 'opacity-0');
        mobileMenu?.setAttribute('aria-hidden', 'true');
        mobileMenuPanel?.classList.add('translate-x-full');
        document.body.classList.remove('menu-open');
    }
}

// Toggle menu on button click
mobileMenuButton?.addEventListener('click', toggleMenu);

// Close menu when clicking on the backdrop
mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        toggleMenu();
    }
});

// Close menu when clicking on a link
const mobileMenuLinks = mobileMenuPanel?.querySelectorAll('a');
mobileMenuLinks?.forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    });
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
    }
});

// Handle window resize - close menu if resizing to desktop
let resizeTimer: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 768 && isMenuOpen) {
            toggleMenu();
        }
    }, 250);
});
