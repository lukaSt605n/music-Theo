document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const sections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('.nav-item');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const form = document.getElementById('contact-form');
  const audioBtn = document.getElementById('youtubePlayBtn');
  const waveContainer = document.getElementById('wave-animation');
  let player;

  // Wave Animation Init
  if (waveContainer) {
    for (let i = 0; i < 50; i++) {
      const bar = document.createElement('div');
      bar.className = `bar bar-${i}`;
      waveContainer.appendChild(bar);
    }
  }

  // YouTube Audio Player
  const youtubeIframe = document.getElementById('youtube-audio');
  if (youtubeIframe) {
    youtubeIframe.src = "https://www.youtube.com/embed/CoMNd9xDlEg?autoplay=0&enablejsapi=1";
  }

  // Audio Playback Toggle
  if (audioBtn) {
    audioBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const iframe = document.getElementById('youtube-audio');
      const isPaused = iframe.src.includes('autoplay=0');

      if (isPaused) {
        iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
        audioBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        if (waveContainer) waveContainer.style.display = 'flex';
      } else {
        iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
        audioBtn.innerHTML = '<i class="fas fa-play"></i> Play';
        if (waveContainer) waveContainer.style.display = 'none';
      }
    });
  }

  // Mobile Nav Toggle
  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
  });

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
      navLinks.classList.remove('active');
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });

  // Navigation Handling
  function handleNavigation(target) {
    if (target.startsWith('#')) {
      const sectionId = target.substring(1);
      showSection(sectionId);
      history.pushState(null, '', target);
      
      // Special handling for music section
      if(sectionId === 'music') {
        // Refresh SoundCloud iframe
        const scIframe = document.querySelector('#playlist-player');
        if(scIframe) {
          scIframe.src = scIframe.src;
        }
        
        // Smooth scroll to section
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
      }

      if(window.innerWidth <= 768) navLinks.classList.remove('active');
    } else {
      window.location.href = target;
    }
  }

  // Main navigation items
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('href');
      handleNavigation(target);
    });
  });

  // Dropdown items
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('href');
      handleNavigation(target);
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    });
  });

  // Dropdown toggle
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = toggle.closest('.dropdown');
      dropdown.classList.toggle('active');
    });
  });

  // Section Management
  function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if(targetSection) {
      targetSection.classList.add('active');
      
      // Special case for music section
      if(sectionId === 'music') {
        // Initialize SoundCloud widget
        const scWidget = SC.Widget('playlist-player');
        scWidget.bind(SC.Widget.Events.READY, () => {
          scWidget.play();
        });
      }
    }

    // Update active states
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      const isActive = href === `#${sectionId}` || 
                      href?.includes(sectionId) ||
                      item.closest('.dropdown')?.querySelector(`[href="#${sectionId}"]`);
      item.classList.toggle('active', isActive);
    });
  }

  // Initial Section Load
  function initSection() {
    const hash = window.location.hash;
    const path = window.location.pathname.split('/').pop();
    
    // Priority check for music section
    if (hash === '#music') {
      showSection('music');
    } else if (hash) {
      showSection(hash.substring(1));
    } else if (path === 'media-music.html' || path === 'orchestrations.html') {
      showSection('music');
    } else {
      showSection('home');
    }
  }

  // Initialize SoundCloud API
  if(document.querySelector('#playlist-player')) {
    const scScript = document.createElement('script');
    scScript.src = 'https://w.soundcloud.com/player/api.js';
    document.body.appendChild(scScript);
  }

  // Initial setup
  initSection();

  // Contact Form Submission
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

  // Handle browser navigation
  window.addEventListener('popstate', () => {
    initSection();
  });
});