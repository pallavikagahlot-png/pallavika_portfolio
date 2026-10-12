/**
 * Main Application Script for Pallavika Gahlot's Portfolio
 * Handles Theme Toggling, Mobile Navigation, Resume Modal, and Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initResumeModal();
  initContactForm();
  initScrollAnimations();
});

/* ===================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   =================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('pg_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'dark'); // default engineering dark
  setTheme(currentTheme);

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme === 'light' ? 'Drafting Light' : 'Blueprint Dark'} mode`);
    });
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('pg_theme', theme);
  updateThemeIcons(theme);
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach((icon) => {
    if (theme === 'light') {
      // Moon icon for switching back to dark
      icon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      icon.setAttribute('title', 'Switch to Blueprint Dark mode');
    } else {
      // Sun icon for switching to light
      icon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      icon.setAttribute('title', 'Switch to Drafting Light mode');
    }
  });
}

/* ===================================================================
   2. NAVIGATION & MOBILE DRAWER
   =================================================================== */
function initNavigation() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileBtn.contains(e.target)) {
        mobileDrawer.classList.remove('open');
      }
    });

    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Highlight active page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ===================================================================
   3. RESUME MODAL
   =================================================================== */
function initResumeModal() {
  const modalBackdrop = document.getElementById('resumeModal');
  const openButtons = document.querySelectorAll('.btn-view-resume, [data-open-resume]');
  const closeButtons = document.querySelectorAll('.modal-close-btn, [data-close-modal]');

  if (!modalBackdrop) return;

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal();
    });
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Print button inside modal
  const printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ===================================================================
   4. CONTACT FORM & CLIPBOARD ACTIONS
   =================================================================== */
function initContactForm() {
  // Copy email triggers
  const copyButtons = document.querySelectorAll('.btn-copy-email, [data-copy-email]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'pallavika.26bmen0022@jecrcu.edu.in';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Official email copied to clipboard!');
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value || 'Colleague/Visitor';
      const subject = document.getElementById('senderSubject')?.value || 'Connecting with Pallavika Gahlot';
      const message = document.getElementById('senderMessage')?.value || '';

      const mailtoUrl = `mailto:pallavika.26bmen0022@jecrcu.edu.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Hi Pallavika,\n\nName: ${name}\n\nMessage:\n${message}\n`
      )}`;

      showToast('Opening default email client...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
    });
  }
}

/* ===================================================================
   5. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color: var(--accent-blue); display: inline-flex;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </span>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3600);
}

/* ===================================================================
   6. SCROLL REVEAL ANIMATIONS
   =================================================================== */
function initScrollAnimations() {
  const cards = document.querySelectorAll('.card, .blueprint-project-card, .value-card, .timeline-card');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(card);
    });
  }
}
