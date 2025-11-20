/**
 * Mobile writing submenu toggle (CSP-compliant)
 * Handles accordion-style submenu for writing categories on mobile
 */

const mobileWritingToggle = document.getElementById('mobile-writing-toggle');
const mobileWritingSubmenu = document.getElementById('mobile-writing-submenu');
const mobileWritingIcon = document.getElementById('mobile-writing-icon');

let isSubmenuOpen = false;

function toggleSubmenu() {
    isSubmenuOpen = !isSubmenuOpen;

    if (isSubmenuOpen) {
        mobileWritingToggle?.setAttribute('aria-expanded', 'true');
        mobileWritingSubmenu?.classList.remove('hidden');
        mobileWritingIcon?.classList.add('rotate-180');
    } else {
        mobileWritingToggle?.setAttribute('aria-expanded', 'false');
        mobileWritingSubmenu?.classList.add('hidden');
        mobileWritingIcon?.classList.remove('rotate-180');
    }
}

mobileWritingToggle?.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent menu close
    toggleSubmenu();
});
