/**
 * Navigation dropdown functionality (CSP-compliant)
 * Handles desktop dropdown menu for writing categories
 */

// Desktop dropdown functionality
const writingMenuButton = document.getElementById('writing-menu-button');
const writingDropdown = document.getElementById('writing-dropdown');

let isDropdownOpen = false;
let closeTimeout: ReturnType<typeof setTimeout>;

function openDropdown() {
    clearTimeout(closeTimeout);
    isDropdownOpen = true;
    writingMenuButton?.setAttribute('aria-expanded', 'true');
    writingDropdown?.classList.remove('hidden');
    writingDropdown?.classList.add('animate-fadeIn');
}

function closeDropdown(immediate = false) {
    if (immediate) {
        clearTimeout(closeTimeout);
        performClose();
    } else {
        closeTimeout = setTimeout(performClose, 200);
    }
}

function performClose() {
    isDropdownOpen = false;
    writingMenuButton?.setAttribute('aria-expanded', 'false');
    writingDropdown?.classList.add('hidden');
    writingDropdown?.classList.remove('animate-fadeIn');
}

// Mouse events for desktop dropdown
writingMenuButton?.addEventListener('mouseenter', openDropdown);
writingMenuButton?.addEventListener('mouseleave', () => closeDropdown());
writingDropdown?.addEventListener('mouseenter', openDropdown);
writingDropdown?.addEventListener('mouseleave', () => closeDropdown());

// Click event for button
writingMenuButton?.addEventListener('click', (e) => {
    e.preventDefault();
    if (isDropdownOpen) {
        closeDropdown(true);
    } else {
        openDropdown();
    }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDropdownOpen) {
        closeDropdown(true);
    }
});

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (isDropdownOpen &&
        !writingMenuButton?.contains(e.target as Node) &&
        !writingDropdown?.contains(e.target as Node)) {
        closeDropdown(true);
    }
});
