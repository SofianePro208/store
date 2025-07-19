document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const dom = {
        mainNav: document.querySelector('.main-nav'),
        mobileMenuLinks: document.querySelector('.mobile-menu-links'),
        searchForm: document.getElementById('search-form'),
        productGrid: document.getElementById('product-grid'),
        allProductCards: Array.from(document.querySelectorAll('#product-grid .product-card')),
        searchInput: document.getElementById('search-input'),
        noResultsMessage: document.getElementById('no-results-message'),
        prevPageBtn: document.getElementById('prev-page-btn'),
        nextPageBtn: document.getElementById('next-page-btn'),
        pageInfo: document.getElementById('page-info'),
        paginationControls: document.getElementById('pagination-controls'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        scrollUpBtn: document.getElementById('scroll-up-btn'),
        hamburgerBtn: document.getElementById('hamburger-btn'),
        mobileMenu: document.getElementById('mobile-menu'),
        contactForm: document.getElementById('contact-form'),
        contactFormFeedback: document.getElementById('contact-form-feedback')
    };

    // --- STATE ---
    let state = { currentPage: 1, productsPerPage: 4, filteredProducts: [] };

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

    const updateProductsDisplay = () => { /* ... (This function remains the same) */ };
    const applyTheme = (theme) => { /* ... (This function remains the same) */ };
    const observeElements = (selector, stagger = true) => { /* ... (This function remains the same) */ };
    function showContactFeedback(message, type) { /* ... (This function remains the same) */ }

    // --- EVENT LISTENERS ---
    dom.searchInput.addEventListener('input', () => { state.currentPage = 1; updateProductsDisplay(); });
    dom.searchForm.addEventListener('submit', (event) => { event.preventDefault(); state.currentPage = 1; updateProductsDisplay(); dom.searchInput.blur(); });
    dom.prevPageBtn.addEventListener('click', () => { if (state.currentPage > 1) { state.currentPage--; updateProductsDisplay(); } });
    dom.nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(state.filteredProducts.length / state.productsPerPage);
        if (state.currentPage < totalPages) { state.currentPage++; updateProductsDisplay(); }
    });
    dom.themeToggleBtn.addEventListener('click', () => { const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark'; applyTheme(newTheme); });
    dom.scrollUpBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', () => { dom.scrollUpBtn.classList.toggle('show', window.scrollY > 300); });
    dom.hamburgerBtn.addEventListener('click', () => { const isActive = dom.mobileMenu.classList.toggle('active'); dom.hamburgerBtn.textContent = isActive ? '✕' : '☰'; });
    
    // UPDATED: Event listener now targets the container
    dom.mobileMenu.addEventListener('click', (e) => { 
        if (e.target.tagName === 'A') { 
            dom.mobileMenu.classList.remove('active'); 
            dom.hamburgerBtn.textContent = '☰'; 
        } 
    });

    if (dom.contactForm) { /* ... (This logic remains the same) */ }

    // --- INITIALIZATION ---
    populateMobileMenu(); // Call the new function on page load
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    updateProductsDisplay();
    observeElements('.hero > *', true);
    observeElements('.product-card', true);
    observeElements('.feature-item', true);
    observeElements('.section-title', false);
    observeElements('.footer-column', true);
});
