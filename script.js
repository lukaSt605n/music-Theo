document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.nav-item');
    const form = document.getElementById('lessonForm');
    const phoneInput = form?.querySelector('input[name="phone"]');

    // Helpers
    const toggleMenu = () => {
        navLinks?.classList.toggle('active');
        menuToggle?.classList.toggle('open');
    };

    const closeMenu = () => {
        navLinks?.classList.remove('active');
        menuToggle?.classList.remove('open');
    };

    const showSection = (sectionId) => {
        sections.forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        navItems.forEach(item => {
            const isActive = item.getAttribute('href') === `#${sectionId}`;
            item.classList.toggle('active', isActive);
        });
    };

    // Mobile Menu Events
    menuToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
            closeMenu();
        }
    });

    // Section Navigation Events
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('href')?.substring(1);
            if (sectionId) {
                showSection(sectionId);
                history.pushState(null, '', `#${sectionId}`);
                if (window.innerWidth <= 768) closeMenu();
            }
        });
    });

    // Phone Formatting
    phoneInput?.addEventListener('input', (e) => {
        const numbers = e.target.value.replace(/\D/g, '');
        const formatted = numbers.replace(/^(\d{0,3})(\d{0,3})(\d{0,4}).*/, (_, p1, p2, p3) => {
            return `${p1 ? `(${p1}` : ''}${p2 ? `) ${p2}` : ''}${p3 ? `-${p3}` : ''}`;
        });
        e.target.value = formatted.substring(0, 14);
    });

    // Form Submission
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const button = form.querySelector('button');
        const originalText = button.innerHTML;

        button.innerHTML = '<div class="spinner"></div> Sending...';
        button.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok) {
                form.reset();
                alert('Thank you! Theo will contact you within 24 hours.');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (err) {
            alert('Error submitting form. Please try again.');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });

    // Load initial section
    const initialSection = window.location.hash?.substring(1) || 'home';
    showSection(initialSection);
});
