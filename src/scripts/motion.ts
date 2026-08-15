function prefersReducedMotion(): boolean {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('reduce-motion-user')
  );
}

export function initImageCarousels() {
  document.querySelectorAll<HTMLElement>('[data-image-carousel]').forEach((carousel) => {
    const isWelcome = carousel.hasAttribute('data-welcome-carousel');
    const slideSelector = isWelcome ? '.image-carousel__slide' : '.hero-slide';
    const slides = Array.from(carousel.querySelectorAll<HTMLElement>(slideSelector));
    if (slides.length < 2) return;

    const intervalMs = Number(carousel.dataset.interval) || 5000;
    const section = carousel.closest('section');
    const indicators = section
      ? Array.from(section.querySelectorAll<HTMLButtonElement>('[data-hero-go]'))
      : [];

    let current = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (current < 0) current = 0;

    const showSlide = (index: number) => {
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle('is-active', active);
        if (!isWelcome && active) {
          slide.classList.remove('is-ken-burns');
          void slide.offsetWidth;
          slide.classList.add('is-ken-burns');
        }
      });
      indicators.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
      current = index;
    };

    showSlide(current);

    indicators.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = Number(dot.dataset.heroGo);
        if (!Number.isNaN(index)) showSlide(index);
      });
    });

    const advance = () => showSlide((current + 1) % slides.length);

    let timer = window.setInterval(advance, intervalMs);

    document.addEventListener('visibilitychange', () => {
      window.clearInterval(timer);
      if (!document.hidden) {
        timer = window.setInterval(advance, intervalMs);
      }
    });
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    bar.style.setProperty('--scroll-progress', String(progress));
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

function initSmoothScroll() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      const header = document.getElementById('site-header');
      const offset = header?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    });
  });
}

function initCountUp() {
  if (prefersReducedMotion()) return;

  const counters = document.querySelectorAll<HTMLElement>('[data-count-up]');
  if (!counters.length) return;

  const animate = (el: HTMLElement) => {
    const target = Number(el.dataset.countUp);
    if (Number.isNaN(target)) return;

    const start = Number(el.dataset.countStart ?? '0');
    const duration = Number(el.dataset.countDuration ?? '1400');
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const value = Math.round(start + (target - start) * eased);
      el.textContent = String(value);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initSectionParallax() {
  if (prefersReducedMotion()) return;
  if (window.matchMedia('(max-width: 1023px)').matches) return;

  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>('.pulse-section .section-bg-image > img')
  );
  if (!images.length) return;

  let ticking = false;

  const update = () => {
    images.forEach((img) => {
      const section = img.closest('section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const translateY = centerOffset * -0.06;
      img.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.06)`;
    });
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();
}

function initMarkerPulse() {
  if (prefersReducedMotion()) return;

  const markers = document.querySelectorAll<HTMLElement>('.timeline-marker');
  if (!markers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-lit', entry.isIntersecting);
      });
    },
    { threshold: 0.5, rootMargin: '0px 0px -10% 0px' }
  );

  markers.forEach((marker) => observer.observe(marker));
}

export function initMotion() {
  const reducedMotion = prefersReducedMotion();

  if (reducedMotion) {
    document
      .querySelectorAll(
        '.fade-rise, .fade-in, .slide-in, .scale-in, .kente-reveal, .hero-animate, .hero-image-animate, .hero-body-animate'
      )
      .forEach((el) => {
        el.classList.add('is-visible');
      });
  } else {
    document.querySelectorAll('[data-stagger]').forEach((parent) => {
      parent.querySelectorAll('.fade-rise, .scale-in, .slide-in').forEach((el, index) => {
        (el as HTMLElement).style.setProperty('--reveal-delay', `${index * 90}ms`);
      });
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    document
      .querySelectorAll('.fade-rise, .fade-in, .slide-in, .scale-in, .kente-reveal, .hero-body-animate')
      .forEach((el) => {
        revealObserver.observe(el);
      });

    document.querySelectorAll('.hero-animate, .hero-image-animate').forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  const header = document.getElementById('site-header');
  const themedSections = document.querySelectorAll<HTMLElement>('section[data-header-theme]');

  function updateHeaderTheme() {
    if (!header) return;

    header.classList.toggle('is-scrolled', window.scrollY > 8);
    syncHeaderHeight();

    if (!themedSections.length) return;

    const probeY = window.scrollY + header.offsetHeight * 0.5;
    let activeTheme: string | null = null;

    themedSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;
      if (probeY >= top && probeY < bottom) {
        activeTheme = section.dataset.headerTheme ?? null;
      }
    });

    header.classList.toggle('header-light', activeTheme === 'light');
  }

  if (header) {
    syncHeaderHeight();
    updateHeaderTheme();
    window.addEventListener('scroll', updateHeaderTheme, { passive: true });
    window.addEventListener(
      'resize',
      () => {
        syncHeaderHeight();
        updateHeaderTheme();
      },
      { passive: true }
    );
  }

  initScrollProgress();
  initSmoothScroll();
  initCountUp();
  initSectionParallax();
  initMarkerPulse();
  initHeaderNav();
  initImageCarousels();
}

function syncHeaderHeight() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const hadScrolledClass = header.classList.contains('is-scrolled');
  header.classList.remove('is-scrolled');
  const fullHeight = header.offsetHeight;
  if (hadScrolledClass) header.classList.add('is-scrolled');

  document.documentElement.style.setProperty('--site-header-height', `${fullHeight}px`);
}

function initHeaderNav() {
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-nav-section]');
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('section[id][data-header-theme]')
  );

  if (!header || !navLinks.length) return;

  const setActive = (sectionId: string) => {
    navLinks.forEach((link) => {
      const isActive = link.dataset.navSection === sectionId;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const updateActiveNav = () => {
    const headerHeight = header.offsetHeight;
    const probeY = window.scrollY + headerHeight * 0.42;
    let activeId = 'hero';

    if (window.scrollY < 48) {
      setActive('hero');
      return;
    }

    for (const section of sections) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (probeY >= top && probeY < bottom) {
        activeId = section.id;
      }
    }

    setActive(activeId);
  };

  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav, { passive: true });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const target = link.dataset.navSection;
      if (target) setActive(target);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMotion);
} else {
  initMotion();
}
