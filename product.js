document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS (Corrected) ---
    const dom = {
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        hamburgerBtn: document.getElementById('hamburger-btn'), // <-- FIX: This was missing
        mobileMenu: document.getElementById('mobile-menu'),     // <-- FIX: This was missing
        orderForm: document.getElementById('order-form'),
        formFeedback: document.getElementById('form-feedback'),
        mainImage: document.getElementById('main-image'),
        thumbnails: document.querySelectorAll('.thumbnail-gallery img'),
        scrollUpBtn: document.getElementById('scroll-up-btn'),
    };

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
        dom.orderForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
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

            showFeedback('Your order has been received successfully! We will contact you soon.', 'success');
            dom.orderForm.style.display = 'none';
        });
    }

    function showFeedback(message, type) {
        // This function now works for any page that has a feedback div
        const feedbackEl = dom.formFeedback || document.getElementById('contact-form-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = message;
            feedbackEl.className = type;
            feedbackEl.style.display = 'block';
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

    // Hamburger Menu Listener (This will now work correctly on all pages)
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
