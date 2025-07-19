document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const dom = {
        mainNav: document.querySelector('.main-nav'),
        mobileMenuLinks: document.querySelector('.mobile-menu-links'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        hamburgerBtn: document.getElementById('hamburger-btn'),
        mobileMenu: document.getElementById('mobile-menu'),
        orderForm: document.getElementById('order-form'),
        formFeedback: document.getElementById('form-feedback'),
        mainImage: document.getElementById('main-image'),
        thumbnails: document.querySelectorAll('.thumbnail-gallery img'),
        scrollUpBtn: document.getElementById('scroll-up-btn'),
    };

    // --- FUNCTIONS ---
    
    // NEW: This function builds the mobile menu from the desktop menu
    const populateMobileMenu = () => {
        const navLinks = dom.mainNav.querySelectorAll('a');
        dom.mobileMenuLinks.innerHTML = ''; // Clear it first
        navLinks.forEach(link => {
            const newLink = document.createElement('a');
            newLink.href = link.href;
            newLink.textContent = link.textContent;
            dom.mobileMenuLinks.appendChild(newLink);
        });
    };

    // ... (Image Gallery, Order Form, Theme, etc. logic remains the same) ...
    const applyTheme = (theme) => { /* ... */ };
    function showFeedback(message, type) { /* ... */ }

    // --- EVENT LISTENERS ---
    dom.themeToggleBtn.addEventListener('click', () => { const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark'; applyTheme(newTheme); });
    dom.hamburgerBtn.addEventListener('click', () => { const isActive = dom.mobileMenu.classList.toggle('active'); dom.hamburgerBtn.textContent = isActive ? '✕' : '☰'; });
    
    // UPDATED: Event listener now targets the container
    dom.mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            dom.mobileMenu.classList.remove('active');
            dom.hamburgerBtn.textContent = '☰';
        }
    });
    
    if (dom.orderForm) { /* ... (This logic remains the same) */ }
    if (dom.mainImage) { /* ... (This logic remains the same) */ }
    
    dom.scrollUpBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', () => { dom.scrollUpBtn.classList.toggle('show', window.scrollY > 300); });
    
    // --- INITIALIZATION ---
    populateMobileMenu(); // Call the new function on page load
    const savedTheme = localStorage.getItem('theme')
