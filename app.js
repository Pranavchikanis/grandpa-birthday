/**
 * Grandpa Birthday Website - Interactive Logic & Audio Engine
 * Honoree: Shri Ravindra Sadashiv Pawar (76th Birthday)
 * Language: Marathi (मराठी)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. PHOTO GALLERY DATA & CONFIGURATION
     ========================================================================== */
  const galleryData = [
    {
      src: 'Family Photographs/1000329570.jpg',
      title: 'नातवाचा लाड आणि आजोबांचा प्रेमळ सहवास',
      desc: 'दोन पिढ्यांचे अतूट नाते आणि चेहऱ्यावरील निर्मळ हास्य.'
    },
    {
      src: 'Family Photographs/1000329573.jpg',
      title: 'आजोबांचे प्रसन्न आणि आदरयुक्त रूप',
      desc: 'संयमी नजर, कपाळावर टिळक आणि शांत व्यक्तिमत्त्व.'
    },
    {
      src: 'Family Photographs/1000329574.jpg',
      title: 'परंपरेची शिकवण देणारे आमचे आधारस्तंभ',
      desc: 'शिवरायांच्या आदर्शांची आठवण करून देणारे संस्कार.'
    },
    {
      src: 'Family Photographs/1000329575.jpg',
      title: 'शांत, संयमी आणि कुटुंबावर अपार माया',
      desc: 'घरातील प्रत्येकाला आधार देणारा एक आश्वासक चेहरा.'
    },
    {
      src: 'Family Photographs/1000329576.jpg',
      title: 'कुटुंबाची शान आणि अखंड आशीर्वादाची सावली',
      desc: 'स्वाभिमान आणि आत्मविश्वासाने परिपूर्ण असा भव्य वावर.'
    }
  ];

  /* ==========================================================================
     2. AUDIO CONTROLLER & AUTOPLAY FALLBACK ENGINE
     ========================================================================== */
  const audio = document.getElementById('birthday-audio');
  const audioWidget = document.getElementById('audio-widget');
  const audioPlayBtn = document.getElementById('audio-play-btn');
  const audioPlayLabel = document.getElementById('audio-play-label');
  const audioMuteBtn = document.getElementById('audio-mute-btn');
  const audioVolumeSlider = document.getElementById('audio-volume-slider');
  const audioTimeDisplay = document.getElementById('audio-time-display');

  const entranceModal = document.getElementById('entrance-modal');
  const entranceStartBtn = document.getElementById('entrance-start-btn');

  const autoplayBanner = document.getElementById('autoplay-banner');
  const autoplayStartBtn = document.getElementById('autoplay-start-btn');
  const autoplayDismissBtn = document.getElementById('autoplay-dismiss-btn');

  let audioStarted = false;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updatePlayerUI() {
    if (!audio) return;

    if (audio.paused) {
      audioWidget.classList.remove('playing');
      audioPlayLabel.textContent = 'ऐका';
      audioPlayBtn.setAttribute('aria-label', 'गाणं सुरू करा');
    } else {
      audioWidget.classList.add('playing');
      audioPlayLabel.textContent = 'थांबवा';
      audioPlayBtn.setAttribute('aria-label', 'गाणं थांबवा');
    }

    if (audio.muted || audio.volume === 0) {
      audioWidget.classList.add('muted');
      audioMuteBtn.setAttribute('aria-label', 'आवाज चालू करा');
    } else {
      audioWidget.classList.remove('muted');
      audioMuteBtn.setAttribute('aria-label', 'आवाज म्यूट करा');
    }

    const cur = formatTime(audio.currentTime);
    const dur = formatTime(audio.duration || 33.6);
    audioTimeDisplay.textContent = `${cur} / ${dur}`;
  }

  function hideModals() {
    if (entranceModal) entranceModal.classList.remove('show');
    if (autoplayBanner) autoplayBanner.classList.remove('show');
  }

  function startAudio(userTriggered = false) {
    if (!audio) return Promise.reject(new Error('Audio element not found'));

    // Set audio configuration: comfortable volume, single play (no loop)
    audio.volume = 0.8;
    audio.loop = false;

    return audio.play()
      .then(() => {
        console.log('Birthday song playback is active.');
        audioStarted = true;
        hideModals();
        cleanupGestureListeners();
        updatePlayerUI();
      })
      .catch((err) => {
        console.warn('Autoplay unprompted status:', err.name);
        // If unprompted play was blocked by browser policy, display royal entrance modal
        if (!audioStarted && entranceModal) {
          entranceModal.classList.add('show');
        }
        updatePlayerUI();
      });
  }

  // Global gesture listeners to trigger audio on very first user interaction
  const gestureEvents = ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll', 'wheel'];

  function handleFirstGesture() {
    if (!audioStarted && audio && audio.paused) {
      startAudio(true);
    } else {
      cleanupGestureListeners();
    }
  }

  function setupGestureListeners() {
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleFirstGesture, { capture: true, passive: true });
    });
  }

  function cleanupGestureListeners() {
    gestureEvents.forEach((evt) => {
      window.removeEventListener(evt, handleFirstGesture, { capture: true });
    });
  }

  // Entrance modal button & backdrop listeners
  if (entranceStartBtn) {
    entranceStartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startAudio(true);
    });
  }

  if (entranceModal) {
    entranceModal.addEventListener('click', () => {
      startAudio(true);
    });
  }

  // Play / Pause toggle on floating player widget
  audioPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.play().catch(e => console.error('Audio play error:', e));
      hideModals();
    } else {
      audio.pause();
    }
    updatePlayerUI();
  });

  // Fallback banner start button
  if (autoplayStartBtn) {
    autoplayStartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startAudio(true);
    });
  }

  if (autoplayDismissBtn) {
    autoplayDismissBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (autoplayBanner) autoplayBanner.classList.remove('show');
    });
  }

  // Mute toggle
  audioMuteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.muted = !audio.muted;
    updatePlayerUI();
  });

  // Volume slider
  audioVolumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    audio.muted = (val === 0);
    updatePlayerUI();
  });

  // Audio Event Listeners
  audio.addEventListener('play', () => {
    audioStarted = true;
    hideModals();
    cleanupGestureListeners();
    updatePlayerUI();
  });
  audio.addEventListener('pause', updatePlayerUI);
  audio.addEventListener('timeupdate', updatePlayerUI);
  audio.addEventListener('loadedmetadata', updatePlayerUI);

  // Play once - when ended, keep paused at end
  audio.addEventListener('ended', () => {
    console.log('Birthday song playback completed.');
    updatePlayerUI();
  });

  audio.addEventListener('error', (e) => {
    console.error('Audio loading error:', e);
    audioTimeDisplay.textContent = 'संगीतामध्ये त्रुटी आली';
  });

  /* ==========================================================================
     3. LIGHTBOX MODAL VIEWER
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  let currentPhotoIndex = 0;
  let lastFocusedElement = null;

  function openLightbox(index) {
    lastFocusedElement = document.activeElement;
    currentPhotoIndex = index;
    updateLightbox();
    lightboxModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    lightboxModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function updateLightbox() {
    const item = galleryData[currentPhotoIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    lightboxCounter.textContent = `छायाचित्र ${currentPhotoIndex + 1} / ${galleryData.length}`;
  }

  function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
    updateLightbox();
  }

  function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
    updateLightbox();
  }

  // Bind Gallery Cards
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(idx);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openLightbox(idx);
      }
    });
  });

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxNextBtn.addEventListener('click', nextPhoto);
  lightboxPrevBtn.addEventListener('click', prevPhoto);

  // Keyboard Navigation in Lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal.hasAttribute('hidden')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextPhoto();
    } else if (e.key === 'ArrowLeft') {
      prevPhoto();
    }
  });

  // Touch Swipe in Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextPhoto();
      else prevPhoto();
    }
  }, { passive: true });

  /* ==========================================================================
     4. INTERACTIVE MEMORY CAROUSEL
     ========================================================================== */
  const memorySlides = document.querySelectorAll('.memory-slide');
  const memoryDotsContainer = document.getElementById('memory-dots');
  const memoryPrevBtn = document.getElementById('memory-prev-btn');
  const memoryNextBtn = document.getElementById('memory-next-btn');

  let currentMemorySlide = 0;
  let memoryAutoPlayTimer = null;

  function initMemoryCarousel() {
    if (!memoryDotsContainer) return;
    memoryDotsContainer.innerHTML = '';

    memorySlides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `memory-dot ${idx === 0 ? 'active' : ''}`;
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `विचार ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToMemorySlide(idx);
        restartMemoryTimer();
      });
      memoryDotsContainer.appendChild(dot);
    });

    startMemoryTimer();
  }

  function goToMemorySlide(index) {
    memorySlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === index);
    });

    const dots = memoryDotsContainer.querySelectorAll('.memory-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    currentMemorySlide = index;
  }

  function nextMemorySlide() {
    const nextIdx = (currentMemorySlide + 1) % memorySlides.length;
    goToMemorySlide(nextIdx);
  }

  function prevMemorySlide() {
    const prevIdx = (currentMemorySlide - 1 + memorySlides.length) % memorySlides.length;
    goToMemorySlide(prevIdx);
  }

  function startMemoryTimer() {
    // Only auto-advance if user does not prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    clearInterval(memoryAutoPlayTimer);
    memoryAutoPlayTimer = setInterval(nextMemorySlide, 6500);
  }

  function restartMemoryTimer() {
    clearInterval(memoryAutoPlayTimer);
    startMemoryTimer();
  }

  if (memoryPrevBtn && memoryNextBtn) {
    memoryPrevBtn.addEventListener('click', () => {
      prevMemorySlide();
      restartMemoryTimer();
    });

    memoryNextBtn.addEventListener('click', () => {
      nextMemorySlide();
      restartMemoryTimer();
    });

    const memoryCarouselEl = document.getElementById('memory-carousel');
    if (memoryCarouselEl) {
      memoryCarouselEl.addEventListener('mouseenter', () => clearInterval(memoryAutoPlayTimer));
      memoryCarouselEl.addEventListener('mouseleave', () => startMemoryTimer());
    }
  }

  /* ==========================================================================
     5. INTERACTIVE BIRTHDAY SURPRISE & MARIGOLD CELEBRATION
     ========================================================================== */
  const surpriseBoxClosed = document.getElementById('surprise-box-closed');
  const surpriseRevealed = document.getElementById('surprise-revealed');
  const surpriseOpenBtn = document.getElementById('surprise-open-btn');
  const giftBoxTrigger = document.getElementById('gift-box-click-trigger');
  const surpriseReplayBtn = document.getElementById('surprise-replay-btn');

  function openSurprise() {
    if (!surpriseRevealed) return;

    if (surpriseBoxClosed) {
      surpriseBoxClosed.style.display = 'none';
    }
    surpriseRevealed.removeAttribute('hidden');

    // Trigger celebration shower
    triggerCelebrationPetals();

    // If audio is paused and user opened the surprise, gently offer/start audio if permitted
    if (audio && audio.paused && !audio.ended) {
      audio.play().catch(e => console.log('Surprise audio trigger:', e));
    }
  }

  if (surpriseOpenBtn) {
    surpriseOpenBtn.addEventListener('click', openSurprise);
  }
  if (giftBoxTrigger) {
    giftBoxTrigger.addEventListener('click', openSurprise);
    giftBoxTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSurprise();
      }
    });
  }
  if (surpriseReplayBtn) {
    surpriseReplayBtn.addEventListener('click', () => {
      triggerCelebrationPetals();
    });
  }

  /* ==========================================================================
     6. REALISTIC MARIGOLD FLOWER PETALS CANVAS ANIMATION
     ========================================================================== */
  const canvas = document.getElementById('marigold-canvas');
  let ctx = null;
  let petals = [];
  let animationFrameId = null;
  let celebrationEndTime = 0;

  function initCanvas() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  const petalColors = [
    { fill: '#F7B731', shadow: '#E19C17' }, // Golden Marigold Yellow
    { fill: '#FF793F', shadow: '#D35400' }, // Vibrant Saffron Orange
    { fill: '#D96B27', shadow: '#A0450F' }, // Rich Warm Gold-Orange
    { fill: '#F8C291', shadow: '#E59866' }, // Soft Peach Petal
    { fill: '#D4AF37', shadow: '#9E6B24' }  // Metallic Gold Confetti
  ];

  class MarigoldPetal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * -canvas.height : -30;
      this.size = 12 + Math.random() * 16;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.speedY = 1.4 + Math.random() * 2.2;
      this.speedX = -1.2 + Math.random() * 2.4;
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.05;
      this.flipAngle = Math.random() * Math.PI * 2;
      this.flipSpeed = 0.02 + Math.random() * 0.04;
      this.opacity = 0.85 + Math.random() * 0.15;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.angle) * 1.5 + this.speedX;
      this.angle += this.angleSpeed;
      this.flipAngle += this.flipSpeed;

      if (this.y > canvas.height + 40) {
        if (Date.now() < celebrationEndTime) {
          this.reset(false);
        } else {
          this.opacity -= 0.02;
        }
      }
    }

    draw(ctx) {
      if (this.opacity <= 0) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      // Realistic 3D flutter effect using scale
      ctx.scale(Math.cos(this.flipAngle), 1);
      ctx.globalAlpha = Math.max(0, this.opacity);

      // Draw oval teardrop Marigold Petal
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.5, this.size * 0.8, this.size * 0.5, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.5, -this.size * 0.6, -this.size * 0.5, 0, -this.size);
      ctx.closePath();

      ctx.fillStyle = this.color.fill;
      ctx.fill();

      // Petal center ridge
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.7);
      ctx.lineTo(0, this.size * 0.7);
      ctx.strokeStyle = this.color.shadow;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }
  }

  function triggerCelebrationPetals() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !canvas) return;

    if (!ctx) initCanvas();

    petals = [];
    const petalCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < petalCount; i++) {
      petals.push(new MarigoldPetal());
    }

    celebrationEndTime = Date.now() + 12000; // Shower runs for 12 seconds
    cancelAnimationFrame(animationFrameId);
    animatePetals();
  }

  function animatePetals() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activePetals = 0;
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.update();
      p.draw(ctx);
      if (p.opacity > 0) activePetals++;
    }

    if (activePetals > 0) {
      animationFrameId = requestAnimationFrame(animatePetals);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /* ==========================================================================
     7. INITIALIZATION ON DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initMemoryCarousel();
    initCanvas();

    // Setup global gesture listener so ANY touch/click/scroll anywhere triggers playback
    setupGestureListeners();

    // Attempt automatic playback immediately on page open
    startAudio(false);
  });

  // Also verify on window load for browsers that wait for all assets before media play
  window.addEventListener('load', () => {
    if (!audioStarted && audio && audio.paused) {
      startAudio(false);
    }
  });

})();
