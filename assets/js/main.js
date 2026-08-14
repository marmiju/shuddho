document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     Mobile Appbar & Slide-Out Drawer Navigation
     ========================================================================== */
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    if (mobileToggleBtn) mobileToggleBtn.classList.add('active');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    if (mobileToggleBtn) mobileToggleBtn.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawerLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
      closeDrawer();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* ==========================================================================
     Custom Pointer & Color Inversion Effect (Text Content Focus)
     ========================================================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorCircle = document.getElementById('cursor-circle');

  if (cursorDot && cursorCircle && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let circleX = -100;
    let circleY = -100;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Move the inner dot pointer
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      if (!isMoving) {
        cursorDot.classList.add('visible');
        cursorCircle.classList.add('visible');
        isMoving = true;
      }
    });

    window.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('visible');
      cursorCircle.classList.remove('visible');
      isMoving = false;
    });

    // Smooth 60fps linear interpolation (LERP) for trailing circle
    function animateCursor() {
      circleX += (mouseX - circleX) * 0.22;
      circleY += (mouseY - circleY) * 0.22;

      cursorCircle.style.left = `${circleX}px`;
      cursorCircle.style.top = `${circleY}px`;

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Target ONLY text content (headings, paragraphs, labels)
    const textContentElements = document.querySelectorAll('h1, h2, h3, h4, p, .hero-title, .hero-description, .rating-label, .brands-title, .brands-subtitle, .brand-name');

    textContentElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursorCircle.classList.add('hover-active');
        cursorDot.classList.add('hover-active');
      });

      element.addEventListener('mouseleave', () => {
        cursorCircle.classList.remove('hover-active');
        cursorDot.classList.remove('hover-active');
      });
    });
  }

  /* ==========================================================================
     Desktop Nav Capsule Interactive Tab Switching
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* ==========================================================================
     Entrance Animations
     ========================================================================== */
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-description');
  const heroActions = document.querySelector('.hero-actions');
  const header = document.querySelector('.header');
  const brandsSection = document.querySelector('.brands-section');

  const animElements = [header, heroTitle, heroDesc, heroActions, brandsSection];

  animElements.forEach((el, index) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + index * 120);
  });

  /* ==========================================================================
     Parallax Scroll Displacement for Dual Marquee Rows
     ========================================================================== */
  const marqueeTopRow = document.querySelector('.marquee-top');
  const marqueeBottomRow = document.querySelector('.marquee-bottom');

  if (brandsSection && marqueeTopRow && marqueeBottomRow) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateParallaxMarquee() {
      const rect = brandsSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if section is anywhere near the viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Calculate normalized scroll progress through section
        const scrolledDistance = windowHeight - rect.top;
        const parallaxFactor = 0.18; // Smooth parallax sensitivity coefficient

        // Top row shifts rightward (+), Bottom row shifts leftward (-)
        const topShift = scrolledDistance * parallaxFactor;
        const bottomShift = -scrolledDistance * parallaxFactor;

        marqueeTopRow.style.transform = `translate3d(${topShift}px, 0, 0)`;
        marqueeBottomRow.style.transform = `translate3d(${bottomShift}px, 0, 0)`;
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallaxMarquee);
        ticking = true;
      }
    }, { passive: true });

    // Initial trigger
    updateParallaxMarquee();
  }

  /* ==========================================================================
     Dynamic Trusted Brands JSON Loader (public/data/trust.json)
     ========================================================================== */
  function createBrandGroupHTML(brands, isClone = false) {
    const cardsHTML = brands.map(brand => `
            <div class="brand-card">
                <div class="brand-icon ${brand.iconClass || ''}">
                    ${brand.svg}
                </div>
                <div class="brand-info">
                    <h3 class="brand-name">${brand.name}</h3>
                    <span class="brand-tag">${brand.tag}</span>
                </div>
            </div>
        `).join('');

    return `<div class="marquee-group"${isClone ? ' aria-hidden="true"' : ''}>${cardsHTML}</div>`;
  }

  async function loadTrustBrandsData() {
    try {
      // Fetch JSON from public/data/trust.json
      const response = await fetch('public/data/trust.json');
      if (!response.ok) return;
      const data = await response.json();

      // Update header text from JSON if present
      if (data.section) {
        const titleEl = document.querySelector('.brands-title');
        const subtitleEl = document.querySelector('.brands-subtitle');
        const badgeTextEl = document.querySelector('.section-badge span:last-child');

        if (titleEl && data.section.title) titleEl.textContent = data.section.title;
        if (subtitleEl && data.section.subtitle) subtitleEl.textContent = data.section.subtitle;
        if (badgeTextEl && data.section.badge) badgeTextEl.textContent = data.section.badge;
      }

      const topTrack = document.getElementById('marquee-top-track');
      const bottomTrack = document.getElementById('marquee-bottom-track');

      if (topTrack && Array.isArray(data.topRow)) {
        topTrack.innerHTML = createBrandGroupHTML(data.topRow, false) + createBrandGroupHTML(data.topRow, true);
      }

      if (bottomTrack && Array.isArray(data.bottomRow)) {
        bottomTrack.innerHTML = createBrandGroupHTML(data.bottomRow, false) + createBrandGroupHTML(data.bottomRow, true);
      }

      // Re-attach custom cursor hover listeners to dynamically inserted elements
      if (cursorDot && cursorCircle && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const dynamicTexts = document.querySelectorAll('.brand-name, .brands-title, .brands-subtitle');
        dynamicTexts.forEach(element => {
          element.addEventListener('mouseenter', () => {
            cursorCircle.classList.add('hover-active');
            cursorDot.classList.add('hover-active');
          });
          element.addEventListener('mouseleave', () => {
            cursorCircle.classList.remove('hover-active');
            cursorDot.classList.remove('hover-active');
          });
        });
      }
    } catch (error) {
      console.warn('Unable to load dynamic trust.json, using static HTML fallback:', error);
    }
  }

  loadTrustBrandsData();

  /* ==========================================================================
     Sticky Split Showcase & Interactive Projects Carousel System
     ========================================================================== */
  let allProjectsData = [];
  let featuredProjects = [];
  let currentStickyIndex = -1;

  // Elements for Sticky Left Sidebar
  const stickyCardBox = document.querySelector('.sticky-card-box');
  const stickyCategory = document.getElementById('sticky-category');
  const stickyCounter = document.getElementById('sticky-counter');
  const stickyIcon = document.getElementById('sticky-icon');
  const stickyTitle = document.getElementById('sticky-title');
  const stickyDescription = document.getElementById('sticky-description');
  const stickyMetricText = document.getElementById('sticky-metric-text');
  const stickyCtaBtn = document.getElementById('sticky-cta-btn');
  const projectsScrollRight = document.getElementById('projects-scroll-right');

  // Carousel Elements
  const btnViewAll = document.getElementById('btn-view-all-projects');
  const carouselContainer = document.getElementById('projects-carousel-container');
  const carouselTrack = document.getElementById('carousel-track');
  const carouselPrevBtn = document.getElementById('carousel-prev-btn');
  const carouselNextBtn = document.getElementById('carousel-next-btn');
  const carouselCounter = document.getElementById('carousel-counter');

  let currentCarouselIndex = 0;

  function updateStickySidebar(project, index, total) {
    if (!project || currentStickyIndex === index) return;
    currentStickyIndex = index;

    if (stickyCardBox) {
      stickyCardBox.style.opacity = '0.4';
      stickyCardBox.style.transform = 'translateY(4px)';
    }

    setTimeout(() => {
      if (stickyCategory) stickyCategory.textContent = project.category;
      if (stickyCounter) stickyCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
      if (stickyIcon) {
        stickyIcon.className = `brand-icon ${project.iconClass || ''}`;
        stickyIcon.innerHTML = project.svg;
      }
      if (stickyTitle) stickyTitle.textContent = project.name;
      if (stickyDescription) stickyDescription.textContent = project.description;
      if (stickyMetricText) stickyMetricText.textContent = project.metricLabel || (project.thousandsCount ? `${project.thousandsCount}K+ Visitors` : '⚡ High Performance');
      if (stickyCtaBtn) {
        const isExternal = project.url && project.url.startsWith('http');
        stickyCtaBtn.href = project.url || '#collaborate';
        stickyCtaBtn.target = isExternal ? '_blank' : '_self';
        stickyCtaBtn.rel = isExternal ? 'noopener' : '';
        const ctaSpan = stickyCtaBtn.querySelector('span:first-child');
        if (ctaSpan) ctaSpan.textContent = isExternal ? 'Visit Live Project' : 'Discuss Solution';
      }

      if (stickyCardBox) {
        stickyCardBox.style.opacity = '1';
        stickyCardBox.style.transform = 'translateY(0)';
      }
    }, 120);
  }

  function initProjectScrollObserver() {
    const scrollItems = document.querySelectorAll('.project-scroll-item');
    if (scrollItems.length === 0) return;

    // IntersectionObserver for smooth active card detection
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -35% 0px', // Active focus band in upper-center viewport
      threshold: [0.1, 0.4, 0.7]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.getAttribute('data-index'), 10);
          scrollItems.forEach((item, i) => {
            if (i === idx) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
          if (featuredProjects[idx]) {
            updateStickySidebar(featuredProjects[idx], idx, featuredProjects.length);
          }
        }
      });
    }, observerOptions);

    scrollItems.forEach(item => observer.observe(item));

    // Click to activate & smooth scroll
    scrollItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (featuredProjects[idx]) {
          updateStickySidebar(featuredProjects[idx], idx, featuredProjects.length);
        }
      });
    });
  }

  let carouselItemsData = [];

  function renderCarouselCards(projects) {
    if (!carouselTrack) return;
    carouselItemsData = projects;
    carouselTrack.innerHTML = projects.map((project, idx) => {
      const isExternal = project.url && project.url.startsWith('http');
      const btnText = isExternal ? 'Visit Live Web App' : 'Discuss Solution';
      const targetAttr = isExternal ? 'target="_blank" rel="noopener"' : '';
      return `
            <div class="carousel-card" data-carousel-index="${idx}">
                <div class="carousel-img-box">
                    <img src="${project.image || 'assets/images/project-elle.png'}" alt="${project.name}" class="carousel-img">
                    <div class="project-metric-badge">
                        <span class="metric-icon">⚡</span>
                        <span class="metric-text">${project.metricLabel || (project.status || 'Active Build')}</span>
                    </div>
                </div>
                <div class="carousel-body">
                    <div class="project-meta">
                        <span class="project-category">${project.category}</span>
                    </div>
                    <div class="project-header-title">
                        <div class="brand-icon ${project.iconClass || ''}">
                            ${project.svg}
                        </div>
                        <h3 class="project-name">${project.name}</h3>
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-actions">
                        <a href="${project.url || '#collaborate'}" ${targetAttr} class="btn-dark btn-project">
                            <span>${btnText}</span>
                            <span class="badge-icon">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                    <polyline points="7 7 17 7 17 17"></polyline>
                                </svg>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
  }

  function updateCarouselPosition() {
    if (!carouselTrack || carouselItemsData.length === 0) return;
    const cardEl = carouselTrack.querySelector('.carousel-card');
    const cardWidth = cardEl ? cardEl.offsetWidth + 32 : 472;
    const maxIndex = carouselItemsData.length - 1;

    if (currentCarouselIndex < 0) currentCarouselIndex = 0;
    if (currentCarouselIndex > maxIndex) currentCarouselIndex = maxIndex;

    carouselTrack.style.transform = `translateX(-${currentCarouselIndex * cardWidth}px)`;

    if (carouselCounter) {
      carouselCounter.textContent = `${String(currentCarouselIndex + 1).padStart(2, '0')} / ${String(carouselItemsData.length).padStart(2, '0')}`;
    }
  }

  async function loadPortfolioProjectsData() {
    try {
      const response = await fetch('public/data/projects.json');
      if (!response.ok) return;
      const data = await response.json();

      if (data.section) {
        const titleEl = document.getElementById('projects-main-title');
        const subtitleEl = document.getElementById('projects-main-subtitle');
        const badgeEl = document.getElementById('projects-badge-text');

        if (titleEl && data.section.title) titleEl.textContent = data.section.title;
        if (subtitleEl && data.section.subtitle) subtitleEl.textContent = data.section.subtitle;
        if (badgeEl && data.section.badge) badgeEl.textContent = data.section.badge;
      }

      const capabilityList = data.capabilities || data.projects || [];
      if (Array.isArray(capabilityList) && capabilityList.length > 0) {
        allProjectsData = capabilityList;
        featuredProjects = allProjectsData;

        // Render Right Scrolling Mockup Items
        if (projectsScrollRight) {
          projectsScrollRight.innerHTML = featuredProjects.map((project, idx) => {
            if (project.images && Array.isArray(project.images) && project.images.length > 0) {
              const slidesHTML = project.images.map((imgSrc, slideIdx) => {
                const labelText = (project.sections && project.sections[slideIdx])
                  ? project.sections[slideIdx]
                  : `${String(slideIdx + 1).padStart(2, '0')} / ${String(project.images.length).padStart(2, '0')} — ${project.name}`;
                return `
                  <div class="swiper-slide">
                    <div class="project-image-box">
                      <img src="${imgSrc}" alt="${project.name} Section ${slideIdx + 1}" class="project-scroll-img">
                     
                    </div>
                  </div>
                `;
              }).join('');

              return `
                <div class="project-scroll-item ${idx === 0 ? 'active' : ''} swiper-project-card" data-project-id="${project.id}" data-index="${idx}">
                  <div class="floating-slide-counter" id="floating-slide-counter">01 / ${String(project.images.length).padStart(2, '0')}</div>
                  <div class="swiper project-swiper">
                    <div class="swiper-wrapper">
                      ${slidesHTML}
                    </div>
                    <div class="swiper-button-prev project-swiper-prev"></div>
                    <div class="swiper-button-next project-swiper-next"></div>
                    <div class="swiper-pagination project-swiper-pagination"></div>
                  </div>
                </div>
              `;
            } else {
              return `
                <div class="project-scroll-item ${idx === 0 ? 'active' : ''}" data-project-id="${project.id}" data-index="${idx}">
                  <div class="project-image-box">
                    <img src="${project.image || 'assets/images/project-elle.png'}" alt="${project.name}" class="project-scroll-img">
                    <div class="image-overlay-title">${project.name}</div>
                  </div>
                </div>
              `;
            }
          }).join('');

          initProjectSwiper();
        }

        // Render Carousel Cards (Active Team Builds or all items)
        const carouselItems = (data.currentlyBuilding && data.currentlyBuilding.length > 0) ? data.currentlyBuilding : allProjectsData;
        renderCarouselCards(carouselItems);

        // Render Horizontal Scroll Track (All builds & capabilities combined)
        const horizontalItems = [...(data.currentlyBuilding || []), ...(data.capabilities || [])];
        renderHorizontalTrack(horizontalItems);
        initHorizontalScrollListener();
        initCategoryFilterPills(horizontalItems);
        initDragToScroll();

        // Initialize Sticky Sidebar immediately with First Capability
        updateStickySidebar(featuredProjects[0], 0, featuredProjects.length);

        // Initialize IntersectionObserver scroll listeners, spotlight glow & top progress
        initProjectScrollObserver();
        initTextWordAnimations();
        initSpotlightGlowEffect();
        initTopScrollProgress();
      }
    } catch (error) {
      console.warn('Unable to load projects.json dynamically:', error);
    }
  }

  function initTopScrollProgress() {
    const bar = document.getElementById('top-scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / docHeight) * 100;
      bar.style.width = `${progress}%`;
    }, { passive: true });
  }

  function initSpotlightGlowEffect() {
    document.querySelectorAll('.shuddho-card, .horizontal-project-card, .carousel-card').forEach(card => {
      card.classList.add('spotlight-card');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  function initDragToScroll() {
    const container = document.querySelector('.horizontal-track-container');
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('dragging');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  }

  function initCategoryFilterPills(allHorizontalItems) {
    const filterBtns = document.querySelectorAll('.category-filter-btn');
    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-category');
        let filtered = allHorizontalItems;

        if (cat === 'live') {
          filtered = allHorizontalItems.filter(item => item.url && item.url.startsWith('http'));
        } else if (cat === 'webapps') {
          filtered = allHorizontalItems.filter(item => item.id.includes('web') || (item.category && item.category.toLowerCase().includes('web')));
        } else if (cat === 'ecommerce') {
          filtered = allHorizontalItems.filter(item => item.id.includes('ecommerce') || item.id.includes('shopify') || (item.category && item.category.toLowerCase().includes('commerce')));
        } else if (cat === 'api') {
          filtered = allHorizontalItems.filter(item => item.id.includes('api') || item.id.includes('backend') || item.id.includes('automation') || (item.category && item.category.toLowerCase().includes('api')));
        }

        renderHorizontalTrack(filtered.length > 0 ? filtered : allHorizontalItems);
        initSpotlightGlowEffect();
      });
    });
  }

  function renderHorizontalTrack(projects) {
    const track = document.getElementById('horizontal-projects-track');
    if (!track) return;

    track.innerHTML = projects.map((project) => {
      const isExternal = project.url && project.url.startsWith('http');
      const btnText = isExternal ? 'Visit Live Web App' : 'Discuss Solution';
      const targetAttr = isExternal ? 'target="_blank" rel="noopener"' : '';
      return `
        <div class="horizontal-project-card fade-in-up">
            <div>
                <div class="horizontal-card-img-wrapper">
                    <img src="${project.image || 'assets/images/project-elle.png'}" alt="${project.name}" class="horizontal-card-img">
                    <div class="project-metric-badge" style="position: absolute; top: 12px; left: 12px;">
                        <span class="metric-icon">⚡</span>
                        <span class="metric-text">${project.metricLabel || (project.status || 'Featured Build')}</span>
                    </div>
                </div>
                <div class="project-meta" style="margin-bottom: 8px;">
                    <span class="project-category">${project.category}</span>
                </div>
                <h3 class="card-title-text" style="font-size: 1.2rem; margin-bottom: 8px;">${project.name}</h3>
                <p class="card-desc-text" style="font-size: 0.88rem; margin-bottom: 20px;">${project.description}</p>
            </div>
            <div>
                <a href="${project.url || '#collaborate'}" ${targetAttr} class="btn-dark btn-project" style="width: 100%; justify-content: center;">
                    <span>${btnText}</span>
                    <span class="badge-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                    </span>
                </a>
            </div>
        </div>
      `;
    }).join('');
  }

  function initHorizontalScrollListener() {
    const section = document.querySelector('.horizontal-scroll-section');
    const track = document.getElementById('horizontal-projects-track');
    const progressBar = document.getElementById('horizontal-scroll-progress');
    if (!section || !track) return;

    function onScroll() {
      if (window.innerWidth <= 768) return; // Native swipe scroll on mobile

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;

      const scrollableDistance = sectionHeight - windowHeight;
      const scrolled = -rect.top;

      let progress = scrolled / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));

      const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth + 120);
      const translateX = progress * maxTranslate;

      track.style.transform = `translateX(-${translateX}px)`;
      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  function initTextWordAnimations() {
    // 1. Process reveal-word-target headings
    const wordTargets = document.querySelectorAll('.reveal-word-target');
    wordTargets.forEach(target => {
      if (target.dataset.wordRevealed) return;
      target.dataset.wordRevealed = 'true';
      const text = target.textContent.trim();
      const words = text.split(/\s+/);
      target.innerHTML = words.map((word, idx) => `
        <span class="reveal-text-container">
          <span class="reveal-word" style="transition-delay: ${idx * 0.05}s">${word}</span>
        </span>
      `).join(' ');
    });

    // 2. IntersectionObserver for reveal-word and fade-in-up elements
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          const words = entry.target.querySelectorAll('.reveal-word');
          words.forEach(w => w.classList.add('is-visible'));
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in-up, .reveal-word-target, .shuddho-card, .section-badge').forEach(el => {
      animObserver.observe(el);
    });
  }

  // Toggle Availability Section Expansion smoothly on "Check Availability & Work Together" click
  if (btnViewAll && carouselContainer) {
    btnViewAll.addEventListener('click', () => {
      const isExpanded = carouselContainer.classList.contains('is-expanded');
      const spanText = btnViewAll.querySelector('span:first-child');

      if (!isExpanded) {
        carouselContainer.classList.add('is-expanded');
        // Set dynamic max-height to exact scrollHeight for smooth transition
        const fullHeight = carouselContainer.scrollHeight + 120;
        carouselContainer.style.maxHeight = `${fullHeight}px`;

        // setTimeout(() => {
        //   carouselContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // }, 300);

        if (spanText) spanText.textContent = 'Hide Availability Details';
      } else {
        carouselContainer.style.maxHeight = '0px';
        carouselContainer.classList.remove('is-expanded');

        if (spanText) spanText.textContent = '⚡ Check Availability & Work Together';
      }
    });
  }

  // Carousel Prev/Next Buttons
  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => {
      currentCarouselIndex--;
      updateCarouselPosition();
    });
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => {
      currentCarouselIndex++;
      updateCarouselPosition();
    });
  }

  // Contact Form Submission Handler
  const contactForm = document.getElementById('shuddho-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Inquiry Sent Successfully! ✓</span>';
      submitBtn.style.backgroundColor = '#10b981';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.style.backgroundColor = '';
      }, 4000);
    });
  }

  /* ==========================================================================
     Dynamic Brands & Clients Marquee Loader (public/data/trust.json)
     ========================================================================== */
  async function loadTrustData() {
    const topTrack = document.getElementById('marquee-top-track');
    const bottomTrack = document.getElementById('marquee-bottom-track');

    if (!topTrack && !bottomTrack) return;

    try {
      const response = await fetch('public/data/trust.json');
      if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
      const data = await response.json();

      if (data.section) {
        const titleEl = document.getElementById('brands-section-title');
        const subtitleEl = document.getElementById('brands-section-subtitle');
        if (titleEl && data.section.title) titleEl.textContent = data.section.title;
        if (subtitleEl && data.section.subtitle) subtitleEl.textContent = data.section.subtitle;
      }

      function createCardHTML(item) {
        return `
          <div class="brand-card">
            <div class="brand-icon ${item.iconClass || ''}">
              ${item.svg || ''}
            </div>
            <div class="brand-info">
              <h3 class="brand-name">${item.name || ''}</h3>
              <span class="brand-tag">${item.tag || ''}</span>
            </div>
          </div>
        `;
      }

      function renderMarqueeTrack(trackEl, items) {
        if (!trackEl || !items || !items.length) return;
        const groupHTML = items.map(createCardHTML).join('');
        trackEl.innerHTML = `
          <div class="marquee-group">
            ${groupHTML}
          </div>
          <div class="marquee-group" aria-hidden="true">
            ${groupHTML}
          </div>
        `;
      }

      if (topTrack && data.topRow) {
        renderMarqueeTrack(topTrack, data.topRow);
      }

      if (bottomTrack && data.bottomRow) {
        renderMarqueeTrack(bottomTrack, data.bottomRow);
      }
    } catch (err) {
      console.error('Error loading trust data from json:', err);
    }
  }

  /* ==========================================================================
     Swiper Project Section Slider Initialization
     ========================================================================== */
  let activeSwiperInstance = null;
  function initProjectSwiper() {
    const swiperEl = document.querySelector('.project-swiper');
    if (!swiperEl) return;
    if (activeSwiperInstance && typeof activeSwiperInstance.destroy === 'function') {
      activeSwiperInstance.destroy(true, true);
      activeSwiperInstance = null;
    }
    if (window.Swiper) {
      activeSwiperInstance = new window.Swiper('.project-swiper', {
        loop: true,
        observer: true,
        observeParents: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: '.project-swiper-next',
          prevEl: '.project-swiper-prev',
        },
        pagination: {
          el: '.project-swiper-pagination',
          clickable: true,
        },
        speed: 600,
        on: {
          slideChange: function () {
            const realIndex = typeof this.realIndex === 'number' ? this.realIndex : 0;
            const counterEl = document.getElementById('sticky-counter');
            const floatingCounterEl = document.getElementById('floating-slide-counter');
            const formatted = `${String(realIndex + 1).padStart(2, '0')} / 05`;
            if (counterEl) counterEl.textContent = formatted;
            if (floatingCounterEl) floatingCounterEl.textContent = formatted;
          }
        }
      });
    }
  }

  /* ==========================================================================
     Dynamic Contact Info Loader (public/data/contact.json)
     ========================================================================== */
  async function loadContactData() {
    try {
      const response = await fetch('public/data/contact.json');
      if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
      const data = await response.json();

      // Email updates
      if (data.email) {
        const availEmailLink = document.getElementById('availability-email-link');
        const availEmailSubtext = document.getElementById('availability-email-subtext');
        const contactEmailBtn = document.getElementById('contact-email-btn');
        const contactEmailBtnText = document.getElementById('contact-email-btn-text');
        const contactCardEmailText = document.getElementById('contact-card-email-text');

        if (availEmailLink && data.email.inquiryMailto) availEmailLink.href = data.email.inquiryMailto;
        if (availEmailSubtext && (data.email.displayLabel || data.email.address)) {
          availEmailSubtext.textContent = data.email.displayLabel || data.email.address;
        }
        if (contactEmailBtn && data.email.mailto) contactEmailBtn.href = data.email.mailto;
        if (contactEmailBtnText && data.email.buttonText) contactEmailBtnText.textContent = data.email.buttonText;
        if (contactCardEmailText && data.email.address) contactCardEmailText.textContent = data.email.address;
      }

      // WhatsApp updates
      if (data.whatsapp) {
        const contactWhatsappBtn = document.getElementById('contact-whatsapp-btn');
        const contactWhatsappBtnText = document.getElementById('contact-whatsapp-btn-text');
        const contactCardWhatsappText = document.getElementById('contact-card-whatsapp-text');

        if (contactWhatsappBtn && data.whatsapp.link) contactWhatsappBtn.href = data.whatsapp.link;
        if (contactWhatsappBtnText && data.whatsapp.buttonText) contactWhatsappBtnText.textContent = data.whatsapp.buttonText;
        if (contactCardWhatsappText && (data.whatsapp.formattedNumber || data.whatsapp.number)) {
          contactCardWhatsappText.textContent = data.whatsapp.formattedNumber || data.whatsapp.number;
        }
      }

      // Calendly updates
      if (data.calendly) {
        const availCalendlyLink = document.getElementById('availability-calendly-link');
        const availCalendlySubtext = document.getElementById('availability-calendly-subtext');
        const floatingCalendlyLink = document.getElementById('floating-calendly-link');

        if (availCalendlyLink && data.calendly.link) availCalendlyLink.href = data.calendly.link;
        if (availCalendlySubtext && data.calendly.subtext) availCalendlySubtext.textContent = data.calendly.subtext;
        if (floatingCalendlyLink && data.calendly.link) floatingCalendlyLink.href = data.calendly.link;
      }

      // Location updates
      if (data.location) {
        const contactCardLocationTitle = document.getElementById('contact-card-location-title');
        const contactCardLocationText = document.getElementById('contact-card-location-text');

        if (contactCardLocationTitle && data.location.title) contactCardLocationTitle.textContent = data.location.title;
        if (contactCardLocationText && data.location.description) contactCardLocationText.textContent = data.location.description;
      }
    } catch (error) {
      console.warn('Unable to load contact.json dynamically:', error);
    }
  }

  /* ==========================================================================
     Advanced Scroll Animation & Reading Progress System for Terms Page
     ========================================================================== */
  function initTermsPageScrollEngine() {
    const termsCards = document.querySelectorAll('.terms-section-card');
    const termsNavItems = document.querySelectorAll('.terms-nav-item');
    const progressFill = document.getElementById('terms-progress-fill');
    const readPercentText = document.getElementById('terms-read-percent');
    const termsWrapper = document.getElementById('terms-content-wrapper');

    if (termsCards.length === 0) return;

    // 1. Intersection Observer for Smooth Staggered Card Entrance Animation
    const cardEntranceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    termsCards.forEach(card => cardEntranceObserver.observe(card));

    // 2. Active Section Highlight & Scroll Progress Calculation
    function handleTermsScroll() {
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Update Reading Progress Bar
      if (termsWrapper && progressFill) {
        const wrapperRect = termsWrapper.getBoundingClientRect();
        const wrapperTop = wrapperRect.top + scrollTop;
        const wrapperHeight = wrapperRect.height;
        const totalScrollable = wrapperHeight - windowHeight + 100;

        let percentage = Math.min(100, Math.max(0, ((scrollTop - wrapperTop + 200) / totalScrollable) * 100));
        progressFill.style.width = `${percentage.toFixed(0)}%`;
        if (readPercentText) readPercentText.textContent = `${percentage.toFixed(0)}%`;
      }

      // Highlight Active Nav Item based on center viewport position
      let activeIndex = 0;
      termsCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.45 && rect.bottom >= windowHeight * 0.2) {
          activeIndex = index;
          card.classList.add('active-focus');
        } else {
          card.classList.remove('active-focus');
        }
      });

      termsNavItems.forEach((item, index) => {
        if (index === activeIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', handleTermsScroll, { passive: true });
    handleTermsScroll(); // Initial trigger
  }

  // Immediate startup for static elements & fallback cards
  initHorizontalScrollListener();
  initTextWordAnimations();
  initSpotlightGlowEffect();
  initTopScrollProgress();
  initDragToScroll();

  loadPortfolioProjectsData();
  loadTrustData();
  loadContactData();
  initProjectSwiper();
  initTermsPageScrollEngine();
});
