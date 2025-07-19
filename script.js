document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS (Safe selection) ---
    // This structure ensures that if an element is not on the current page, its variable is null,
    // which we can safely check for later.
    const dom = {
        // Shared elements
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        hamburgerBtn: document.getElementById('hamburger-btn'),
        mobileMenu: document.getElementById('mobile-menu'),
        mainNav: document.querySelector('.main-nav'),
        mobileMenuLinks: document.querySelector('.mobile-menu-links'),
        scrollUpBtn: document.getElementById('scroll-up-btn'),

        // Home page elements
        searchForm: document.getElementById('search-form'),
        productGrid: document.getElementById('product-grid'),
        allProductCards: document.querySelectorAll('#product-grid .product-card'),
        searchInput: document.getElementById('search-input'),
        noResultsMessage: document.getElementById('no-results-message'),
        prevPageBtn: document.getElementById('prev-page-btn'),
        nextPageBtn: document.getElementById('next-page-btn'),
        pageInfo: document.getElementById('page-info'),
        paginationControls: document.getElementById('pagination-controls'),
        contactForm: document.getElementById('contact-form'),
        contactFormFeedback: document.getElementById('contact-form-feedback'),

        // Product page elements
        orderForm: document.getElementById('order-form'),
        formFeedback: document.getElementById('form-feedback'),
        mainImage: document.getElementById('main-image'),
        thumbnails: document.querySelectorAll('.thumbnail-gallery img'),
    };

    // --- STATE ---
    let state = {
        currentPage: 1,
        productsPerPage: 4,
        filteredProducts: []
    };

    // --- FUNCTIONS ---

    const populateMobileMenu = () => {
        if (!dom.mainNav || !dom.mobileMenuLinks) return;
        const navLinks = dom.mainNav.querySelectorAll('a');
        dom.mobileMenuLinks.innerHTML = '';
        navLinks.forEach(link => {
            const newLink = document.createElement('a');
            newLink.href = link.href;
            newLink.textContent = link.textContent;
            dom.mobileMenuLinks.appendChild(newLink);
        });
    };

    const applyTheme = (theme) => {
        if (!dom.themeToggleBtn) return;
        document.body.classList.toggle('dark-mode', theme === 'dark');
        dom.themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    };

    function showFeedback(message, type, formType) {
        const feedbackEl = formType === 'contact' ? dom.contactFormFeedback : dom.formFeedback;
        if (feedbackEl) {
            feedbackEl.textContent = message;
            feedbackEl.className = type;
            feedbackEl.style.display = 'block';
        }
    }

    const observeElements = (selector, stagger = true) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;
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

    // --- EVENT LISTENERS (with safety checks) ---

    // Shared listeners
    if (dom.themeToggleBtn) {
        dom.themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    if (dom.hamburgerBtn && dom.mobileMenu) {
        dom.hamburgerBtn.addEventListener('click', () => {
            const isActive = dom.mobileMenu.classList.toggle('active');
            dom.hamburgerBtn.textContent = isActive ? '✕' : '☰';
        });
        dom.mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                dom.mobileMenu.classList.remove('active');
                dom.hamburgerBtn.textContent = '☰';
            }
        });
    }
    
    if (dom.scrollUpBtn) {
        dom.scrollUpBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => dom.scrollUpBtn.classList.toggle('show', window.scrollY > 300));
    }

    // Home page listeners
    if (dom.searchForm) {
        const updateProductsDisplay = () => {
            state.filteredProducts = Array.from(dom.allProductCards).filter(card => card.querySelector('h3').textContent.toLowerCase().includes(dom.searchInput.value.toLowerCase()));
            const totalPages = Math.ceil(state.filteredProducts.length / state.productsPerPage);
            const hasResults = state.filteredProducts.length > 0;
            
            dom.productGrid.style.display = hasResults ? 'grid' : 'none';
            dom.noResultsMessage.style.display = hasResults ? 'none' : 'block';
            dom.paginationControls.style.display = totalPages > 1 ? 'flex' : 'none';

            dom.allProductCards.forEach(card => card.style.display = 'none');
            const startIndex = (state.currentPage - 1) * state.productsPerPage;
            const productsToShow = state.filteredProducts.slice(startIndex, startIndex + state.productsPerPage);
            productsToShow.forEach(card => card.style.display = 'flex');

            if (totalPages > 0) dom.pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;
            dom.prevPageBtn.disabled = state.currentPage === 1;
            dom.nextPageBtn.disabled = state.currentPage === totalPages || totalPages === 0;
        };

        dom.searchInput.addEventListener('input', () => { state.currentPage = 1; updateProductsDisplay(); });
        dom.searchForm.addEventListener('submit', (e) => { e.preventDefault(); state.currentPage = 1; updateProductsDisplay(); dom.searchInput.blur(); });
        dom.prevPageBtn.addEventListener('click', () => { if (state.currentPage > 1) { state.currentPage--; updateProductsDisplay(); } });
        dom.nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(state.filteredProducts.length / state.productsPerPage);
            if (state.currentPage < totalPages) { state.currentPage++; updateProductsDisplay(); }
        });
        updateProductsDisplay(); // Initial call
    }

    if (dom.contactForm) {
        dom.contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = dom.contactForm.querySelector('#contact-name').value.trim();
            const email = dom.contactForm.querySelector('#contact-email').value.trim();
            const message = dom.contactForm.querySelector('#contact-message').value.trim();
            if (!name || !email || !message) return showFeedback('Please fill out all fields.', 'error', 'contact');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showFeedback('Please enter a valid email address.', 'error', 'contact');
            showFeedback('Thank you! Your message has been sent.', 'success', 'contact');
            dom.contactForm.reset();
        });
    }

    // Product page listeners
    if (dom.mainImage && dom.thumbnails.length > 0) {
        dom.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                dom.mainImage.src = thumb.src;
                dom.thumbnails.forEach(t => t.classList.remove('active-thumbnail'));
                thumb.classList.add('active-thumbnail');
            });
        });
    }

    if (dom.orderForm) {
        dom.orderForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const fullName = dom.orderForm.querySelector('#fullName').value.trim();
            const phone = dom.orderForm.querySelector('#phone').value.trim();
            const address = dom.orderForm.querySelector('#address').value.trim();
            if (!fullName || !phone || !address) return showFeedback('Please fill out all required fields.', 'error', 'order');
            if (!/^\d{7,}$/.test(phone)) return showFeedback('Please enter a valid phone number.', 'error', 'order');
            showFeedback('Your order has been received successfully! We will contact you soon.', 'success', 'order');
            dom.orderForm.style.display = 'none';
        });
    }

    // --- INITIALIZATION ---
    populateMobileMenu();
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    observeElements('.hero > *, .product-card, .feature-item, .section-title, .footer-column');
});
