document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.nav-item');
    const form = document.getElementById('contact-form');
    const audioBtn = document.getElementById('audio-btn');
    const waveContainer = document.getElementById('wave-animation');
    let player; // YouTube Player instance

    // Initialize Wave Animation
    if (waveContainer) {
        for (let i = 0; i < 50; i++) {
            const bar = document.createElement('div');
            bar.className = `bar bar-${i}`;
            waveContainer.appendChild(bar);
        }
    }

    // YouTube Player Setup
    window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: 'CoMNd9xDlEg',
            playerVars: {
                autoplay: 0,
                controls: 0,
                rel: 0,
                modestbranding: 1
            }
        });
    };

    // Audio Control
    if (audioBtn) {
        audioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!player) return;

            const isPaused = player.getPlayerState() !== YT.PlayerState.PLAYING;
            
            if (isPaused) {
                player.playVideo();
                audioBtn.textContent = '⏸ Pause';
                waveContainer.style.display = 'flex';
            } else {
                player.pauseVideo();
                audioBtn.textContent = '▶ Play';
                waveContainer.style.display = 'none';
            }
        });
    }

    // Mobile Menu Toggle
    menuToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });

    // Close Menu on Click Outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
            navLinks?.classList.remove('active');
        }
    });

    // Navigation Handling
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('href').substring(1);
            showSection(sectionId);
            history.pushState(null, '', `#${sectionId}`);
            if (window.innerWidth <= 768) navLinks.classList.remove('active');
        });
    });

    // Form Submission
    if (form) {
        form.addEventListener('submit', async (e) => {
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
    }

    // Section Visibility Control
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        navItems.forEach(item => {
            const isActive = item.getAttribute('href') === `#${sectionId}`;
            item.classList.toggle('active', isActive);
        });
    }

    // Initial Section Load
    const hash = window.location.hash;
    const initialSection = hash ? hash.substring(1) : 'home';
    showSection(initialSection);
});