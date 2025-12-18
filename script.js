// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav__links');
const body = document.body;

if (hamburger && navLinks) {
  // Toggle menu on hamburger click
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    body.classList.toggle('menu-open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking the overlay (::before pseudo-element area)
  navLinks.addEventListener('click', (e) => {
    if (e.target === navLinks) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Simple reveal-on-scroll to keep the page feeling alive without overwhelming
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Lightweight form handler placeholder
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.reset();
    const notice = document.createElement('div');
    notice.className = 'pill';
    notice.textContent = 'Tack! Vi återkommer inom 24h.';
    form.appendChild(notice);
    setTimeout(() => notice.remove(), 4000);
  });
}

// Image Slider
const slider = document.querySelector('.slider');
if (slider) {
  const track = slider.querySelector('.slider__track');
  const images = track.querySelectorAll('img');
  const prevBtn = slider.querySelector('.slider__btn--prev');
  const nextBtn = slider.querySelector('.slider__btn--next');
  const dotsContainer = slider.querySelector('.slider__dots');
  
  let currentIndex = 0;
  const totalSlides = images.length;
  let autoPlayInterval;

  // Create dots
  images.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'slider__dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Gå till bild ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.slider__dot');

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoPlay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 4000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoPlay();
    }
  }, { passive: true });

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  slider.addEventListener('mouseleave', startAutoPlay);

  // Start auto-play
  startAutoPlay();
}

// GDPR & Cookie Consent
const cookieBanner = document.getElementById('cookieBanner');
const gdprPopup = document.getElementById('gdprPopup');
const gdprLink = document.querySelector('.gdpr-link');

if (cookieBanner && gdprPopup) {
  const openGdprPopup = document.getElementById('openGdprPopup');
  const gdprClose = document.querySelector('.gdpr-popup__close');
  const gdprAccept = document.getElementById('gdprAccept');
  const gdprDecline = document.getElementById('gdprDecline');
  const bannerAccept = document.getElementById('bannerAccept');
  const bannerDecline = document.getElementById('bannerDecline');
  const analyticsCookies = document.getElementById('analyticsCookies');
  const marketingCookies = document.getElementById('marketingCookies');

  // Show banner every time the page loads
  setTimeout(() => {
    cookieBanner.classList.add('visible');
  }, 1500);
  
  // Load any saved preferences
  const cookieConsent = localStorage.getItem('cookieConsent');

  // Open GDPR popup from banner
  openGdprPopup?.addEventListener('click', () => {
    cookieBanner.classList.remove('visible');
    gdprPopup.classList.add('visible');
    document.body.style.overflow = 'hidden';
  });

  // Open GDPR popup from footer link
  gdprLink?.addEventListener('click', () => {
    gdprPopup.classList.add('visible');
    document.body.style.overflow = 'hidden';
  });

  // Close GDPR popup
  function closeGdprPopup() {
    gdprPopup.classList.remove('visible');
    document.body.style.overflow = '';
  }

  gdprClose?.addEventListener('click', closeGdprPopup);

  // Close on overlay click
  gdprPopup.addEventListener('click', (e) => {
    if (e.target === gdprPopup) {
      closeGdprPopup();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gdprPopup.classList.contains('visible')) {
      closeGdprPopup();
    }
  });

  // Accept all cookies
  function acceptAll() {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    cookieBanner.classList.remove('visible');
    closeGdprPopup();
  }

  // Decline optional cookies
  function declineOptional() {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    cookieBanner.classList.remove('visible');
    closeGdprPopup();
  }

  // Save custom preferences
  function savePreferences() {
    const consent = {
      necessary: true,
      analytics: analyticsCookies?.checked || false,
      marketing: marketingCookies?.checked || false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    closeGdprPopup();
  }

  gdprAccept?.addEventListener('click', acceptAll);
  gdprDecline?.addEventListener('click', savePreferences);
  bannerAccept?.addEventListener('click', acceptAll);
  bannerDecline?.addEventListener('click', declineOptional);

  // Load saved preferences into toggles
  if (cookieConsent) {
    try {
      const saved = JSON.parse(cookieConsent);
      if (analyticsCookies) analyticsCookies.checked = saved.analytics;
      if (marketingCookies) marketingCookies.checked = saved.marketing;
    } catch (e) {
      // Invalid JSON, ignore
    }
  }
}

