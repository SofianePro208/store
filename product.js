document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const dom = {
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        hamburgerBtn: document.getElementById('hamburger-btn'),
        mobileMenu: document.getElementById('mobile-menu'),
        orderForm: document.getElementById('order-form'),
        formFeedback: document.getElementById('form-feedback'),
        mainImage: document.getElementById('main-image'),
        thumbnails: document.querySelectorAll('.thumbnail-gallery img'),
        scrollUpBtn: document.getElementById('scroll-up-btn'),
        productNameH1: document.getElementById('product-name'),
        productNameInput: document.getElementById('product-name-input'),
        effectiveDateEl: document.getElementById('effective-date') // <-- NEW
    };

    // =================================================================
    //  NEW: DYNAMIC DATE/TIME LOGIC FOR POLICY PAGES
    // =================================================================
    if (dom.effectiveDateEl) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);
        const formattedTime = now.toLocaleTimeString('en-US');
        
        dom.effectiveDateEl.textContent = `This document is effective as of: ${formattedDate} at ${formattedTime}`;
    }

    // --- IMAGE GALLERY LOGIC ---
    if (dom.mainImage && dom.thumbnails.length > 0) {
        dom.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                dom.mainImage.src = thumb.src;
                dom.thumbnails.forEach(t => t.classList.remove('active-thumbnail'));
                thumb.classList.add('active-thumbnail');
            });
        });
    }

    // --- ORDER FORM LOGIC ---
    if (dom.orderForm) {
        if (dom.productNameH1 && dom.productNameInput) {
            dom.productNameInput.value = dom.productNameH1.textContent.trim();
        }

        dom.order-form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const form = event.target;
            const submitButton = form.querySelector('button[type="submit"]');

            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            if (!fullName || !phone || !address) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }
            if (!/^\d{7,}$/.test(phone)) {
                showFeedback('Please enter a valid phone number.', 'error');
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Submitting Order...';

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showFeedback('Your order has been received successfully! We will contact you soon.', 'success');
                    form.style.display = 'none';
                } else {
                    showFeedback('Oops! Something went wrong. Please try again.', 'error');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit Order';
                }
            } catch (error) {
                showFeedback('Oops! There was a network problem. Please try again.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Order';
            }
        });
    }

    function showFeedback(message, type) {
        if (dom.formFeedback) {
            dom.formFeedback.textContent = message;
            dom.formFeedback.className = type;
            dom.formFeedback.style.display = 'block';
        }
    }

    // --- SHARED LOGIC ---
    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        dom.themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    };

    // --- EVENT LISTENERS for shared components ---
    dom.themeToggleBtn.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
    });
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
    dom.scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', () => {
        dom.scrollUpBtn.classList.toggle('show', window.scrollY > 300);
    });
    
    // --- INITIALIZATION ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});
