document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const sections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('.nav-item');
  const form = document.getElementById('contact-form');
  const audioBtn = document.getElementById('youtubePlayBtn');
  const waveContainer = document.getElementById('wave-animation');
  const youtubeIframe = document.getElementById('youtube-audio');

  // === YouTube Iframe Init ===
  const YOUTUBE_SRC_BASE = "https://www.youtube.com/embed/CoMNd9xDlEg?enablejsapi=1&autoplay=0";
  if (youtubeIframe) youtubeIframe.src = YOUTUBE_SRC_BASE;

  // === Audio Play/Pause Toggle ===
  if (audioBtn && youtubeIframe) {
    let isPlaying = false;

    audioBtn.addEventListener('click', (e) => {
      e.preventDefault();

      isPlaying = !isPlaying;
      const autoplayValue = isPlaying ? '1' : '0';

      const newSrc = YOUTUBE_SRC_BASE.replace(/autoplay=\d/, `autoplay=${autoplayValue}`);
      youtubeIframe.src = newSrc;

      audioBtn.innerHTML = isPlaying
        ? '<i class="fas fa-pause"></i> Pause'
        : '<i class="fas fa-play"></i> Play';

      if (waveContainer) {
        waveContainer.style.display = isPlaying ? 'flex' : 'none';
      }
    });
  }

  // === Mobile Nav Toggle ===
  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks?.classList.toggle('active');
  });

  // === Click Outside to Close Nav ===
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
      navLinks?.classList.remove('active');
    }
  });
 
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Always close the nav menu on mobile
      if (window.innerWidth <= 768) {
        navLinks?.classList.remove('active');
      }
  
      // Let links work normally (we don't block anything)
    });
  });
  

  // === Show Section and Set Active Nav Item ===
  function showSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      item.classList.toggle('active', href === `#${sectionId}`);
    });
  }

  function initSection() {
    const hash = window.location.hash;
    const path = window.location.pathname.split('/').pop();
  
    // ✅ Only run section logic if we're on the homepage
    const isIndex = path === '' || path === 'index.html';
  
    if (!isIndex) return;
  
    if (hash) {
      showSection(hash.substring(1));
    } else {
      showSection('home');
    }
  }
  

  initSection();

  // === Contact Form Submission ===
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

  // === Back/Forward Navigation ===
  window.addEventListener('popstate', () => {
    initSection();
  });
});
