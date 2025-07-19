document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const dom = {
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
        contactFormFeedback: document.getElementById('contact-form-feedback'),
        productsSection: document.getElementById('products') // <-- FIX: Added a reference to the section
    };

    // --- STATE ---
    let state = {
        currentPage: 1,
        productsPerPage: 4,
        filteredProducts: []
    };

    // --- FUNCTIONS ---
    const updateProductsDisplay = () => {
        const { currentPage, productsPerPage } = state;
        const searchTerm = dom.searchInput.value.toLowerCase();
        state.filteredProducts = dom.allProductCards.filter(card => card.querySelector('h3').textContent.toLowerCase().includes(searchTerm));
        
        const hasResults = state.filteredProducts.length > 0;
        dom.productGrid.style.display = hasResults ? 'grid' : 'none';
        dom.noResultsMessage.style.display = hasResults ? 'none' : 'block';
        
        const totalPages = Math.ceil(state.filteredProducts.length / productsPerPage);
        dom.paginationControls.style.display = totalPages > 1 ? 'flex' : 'none';
        
        dom.allProductCards.forEach(card => card.style.display = 'none');
        
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = state.filteredProducts.slice(startIndex, endIndex);
        
        productsToShow.forEach(card => { card.style.display = 'flex'; });
        
        if (totalPages > 0) {
            dom.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
        
        dom.prevPageBtn.disabled = currentPage === 1;
        dom.nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    };

    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        dom.themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    };

    const observeElements = (selector, stagger = true) => {
        const elements = document.querySelectorAll(selector);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        elements.forEach((el, index) => {
            el.classList.add('reveal-on-scroll');
            if (stagger) { el.style.setProperty('--stagger-index', index); }
            observer.observe(el);
        });
    };
    
    function showContactFeedback(message, type) {
        const feedbackEl = dom.contactFormFeedback;
        feedbackEl.textContent = message;
        feedbackEl.className = type;
    }

    // --- EVENT LISTENERS ---
    dom.searchInput.addEventListener('input', () => { state.currentPage = 1; updateProductsDisplay(); });
    dom.searchForm.addEventListener('submit', (event) => { event.preventDefault(); state.currentPage = 1; updateProductsDisplay(); dom.searchInput.blur(); });
    
    dom.prevPageBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            updateProductsDisplay();
            // --- FIX: Scroll up after changing page ---
            dom.productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    dom.nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(state.filteredProducts.length / state.productsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            updateProductsDisplay();
            // --- FIX: Scroll up after changing page ---
            dom.productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    dom.themeToggleBtn.addEventListener('click', () => { const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark'; applyTheme(newTheme); });
    dom.scrollUpBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', () => { dom.scrollUpBtn.classList.toggle('show', window.scrollY > 300); });
    dom.hamburgerBtn.addEventListener('click', () => { const isActive = dom.mobileMenu.classList.toggle('active'); dom.hamburgerBtn.textContent = isActive ? '✕' : '☰'; });
    dom.mobileMenu.addEventListener('click', (e) => { if (e.target.tagName === 'A') { dom.mobileMenu.classList.remove('active'); dom.hamburgerBtn.textContent = '☰'; } });

    if (dom.contactForm) {
        dom.contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const form = event.target;
            const feedbackEl = dom.contactFormFeedback;
            const submitButton = form.querySelector('button[type="submit"]');

            feedbackEl.className = '';
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            if (!name || !email || !message) {
                showContactFeedback('Please fill out all fields.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showContactFeedback('Please enter a valid email address.', 'error');
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showContactFeedback('Thank you! Your message has been sent.', 'success');
                    form.reset();
                } else {
                    showContactFeedback('Oops! Something went wrong. Please try again.', 'error');
                }
            } catch (error) {
                showContactFeedback('Oops! There was a network problem. Please try again.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    }

    // --- INITIALIZATION ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    updateProductsDisplay();
    observeElements('.hero > *', true);
    observeElements('.product-card', true);
    observeElements('.feature-item', true);
    observeElements('.section-title', false);
    observeElements('.footer-column', true);
});
