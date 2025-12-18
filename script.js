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

