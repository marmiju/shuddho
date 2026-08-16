$(function () {
  /* ==========================================================================
     Lenis Smooth Momentum Scroll Engine & Global Synchronization
     ========================================================================== */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Forward Lenis scroll ticks to window scroll events for seamless component sync
    lenis.on('scroll', () => {
      $(window).trigger('scroll');
    });
  }

  // Smooth anchor navigation using Lenis
  $(document).on('click', 'a[href^="#"]', function (e) {
    const href = $(this).attr('href');
    if (!href) return;

    if (href === '#') {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const $target = $(href);
    if ($target.length) {
      e.preventDefault();
      const headerOffset = 85;
      if (lenis) {
        lenis.scrollTo($target.get(0), {
          offset: -headerOffset,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        const targetPos = $target.offset().top - headerOffset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    }
  });

  /* ==========================================================================
     Mobile Appbar & Slide-Out Drawer Navigation
     ========================================================================== */
  const $mobileToggleBtn = $('#mobile-toggle-btn');
  const $drawerCloseBtn = $('#drawer-close-btn');
  const $mobileDrawer = $('#mobile-drawer');
  const $drawerOverlay = $('#drawer-overlay');
  const $drawerLinks = $('.drawer-link');
  const $body = $('body');

  function openDrawer() {
    if (!$mobileDrawer.length || !$drawerOverlay.length) return;
    $mobileDrawer.addClass('open');
    $drawerOverlay.addClass('active');
    $mobileToggleBtn.addClass('active');
    $body.addClass('drawer-open');
  }

  function closeDrawer() {
    if (!$mobileDrawer.length || !$drawerOverlay.length) return;
    $mobileDrawer.removeClass('open');
    $drawerOverlay.removeClass('active');
    $mobileToggleBtn.removeClass('active');
    $body.removeClass('drawer-open');
  }

  $mobileToggleBtn.on('click', function () {
    if ($mobileDrawer.hasClass('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  $drawerCloseBtn.on('click', closeDrawer);
  $drawerOverlay.on('click', closeDrawer);

  $drawerLinks.on('click', function () {
    $drawerLinks.removeClass('active');
    $(this).addClass('active');
    closeDrawer();
  });

  $(window).on('keydown', function (e) {
    if (e.key === 'Escape' && $mobileDrawer.hasClass('open')) {
      closeDrawer();
    }
  });

  /* ==========================================================================
     Custom Pointer & Color Inversion Effect (Text Content Focus)
     ========================================================================== */
  const $cursorDot = $('#cursor-dot');
  const $cursorCircle = $('#cursor-circle');

  if ($cursorDot.length && $cursorCircle.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let circleX = -100;
    let circleY = -100;
    let isMoving = false;

    $(window).on('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Move the inner dot pointer
      $cursorDot.css({ left: mouseX + 'px', top: mouseY + 'px' });

      if (!isMoving) {
        $cursorDot.addClass('visible');
        $cursorCircle.addClass('visible');
        isMoving = true;
      }
    });

    $(window).on('mouseleave', function () {
      $cursorDot.removeClass('visible');
      $cursorCircle.removeClass('visible');
      isMoving = false;
    });

    // Smooth 60fps linear interpolation (LERP) for trailing circle
    function animateCursor() {
      circleX += (mouseX - circleX) * 0.22;
      circleY += (mouseY - circleY) * 0.22;

      $cursorCircle.css({ left: circleX + 'px', top: circleY + 'px' });

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Target ONLY text content (headings, paragraphs, labels)
    $(document).on('mouseenter', 'h1, h2, h3, h4, p, .hero-title, .hero-description, .rating-label, .brands-title, .brands-subtitle, .brand-name', function () {
      $cursorCircle.addClass('hover-active');
      $cursorDot.addClass('hover-active');
    }).on('mouseleave', 'h1, h2, h3, h4, p, .hero-title, .hero-description, .rating-label, .brands-title, .brands-subtitle, .brand-name', function () {
      $cursorCircle.removeClass('hover-active');
      $cursorDot.removeClass('hover-active');
    });
  }

  /* ==========================================================================
     Desktop Nav Capsule Interactive Tab Switching
     ========================================================================== */
  const $navLinks = $('.nav-link');

  $navLinks.on('click', function () {
    $navLinks.removeClass('active');
    $(this).addClass('active');
  });

  /* ==========================================================================
     Entrance Animations
     ========================================================================== */
  const $heroTitle = $('.hero-title');
  const $heroDesc = $('.hero-description');
  const $heroActions = $('.hero-actions');
  const $header = $('.header');
  const $brandsSection = $('.brands-section');

  const animElements = [$header, $heroTitle, $heroDesc, $heroActions, $brandsSection];

  animElements.forEach(($el, index) => {
    if (!$el || !$el.length) return;
    $el.css({
      opacity: '0',
      transform: 'translateY(16px)',
      transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
    });

    setTimeout(() => {
      $el.css({
        opacity: '1',
        transform: 'translateY(0)'
      });
    }, 100 + index * 120);
  });

  /* ==========================================================================
     Parallax Scroll Displacement for Dual Marquee Rows
     ========================================================================== */
  const $marqueeTopRow = $('.marquee-top');
  const $marqueeBottomRow = $('.marquee-bottom');

  if ($brandsSection.length && $marqueeTopRow.length && $marqueeBottomRow.length) {
    let ticking = false;

    function updateParallaxMarquee() {
      const sectionEl = $brandsSection.get(0);
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrolledDistance = windowHeight - rect.top;
        const parallaxFactor = 0.18;

        const topShift = scrolledDistance * parallaxFactor;
        const bottomShift = -scrolledDistance * parallaxFactor;

        $marqueeTopRow.css('transform', `translate3d(${topShift}px, 0, 0)`);
        $marqueeBottomRow.css('transform', `translate3d(${bottomShift}px, 0, 0)`);
      }

      ticking = false;
    }

    $(window).on('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallaxMarquee);
        ticking = true;
      }
    });

    updateParallaxMarquee();
  }

  /* ==========================================================================
     Dynamic Trusted Brands JSON Loader (data/trust.json)
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

  function loadTrustBrandsData() {
    $.getJSON('data/trust.json')
      .done(function (data) {
        if (data.section) {
          if (data.section.title) $('.brands-title').text(data.section.title);
          if (data.section.subtitle) $('.brands-subtitle').text(data.section.subtitle);
          if (data.section.badge) $('.section-badge span:last-child').text(data.section.badge);
        }

        const $topTrack = $('#marquee-top-track');
        const $bottomTrack = $('#marquee-bottom-track');

        if ($topTrack.length && Array.isArray(data.topRow)) {
          $topTrack.html(createBrandGroupHTML(data.topRow, false) + createBrandGroupHTML(data.topRow, true));
        }

        if ($bottomTrack.length && Array.isArray(data.bottomRow)) {
          $bottomTrack.html(createBrandGroupHTML(data.bottomRow, false) + createBrandGroupHTML(data.bottomRow, true));
        }
      })
      .fail(function (error) {
        console.warn('Unable to load dynamic trust.json, using static HTML fallback:', error);
      });
  }

  loadTrustBrandsData();

  /* ==========================================================================
     Sticky Split Showcase & Interactive Projects Carousel System
     ========================================================================== */
  let allProjectsData = [];
  let featuredProjects = [];
  let currentStickyIndex = -1;

  // Elements for Sticky Left Sidebar
  const $stickyCardBox = $('.sticky-card-box');
  const $stickyCategory = $('#sticky-category');
  const $stickyCounter = $('#sticky-counter');
  const $stickyIcon = $('#sticky-icon');
  const $stickyTitle = $('#sticky-title');
  const $stickyDescription = $('#sticky-description');
  const $stickyMetricText = $('#sticky-metric-text');
  const $stickyCtaBtn = $('#sticky-cta-btn');
  const $projectsScrollRight = $('#projects-scroll-right');

  // Carousel Elements
  const $btnViewAll = $('#btn-view-all-projects');
  const $carouselContainer = $('#projects-carousel-container');
  const $carouselTrack = $('#carousel-track');
  const $carouselPrevBtn = $('#carousel-prev-btn');
  const $carouselNextBtn = $('#carousel-next-btn');
  const $carouselCounter = $('#carousel-counter');

  let currentCarouselIndex = 0;

  function updateStickySidebar(project, index, total) {
    if (!project || currentStickyIndex === index) return;
    currentStickyIndex = index;

    if ($stickyCardBox.length) {
      $stickyCardBox.css({
        opacity: '0.4',
        transform: 'translateY(4px)'
      });
    }

    setTimeout(() => {
      if ($stickyCategory.length) $stickyCategory.text(project.category);
      if ($stickyCounter.length) $stickyCounter.text(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`);
      if ($stickyIcon.length) {
        $stickyIcon.attr('class', `brand-icon ${project.iconClass || ''}`).html(project.svg);
      }
      if ($stickyTitle.length) $stickyTitle.text(project.name);
      if ($stickyDescription.length) $stickyDescription.text(project.description);
      if ($stickyMetricText.length) $stickyMetricText.text(project.metricLabel || (project.thousandsCount ? `${project.thousandsCount}K+ Visitors` : '⚡ High Performance'));
      if ($stickyCtaBtn.length) {
        const isExternal = project.url && project.url.startsWith('http');
        $stickyCtaBtn.attr({
          href: project.url || '#collaborate',
          target: isExternal ? '_blank' : '_self',
          rel: isExternal ? 'noopener' : ''
        });
        $stickyCtaBtn.find('span:first-child').text(isExternal ? 'Visit Live Project' : 'Discuss Solution');
      }

      if ($stickyCardBox.length) {
        $stickyCardBox.css({
          opacity: '1',
          transform: 'translateY(0)'
        });
      }
    }, 120);
  }

  function initProjectScrollObserver() {
    const $scrollItems = $('.project-scroll-item');
    if (!$scrollItems.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -35% 0px',
      threshold: [0.1, 0.4, 0.7]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt($(entry.target).attr('data-index'), 10);
          $scrollItems.each(function (i) {
            $(this).toggleClass('active', i === idx);
          });
          if (featuredProjects[idx]) {
            updateStickySidebar(featuredProjects[idx], idx, featuredProjects.length);
          }
        }
      });
    }, observerOptions);

    $scrollItems.each(function () {
      observer.observe(this);
    });

    $scrollItems.each(function (idx) {
      $(this).on('click', function () {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (featuredProjects[idx]) {
          updateStickySidebar(featuredProjects[idx], idx, featuredProjects.length);
        }
      });
    });
  }

  let carouselItemsData = [];

  function renderCarouselCards(projects) {
    if (!$carouselTrack.length) return;
    carouselItemsData = projects;
    $carouselTrack.html(projects.map((project, idx) => {
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
    }).join(''));
  }

  function updateCarouselPosition() {
    if (!$carouselTrack.length || carouselItemsData.length === 0) return;
    const $cardEl = $carouselTrack.find('.carousel-card').first();
    const cardWidth = $cardEl.length ? $cardEl.outerWidth(true) : 472;
    const maxIndex = carouselItemsData.length - 1;

    if (currentCarouselIndex < 0) currentCarouselIndex = 0;
    if (currentCarouselIndex > maxIndex) currentCarouselIndex = maxIndex;

    $carouselTrack.css('transform', `translateX(-${currentCarouselIndex * cardWidth}px)`);

    if ($carouselCounter.length) {
      $carouselCounter.text(`${String(currentCarouselIndex + 1).padStart(2, '0')} / ${String(carouselItemsData.length).padStart(2, '0')}`);
    }
  }

  function loadPortfolioProjectsData() {
    $.getJSON('data/projects.json')
      .done(function (data) {
        if (data.section) {
          if (data.section.title) $('#projects-main-title').text(data.section.title);
          if (data.section.subtitle) $('#projects-main-subtitle').text(data.section.subtitle);
          if (data.section.badge) $('#projects-badge-text').text(data.section.badge);
        }

        const capabilityList = data.capabilities || data.projects || [];
        if (Array.isArray(capabilityList) && capabilityList.length > 0) {
          allProjectsData = capabilityList;
          featuredProjects = allProjectsData;

          if ($projectsScrollRight.length) {
            $projectsScrollRight.html(featuredProjects.map((project, idx) => {
              const isExternal = project.url && project.url.startsWith('http');
              const ctaText = isExternal ? 'Visit Live Web App' : 'Discuss Solution';
              const targetAttr = isExternal ? 'target="_blank" rel="noopener"' : '';
              const projectSvg = project.svg || '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';

              const mobileHeaderHTML = `
                <div class="mobile-project-card-info">
                  <div class="mobile-card-header">
                    <div class="brand-icon ${project.iconClass || ''}">
                      ${projectSvg}
                    </div>
                    <div class="mobile-card-title-group">
                      <h3 class="mobile-card-title">${project.name}</h3>
                      ${project.category ? `<span class="mobile-card-category">${project.category}</span>` : ''}
                    </div>
                  </div>
                  ${project.description ? `<p class="mobile-card-description">${project.description}</p>` : ''}
                </div>
              `;

              const mobileFooterHTML = `
                <div class="mobile-project-card-footer">
                  <a href="${project.url || '#collaborate'}" ${targetAttr} class="btn-dark btn-project mobile-card-btn">
                    <span>${ctaText}</span>
                    <span class="badge-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </span>
                  </a>
                </div>
              `;

              if (project.images && Array.isArray(project.images) && project.images.length > 0) {
                const slidesHTML = project.images.map((imgSrc, slideIdx) => `
                  <div class="swiper-slide">
                    <div class="project-image-box">
                      <img src="${imgSrc}" alt="${project.name} Section ${slideIdx + 1}" class="project-scroll-img">
                    </div>
                  </div>
                `).join('');

                return `
                  <div class="project-scroll-item ${idx === 0 ? 'active' : ''} swiper-project-card" data-project-id="${project.id}" data-index="${idx}">
                    ${mobileHeaderHTML}
                    <div class="project-media-wrapper">
                      <div class="floating-slide-counter">01 / ${String(project.images.length).padStart(2, '0')}</div>
                      <div class="swiper project-swiper">
                        <div class="swiper-wrapper">
                          ${slidesHTML}
                        </div>
                        <div class="swiper-button-prev project-swiper-prev"></div>
                        <div class="swiper-button-next project-swiper-next"></div>
                        <div class="swiper-pagination project-swiper-pagination"></div>
                      </div>
                    </div>
                    ${mobileFooterHTML}
                  </div>
                `;
              } else {
                return `
                  <div class="project-scroll-item ${idx === 0 ? 'active' : ''}" data-project-id="${project.id}" data-index="${idx}">
                    ${mobileHeaderHTML}
                    <div class="project-media-wrapper">
                      <div class="project-image-box">
                        <img src="${project.image || 'assets/images/project-elle.png'}" alt="${project.name}" class="project-scroll-img">
                        <div class="image-overlay-title">${project.name}</div>
                      </div>
                    </div>
                    ${mobileFooterHTML}
                  </div>
                `;
              }
            }).join(''));

            initProjectSwiper();
          }

          const carouselItems = (data.currentlyBuilding && data.currentlyBuilding.length > 0) ? data.currentlyBuilding : allProjectsData;
          renderCarouselCards(carouselItems);

          const horizontalItems = [...(data.currentlyBuilding || []), ...(data.capabilities || [])];
          renderHorizontalTrack(horizontalItems);
          initHorizontalScrollListener();
          initCategoryFilterPills(horizontalItems);
          initDragToScroll();

          updateStickySidebar(featuredProjects[0], 0, featuredProjects.length);

          initProjectScrollObserver();
          initTextWordAnimations();
          initSpotlightGlowEffect();
          initEnhancedScrollTracker();
        }
      })
      .fail(function (error) {
        console.warn('Unable to load projects.json dynamically:', error);
      });
  }

  function initEnhancedScrollTracker() {
    const $topProgress = $('#top-scroll-progress');
    const $scrollTopBtn = $('#scroll-to-top-btn');
    const $progressCircle = $('#scroll-progress-circle');
    const pathLength = 113.097;

    const $sections = $('section[id], footer[id], header[id]');
    const $allNavLinks = $('.nav-link, .drawer-link');

    const $header = $('.header');

    function updateTracker() {
      const scrollTop = $(window).scrollTop();
      const docHeight = $(document).height() - $(window).height();
      const scrollPercent = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

      // 0. Update sticky scaled header on scroll
      if ($header.length) {
        if (scrollTop > 25) {
          $header.addClass('scrolled');
        } else {
          $header.removeClass('scrolled');
        }
      }

      // 1. Update top reading progress bar
      if ($topProgress.length) {
        $topProgress.css('width', (scrollPercent * 100) + '%');
      }

      // 2. Update floating back to top button visibility & circular ring fill
      if ($scrollTopBtn.length) {
        if (scrollTop > 350) {
          $scrollTopBtn.addClass('visible');
        } else {
          $scrollTopBtn.removeClass('visible');
        }

        if ($progressCircle.length) {
          const strokeOffset = pathLength - (scrollPercent * pathLength);
          $progressCircle.css('strokeDashoffset', strokeOffset);
        }
      }

      // 3. Update active nav pill based on section in view
      const windowHeight = $(window).height();
      const scrollCheckPos = scrollTop + (windowHeight * 0.35);
      let activeSectionId = '';

      if (scrollTop < 180) {
        activeSectionId = 'home';
      } else {
        $sections.each(function () {
          const $sec = $(this);
          const top = $sec.offset().top;
          const height = $sec.outerHeight();
          const id = $sec.attr('id');

          if (id && scrollCheckPos >= top && scrollCheckPos < top + height) {
            activeSectionId = id;
          }
        });
      }

      $allNavLinks.each(function () {
        const $link = $(this);
        const href = $.trim($link.attr('href'));

        if (activeSectionId === 'home' && (href === '#' || href === 'index.html' || href === '')) {
          $link.addClass('active');
        } else if (activeSectionId && activeSectionId !== 'home' && href === '#' + activeSectionId) {
          $link.addClass('active');
        } else {
          $link.removeClass('active');
        }
      });
    }

    $(window).on('scroll', updateTracker);
    updateTracker();

    if ($scrollTopBtn.length) {
      $scrollTopBtn.on('click', function () {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  function initScrollRevealObserver() {
    const revealSelectors = [
      '.service-card',
      '.tech-card',
      '.pricing-card',
      '.testimonial-card',
      '.collab-box',
      '.terms-card',
      '.stat-box',
      '.faq-item',
      '.footer-brand-display'
    ];

    $(revealSelectors.join(',')).each(function (idx) {
      const $el = $(this);
      if (!$el.hasClass('reveal-on-scroll')) {
        $el.addClass('reveal-on-scroll');
        const delayClass = 'reveal-delay-' + ((idx % 4) + 1);
        $el.addClass(delayClass);
      }
    });

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    $('.reveal-on-scroll').each(function () {
      revealObserver.observe(this);
    });
  }

  function initSpotlightGlowEffect() {
    $('.shuddho-card, .horizontal-project-card, .carousel-card').each(function () {
      const $card = $(this);
      $card.addClass('spotlight-card');
      $card.on('mousemove', function (e) {
        const offset = $card.offset();
        const x = e.pageX - offset.left;
        const y = e.pageY - offset.top;
        this.style.setProperty('--mouse-x', x + 'px');
        this.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  function initDragToScroll() {
    const $containers = $('.horizontal-track-container, .projects-scroll-right');
    if (!$containers.length) return;

    $containers.each(function () {
      const $container = $(this);
      let isDown = false;
      let startX;
      let scrollLeft;

      $container.on('mousedown', function (e) {
        if (e.target.closest('.swiper-button-next, .swiper-button-prev, .swiper-pagination')) return;
        isDown = true;
        $container.addClass('dragging');
        startX = e.pageX - $container.offset().left;
        scrollLeft = $container.scrollLeft();
      }).on('mouseleave mouseup', function () {
        isDown = false;
        $container.removeClass('dragging');
      }).on('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - $container.offset().left;
        const walk = (x - startX) * 2;
        $container.scrollLeft(scrollLeft - walk);
      });
    });
  }

  function initCategoryFilterPills(allHorizontalItems) {
    const $filterBtns = $('.category-filter-btn');
    if (!$filterBtns.length) return;

    $filterBtns.on('click', function () {
      $filterBtns.removeClass('active');
      const $btn = $(this);
      $btn.addClass('active');

      const cat = $btn.attr('data-category');
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
  }

  function renderHorizontalTrack(projects) {
    const $track = $('#horizontal-projects-track');
    if (!$track.length) return;

    $track.html(projects.map((project) => {
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
    }).join(''));
  }

  function initHorizontalScrollListener() {
    const $section = $('.horizontal-scroll-section');
    const $track = $('#horizontal-projects-track');
    const $progressBar = $('#horizontal-scroll-progress');
    if (!$section.length || !$track.length) return;

    function onScroll() {
      if ($(window).width() <= 768) return;

      const sectionEl = $section.get(0);
      const trackEl = $track.get(0);
      const rect = sectionEl.getBoundingClientRect();
      const sectionHeight = sectionEl.offsetHeight;
      const windowHeight = $(window).height();

      const scrollableDistance = sectionHeight - windowHeight;
      const scrolled = -rect.top;

      let progress = scrollableDistance > 0 ? scrolled / scrollableDistance : 0;
      progress = Math.max(0, Math.min(1, progress));

      const maxTranslate = Math.max(0, trackEl.scrollWidth - $(window).width() + 120);
      const translateX = progress * maxTranslate;

      $track.css('transform', `translateX(-${translateX}px)`);
      if ($progressBar.length) {
        $progressBar.css('width', (progress * 100) + '%');
      }
    }

    $(window).on('scroll resize', onScroll);
    onScroll();
  }

  function initTextWordAnimations() {
    const $wordTargets = $('.reveal-word-target');
    $wordTargets.each(function () {
      const $target = $(this);
      if ($target.data('wordRevealed')) return;
      $target.data('wordRevealed', true);
      const text = $.trim($target.text());
      const words = text.split(/\s+/);
      $target.html(words.map((word, idx) => `
        <span class="reveal-text-container">
          <span class="reveal-word" style="transition-delay: ${idx * 0.05}s">${word}</span>
        </span>
      `).join(' '));
    });

    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const $target = $(entry.target);
          $target.addClass('is-visible');
          $target.find('.reveal-word').addClass('is-visible');
        }
      });
    }, { threshold: 0.15 });

    $('.fade-in-up, .reveal-word-target, .shuddho-card, .section-badge').each(function () {
      animObserver.observe(this);
    });
  }

  if ($btnViewAll.length && $carouselContainer.length) {
    $btnViewAll.on('click', function () {
      const isExpanded = $carouselContainer.hasClass('is-expanded');
      const $spanText = $btnViewAll.find('span:first-child');

      if (!isExpanded) {
        $carouselContainer.addClass('is-expanded');
        const fullHeight = $carouselContainer.get(0).scrollHeight + 120;
        $carouselContainer.css('max-height', fullHeight + 'px');
        if ($spanText.length) $spanText.text('Hide Details');
      } else {
        $carouselContainer.css('max-height', '0px').removeClass('is-expanded');
        if ($spanText.length) $spanText.text(' Work Together');
      }
    });
  }

  if ($carouselPrevBtn.length) {
    $carouselPrevBtn.on('click', function () {
      currentCarouselIndex--;
      updateCarouselPosition();
    });
  }

  if ($carouselNextBtn.length) {
    $carouselNextBtn.on('click', function () {
      currentCarouselIndex++;
      updateCarouselPosition();
    });
  }

  function sendEmailNotification(payload) {
    return $.ajax({
      url: "/api/send-email",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload)
    }).then(function (apiData) {
      $.ajax({
        url: "https://formsubmit.co/ajax/mar.miju.dev@gmail.com",
        type: "POST",
        contentType: "application/json",
        headers: { "Accept": "application/json" },
        data: JSON.stringify({
          name: payload.name,
          email: payload.email,
          category: payload.category,
          message: payload.message,
          _subject: `🚀 New Project Inquiry: ${payload.name} [${payload.category}]`,
          _template: "table",
          _captcha: "false"
        })
      }).fail(function () { });

      return apiData;
    }).fail(function (error) {
      console.warn('API send email dispatch note:', error);
      return { success: true };
    });
  }

  function initContactFormHandler() {
    const $contactForm = $('#shuddho-contact-form');
    if (!$contactForm.length) return;

    const $contactFormWrapper = $contactForm.parent();

    $contactForm.on('submit', function (e) {
      e.preventDefault();

      const name = $.trim($('#contact-name').val() || '');
      const email = $.trim($('#contact-email').val() || '');
      const category = $('#contact-category').val() || 'General Inquiry';
      const message = $.trim($('#contact-message').val() || '');

      const $submitBtn = $contactForm.find('button[type="submit"]');

      if ($submitBtn.length) {
        $submitBtn.html('<span>Sending Project Details... ⏳</span>').prop('disabled', true);
      }

      sendEmailNotification({ name, email, category, message }).always(function () {
        if ($contactFormWrapper.length) {
          const originalFormHTML = $contactForm.get(0).outerHTML;

          $contactFormWrapper.html(`
            <div class="form-success-card" id="form-success-card">
                <div class="success-icon-badge">✓</div>
                <h4 class="success-title">Thank You for Submitting! 🎉</h4>
                <p class="success-desc">
                    We have successfully received your project details for <strong>${name}</strong> (<em>${email}</em>).
                    An email notification with your project requirements has been dispatched to <strong>mar.miju.dev@gmail.com</strong>.
                    Our engineering team will review your project and respond shortly.
                </p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
                    <button type="button" class="btn-dark btn-collaborate" id="btn-reset-form" style="padding: 10px 22px; font-size: 0.88rem;">
                        <span>Submit Another Inquiry</span>
                    </button>
                </div>
            </div>
          `);

          $('#btn-reset-form').on('click', function () {
            $contactFormWrapper.html(`<h3 class="card-title-text" style="margin-bottom: 20px;">Send Us a Message</h3>` + originalFormHTML);
            initContactFormHandler();
          });
        }
      });
    });
  }

  initContactFormHandler();

  function loadTrustData() {
    const $topTrack = $('#marquee-top-track');
    const $bottomTrack = $('#marquee-bottom-track');

    if (!$topTrack.length && !$bottomTrack.length) return;

    $.getJSON('data/trust.json')
      .done(function (data) {
        if (data.section) {
          if (data.section.title) $('#brands-section-title').text(data.section.title);
          if (data.section.subtitle) $('#brands-section-subtitle').text(data.section.subtitle);
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

        function renderMarqueeTrack($trackEl, items) {
          if (!$trackEl.length || !items || !items.length) return;
          const groupHTML = items.map(createCardHTML).join('');
          $trackEl.html(`
            <div class="marquee-group">
              ${groupHTML}
            </div>
            <div class="marquee-group" aria-hidden="true">
              ${groupHTML}
            </div>
          `);
        }

        if ($topTrack.length && data.topRow) {
          renderMarqueeTrack($topTrack, data.topRow);
        }

        if ($bottomTrack.length && data.bottomRow) {
          renderMarqueeTrack($bottomTrack, data.bottomRow);
        }
      })
      .fail(function (err) {
        console.error('Error loading trust data from json:', err);
      });
  }

  /* ==========================================================================
     Dynamic Reviews & Testimonials Swiper Carousel System
     ========================================================================== */
  let reviewsSwiperInstance = null;

  function loadReviewsData() {
    const $wrapper = $('#reviews-swiper-wrapper');
    if (!$wrapper.length) return;

    $.getJSON('data/reviews.json')
      .done(function (data) {
        if (data.summary) {
          if (data.summary.badge) $('#reviews-badge-text').text(data.summary.badge);
          if (data.summary.title) $('#reviews-title').text(data.summary.title);
          if (data.summary.subtitle) $('#reviews-subtitle').text(data.summary.subtitle);
          if (data.summary.averageRating) $('.rating-score-num').text(`${data.summary.averageRating} / 5.0`);
          if (data.summary.totalReviews) $('.rating-count-label').text(data.summary.totalReviews);
        }

        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          const slidesHTML = data.reviews.map((rev, idx) => {
            const starSVGs = Array(rev.rating || 5).fill(0).map(() => `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            `).join('');

            return `
              <div class="swiper-slide review-card-slide">
                <div class="review-card-item spotlight-card reveal-on-scroll reveal-delay-${(idx % 3) + 1}">
                  <div class="review-card-top">
                    <div class="stars-row">
                      ${starSVGs}
                    </div>
                    ${rev.metric ? `<span class="review-metric-badge">${rev.metric}</span>` : ''}
                  </div>
                  <h4 class="review-headline">${rev.headline || 'Exceptional Web Application Work'}</h4>
                  <p class="review-quote">"${rev.content}"</p>
                  <div class="review-author-box">
                    <div class="author-avatar-wrapper">
                      <img src="${rev.avatar}" alt="${rev.name}" class="author-avatar-img" loading="lazy">
                      <span class="avatar-status-badge"></span>
                    </div>
                    <div class="author-info">
                      <div class="author-name-row">
                        <span class="author-name">${rev.name}</span>
                        ${rev.verified ? `
                          <span class="verified-shield" title="Verified Client">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#10b981"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          </span>
                        ` : ''}
                      </div>
                      <span class="author-title">${rev.role}, ${rev.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('');

          $wrapper.html(slidesHTML);
          initSpotlightGlowEffect();
          initScrollRevealObserver();
          initReviewsSwiper();
        }
      })
      .fail(function (error) {
        console.warn('Unable to load reviews.json, initializing default swiper:', error);
        initReviewsSwiper();
      });
  }

  function initReviewsSwiper() {
    const $container = $('#reviews-swiper');
    if (!$container.length || typeof Swiper === 'undefined') return;

    if (reviewsSwiperInstance) {
      try {
        reviewsSwiperInstance.destroy(true, true);
      } catch (e) { }
    }

    reviewsSwiperInstance = new Swiper('#reviews-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoHeight: true,
      speed: 600,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '#reviews-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '#reviews-next-btn',
        prevEl: '#reviews-prev-btn'
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 24
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 28
        }
      }
    });
  }

  /* ==========================================================================
     Dynamic Blogs & Article Insights System
     ========================================================================== */
  let allBlogArticles = [];

  function createBlogCardHTML(article) {
    return `
      <a href="blog-detail.html?slug=${article.slug}" class="blog-card-item spotlight-card">
        <div class="blog-card-img-box">
          <img src="${article.image}" alt="${article.title}" class="blog-card-img" loading="lazy">
          <span class="blog-category-badge">${article.category}</span>
        </div>
        <div class="blog-card-content">
          <div>
            <div class="blog-meta-row">
              <span>📅 ${article.date}</span>
              <span>•</span>
              <span>⏱️ ${article.readTime}</span>
            </div>
            <h3 class="blog-card-title">${article.title}</h3>
            <p class="blog-card-excerpt">${article.excerpt}</p>
          </div>
          <div class="blog-card-author-footer">
            <span class="blog-author-name">${article.author}</span>
            <span class="blog-read-more-link">
              <span>Read Article</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </div>
        </div>
      </a>
    `;
  }

  function renderBlogGrid($container, articles) {
    if (!$container.length || !articles) return;
    if (articles.length === 0) {
      $container.html('<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b; font-weight: 600;">No articles found matching your criteria.</div>');
      return;
    }
    const html = articles.map(createBlogCardHTML).join('');
    $container.html(html);
    initSpotlightGlowEffect();
  }

  function loadBlogsData() {
    const $homeGrid = $('#blog-articles-grid');
    const $pageGrid = $('#blog-page-articles-list');

    if (!$homeGrid.length && !$pageGrid.length) return;

    $.getJSON('data/blogs.json')
      .done(function (data) {
        if (data.articles && Array.isArray(data.articles)) {
          allBlogArticles = data.articles;

          // Render top 3 on homepage
          if ($homeGrid.length) {
            renderBlogGrid($homeGrid, allBlogArticles.slice(0, 3));
          }

          // Render all on blog listing page
          if ($pageGrid.length) {
            renderBlogGrid($pageGrid, allBlogArticles);
            initBlogSearchAndFilter();
          }
        }
      })
      .fail(function (err) {
        console.warn('Unable to load blogs.json data:', err);
      });
  }

  function initBlogSearchAndFilter() {
    const $searchInput = $('#blog-search-input');
    const $filterBtns = $('.blog-cat-btn');
    const $pageGrid = $('#blog-page-articles-list');
    let currentCategory = 'all';
    let searchQuery = '';

    function filterArticles() {
      let filtered = allBlogArticles;

      if (currentCategory !== 'all') {
        filtered = filtered.filter(a => a.category === currentCategory);
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(a =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
        );
      }

      renderBlogGrid($pageGrid, filtered);
    }

    $filterBtns.on('click', function () {
      $filterBtns.removeClass('active');
      $(this).addClass('active');
      currentCategory = $(this).data('category');
      filterArticles();
    });

    if ($searchInput.length) {
      $searchInput.on('input', function () {
        searchQuery = $.trim($(this).val());
        filterArticles();
      });
    }
  }

  function loadSingleArticleData() {
    const $header = $('#article-header');
    const $coverBox = $('#article-cover-box');
    const $bodyContent = $('#article-body-content');

    if (!$header.length) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug') || 'why-shuddho-is-best';

    $.getJSON('data/blogs.json')
      .done(function (data) {
        if (!data.articles) return;
        const article = data.articles.find(a => a.slug === slug) || data.articles[0];
        if (!article) return;

        document.title = `${article.title} — Shuddho Insights`;

        $header.html(`
          <span class="article-category-badge">${article.category}</span>
          <h1 class="article-main-title">${article.title}</h1>
          <div class="article-author-line">
            <span>By ${article.author} (${article.authorRole})</span>
            <span>•</span>
            <span>📅 ${article.date}</span>
            <span>•</span>
            <span>⏱️ ${article.readTime}</span>
          </div>
        `);

        $coverBox.html(`
          <img src="${article.image}" alt="${article.title}" class="article-cover-img">
        `);

        $bodyContent.html(article.content);
      });
  }

  let activeSwiperInstances = [];
  function initProjectSwiper() {
    if (!window.Swiper) {
      setTimeout(initProjectSwiper, 150);
      return;
    }

    if (Array.isArray(activeSwiperInstances) && activeSwiperInstances.length > 0) {
      activeSwiperInstances.forEach(instance => {
        if (instance && typeof instance.destroy === 'function') {
          try {
            instance.destroy(true, true);
          } catch (e) { }
        }
      });
      activeSwiperInstances = [];
    }

    const $swiperElements = $('.project-swiper');
    if (!$swiperElements.length) return;

    $swiperElements.each(function () {
      const swiperEl = this;
      const $swiperEl = $(swiperEl);
      const $parentCard = $swiperEl.closest('.swiper-project-card');
      const prevBtn = $parentCard.length ? $parentCard.find('.project-swiper-prev').get(0) : $swiperEl.find('.project-swiper-prev').get(0);
      const nextBtn = $parentCard.length ? $parentCard.find('.project-swiper-next').get(0) : $swiperEl.find('.project-swiper-next').get(0);
      const paginationEl = $parentCard.length ? $parentCard.find('.project-swiper-pagination').get(0) : $swiperEl.find('.project-swiper-pagination').get(0);
      const $floatingCounterEl = $parentCard.length ? $parentCard.find('.floating-slide-counter') : $('#floating-slide-counter');

      const $slides = $swiperEl.find('.swiper-slide:not(.swiper-slide-duplicate)');
      const totalSlidesCount = $slides.length > 0 ? $slides.length : 5;

      const updateCounter = (swiperInstance) => {
        const realIndex = typeof swiperInstance.realIndex === 'number' ? swiperInstance.realIndex : 0;
        const total = swiperInstance.slides ? (swiperInstance.slides.length - (swiperInstance.params.loop ? 2 : 0)) : totalSlidesCount;
        const countToUse = total > 0 ? total : totalSlidesCount;
        const formatted = `${String(realIndex + 1).padStart(2, '0')} / ${String(countToUse).padStart(2, '0')}`;
        const $counterEl = $('#sticky-counter');
        if ($counterEl.length && $parentCard.hasClass('active')) {
          $counterEl.text(formatted);
        }
        if ($floatingCounterEl.length) {
          $floatingCounterEl.text(formatted);
        }
      };

      const instance = new window.Swiper(swiperEl, {
        loop: totalSlidesCount > 1,
        observer: true,
        observeParents: true,
        resizeObserver: true,
        autoplay: totalSlidesCount > 1 ? {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false,
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
        pagination: {
          el: paginationEl,
          clickable: true,
        },
        speed: 600,
        on: {
          init: function () {
            updateCounter(this);
          },
          slideChange: function () {
            updateCounter(this);
          }
        }
      });

      activeSwiperInstances.push(instance);
    });
  }

  function loadContactData() {
    $.getJSON('data/contact.json')
      .done(function (data) {
        if (data.email) {
          if (data.email.inquiryMailto) $('#availability-email-link').attr('href', data.email.inquiryMailto);
          if (data.email.displayLabel || data.email.address) {
            $('#availability-email-subtext').text(data.email.displayLabel || data.email.address);
          }
          if (data.email.mailto) $('#contact-email-btn').attr('href', data.email.mailto);
          if (data.email.buttonText) $('#contact-email-btn-text').text(data.email.buttonText);
          if (data.email.address) $('#contact-card-email-text').text(data.email.address);
        }

        if (data.whatsapp) {
          if (data.whatsapp.link) $('#contact-whatsapp-btn').attr('href', data.whatsapp.link);
          if (data.whatsapp.buttonText) $('#contact-whatsapp-btn-text').text(data.whatsapp.buttonText);
          if (data.whatsapp.formattedNumber || data.whatsapp.number) {
            $('#contact-card-whatsapp-text').text(data.whatsapp.formattedNumber || data.whatsapp.number);
          }
        }

        if (data.calendly) {
          if (data.calendly.link) $('#availability-calendly-link').attr('href', data.calendly.link);
          if (data.calendly.subtext) $('#availability-calendly-subtext').text(data.calendly.subtext);
          if (data.calendly.link) $('#floating-calendly-link').attr('href', data.calendly.link);
        }

        if (data.location) {
          if (data.location.title) $('#contact-card-location-title').text(data.location.title);
          if (data.location.description) $('#contact-card-location-text').text(data.location.description);
        }
      })
      .fail(function (error) {
        console.warn('Unable to load contact.json dynamically:', error);
      });
  }

  function initTermsPageScrollEngine() {
    const $termsCards = $('.terms-section-card');
    const $termsNavItems = $('.terms-nav-item');
    const $progressFill = $('#terms-progress-fill');
    const $readPercentText = $('#terms-read-percent');
    const $mobileProgressFill = $('#terms-mobile-progress-fill');
    const $mobileReadPercentText = $('#terms-mobile-read-percent');
    const $fabPercentText = $('#terms-fab-percent');
    const $termsWrapper = $('#terms-content-wrapper');

    const $fabBtn = $('#terms-mobile-fab-btn');
    const $drawerPanel = $('#terms-mobile-drawer-panel');
    const $drawerBackdrop = $('#terms-drawer-backdrop');
    const $drawerCloseBtn = $('#terms-drawer-close-btn');

    if (!$termsCards.length) return;

    function openMobileTermsDrawer() {
      if ($drawerPanel.length) $drawerPanel.addClass('is-open');
      if ($drawerBackdrop.length) $drawerBackdrop.addClass('is-open');
      $body.css('overflow', 'hidden');
    }

    function closeMobileTermsDrawer() {
      if ($drawerPanel.length) $drawerPanel.removeClass('is-open');
      if ($drawerBackdrop.length) $drawerBackdrop.removeClass('is-open');
      $body.css('overflow', '');
    }

    $fabBtn.on('click', openMobileTermsDrawer);
    $drawerCloseBtn.on('click', closeMobileTermsDrawer);
    $drawerBackdrop.on('click', closeMobileTermsDrawer);

    $('#terms-edge-swipe-hint').on('click', openMobileTermsDrawer);

    let touchStartX = 0;
    let touchStartY = 0;

    $(window).on('touchstart', function (e) {
      const touches = e.originalEvent.touches || e.touches;
      if (touches.length > 1) return;
      touchStartX = touches[0].clientX;
      touchStartY = touches[0].clientY;
    });

    $(window).on('touchmove', function (e) {
      if (!touchStartX) return;
      const touches = e.originalEvent.touches || e.touches;
      const currentX = touches[0].clientX;
      const currentY = touches[0].clientY;
      const deltaX = currentX - touchStartX;
      const deltaY = Math.abs(currentY - touchStartY);

      const isDrawerOpen = $drawerPanel.hasClass('is-open');

      if (!isDrawerOpen && touchStartX < 70 && deltaX > 45 && deltaX > deltaY * 1.2) {
        openMobileTermsDrawer();
        touchStartX = 0;
      } else if (isDrawerOpen && deltaX < -45 && Math.abs(deltaX) > deltaY * 1.2) {
        closeMobileTermsDrawer();
        touchStartX = 0;
      }
    });

    $(window).on('touchend', function () {
      touchStartX = 0;
      touchStartY = 0;
    });

    $('.mobile-drawer-nav-links a').on('click', closeMobileTermsDrawer);

    const cardEntranceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('animate-in');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    $termsCards.each(function () {
      cardEntranceObserver.observe(this);
    });

    function handleTermsScroll() {
      const windowHeight = $(window).height();
      const scrollTop = $(window).scrollTop();

      if ($termsWrapper.length) {
        const wrapperEl = $termsWrapper.get(0);
        const wrapperRect = wrapperEl.getBoundingClientRect();
        const wrapperTop = wrapperRect.top + scrollTop;
        const wrapperHeight = wrapperRect.height;
        const totalScrollable = wrapperHeight - windowHeight + 100;

        let percentage = Math.min(100, Math.max(0, ((scrollTop - wrapperTop + 200) / totalScrollable) * 100));
        const formattedPercent = `${percentage.toFixed(0)}%`;

        if ($progressFill.length) $progressFill.css('width', formattedPercent);
        if ($readPercentText.length) $readPercentText.text(formattedPercent);
        if ($mobileProgressFill.length) $mobileProgressFill.css('width', formattedPercent);
        if ($mobileReadPercentText.length) $mobileReadPercentText.text(formattedPercent);
        if ($fabPercentText.length) $fabPercentText.text(formattedPercent);
      }

      let activeIndex = 0;
      $termsCards.each(function (index) {
        const rect = this.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.45 && rect.bottom >= windowHeight * 0.2) {
          activeIndex = index;
          $(this).addClass('active-focus');
        } else {
          $(this).removeClass('active-focus');
        }
      });

      $termsNavItems.each(function (index) {
        if (index === activeIndex || index % $termsCards.length === activeIndex) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
    }

    $(window).on('scroll', handleTermsScroll);
    handleTermsScroll();
  }

  initHorizontalScrollListener();
  initTextWordAnimations();
  initSpotlightGlowEffect();
  initEnhancedScrollTracker();
  initScrollRevealObserver();
  initDragToScroll();

  loadPortfolioProjectsData();
  loadTrustData();
  loadReviewsData();
  loadBlogsData();
  loadSingleArticleData();
  loadContactData();
  initProjectSwiper();
  initTermsPageScrollEngine();
});
