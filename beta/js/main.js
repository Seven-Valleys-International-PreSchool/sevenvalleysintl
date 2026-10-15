/**
 * Seven Valleys International Preschool - Interactive Scripts
 * Mobile menu drawer, Hero Slider, YouTube Video Autoplay & Controls, Reviews Auto & Manual Carousel, WhatsApp routing & FAQs
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAnnouncementBar();
  initHeroSection();
  initFaqAccordion();
  initTestimonialsSlider();
  initWhatsAppForms();
  initStickyHeader();
});

/* ==========================================================================
   1. Mobile Menu Drawer Navigation
   ========================================================================== */
// function initMobileMenu() {
//   const menuBtn = document.getElementById('mobile-menu-btn');
//   const closeBtn = document.getElementById('mobile-menu-close');
//   const backdrop = document.getElementById('mobile-menu-backdrop');
//   const panel = document.getElementById('mobile-menu-panel');

//   if (!menuBtn || !panel) return;

//   function openMenu(e) {
//     if (e) e.preventDefault();
//     if (backdrop) backdrop.classList.add('open');
//     panel.classList.add('open');
//     document.body.style.overflow = 'hidden';
//     menuBtn.setAttribute('aria-expanded', 'true');
//   }

//   function closeMenu(e) {
//     if (e) e.preventDefault();
//     if (backdrop) backdrop.classList.remove('open');
//     panel.classList.remove('open');
//     document.body.style.overflow = '';
//     menuBtn.setAttribute('aria-expanded', 'false');
//   }

//   menuBtn.addEventListener('click', openMenu);
//   if (closeBtn) closeBtn.addEventListener('click', closeMenu);
//   if (backdrop) backdrop.addEventListener('click', closeMenu);

//   // Close on Escape key
//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape' && panel.classList.contains('open')) {
//       closeMenu();
//     }
//   });

//   // Close on navigation link click inside mobile drawer
//   const navLinks = panel.querySelectorAll('a');
//   navLinks.forEach(link => {
//     link.addEventListener('click', closeMenu);
//   });
// }
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const panel = document.getElementById('mobile-menu-panel');

  if (!menuBtn || !panel) return;

  function openMenu(e) {
    if (e) e.preventDefault();

    backdrop?.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    backdrop?.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Allow normal navigation when a menu link is clicked.
  panel.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   2. Announcement Bar
   ========================================================================== */
function initAnnouncementBar() {
  const dismissBtn = document.getElementById('announcement-dismiss');
  const bar = document.getElementById('announcement-bar');
  if (dismissBtn && bar) {
    dismissBtn.addEventListener('click', () => {
      bar.style.display = 'none';
    });
  }
}

/* ==========================================================================
   3. Sticky Header Elevation
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-sm');
    } else {
      header.classList.remove('shadow-md', 'bg-white/95', 'backdrop-blur-sm');
    }
  });
}

/* ==========================================================================
   4. Hero Section: Full-Width Carousel & YouTube Video Controls
   ========================================================================== */
// Global player reference for YouTube IFrame API
window.ytHeroPlayer = null;

function initHeroSection() {
  // --- A. Carousel Slider Logic (index2.html) ---
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval = null;

  if (slides.length > 0) {
    function goToSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => {
        d.classList.remove('bg-brand-pink', 'bg-white', 'w-8');
        d.classList.add('bg-white/50', 'w-3');
      });

      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('bg-white/50', 'w-3');
        dots[currentSlide].classList.add('bg-brand-pink', 'w-8');
      }
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        resetTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        resetTimer();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
        resetTimer();
      });
    });

    function startTimer() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    function resetTimer() {
      clearInterval(slideInterval);
      startTimer();
    }

    // Pause on hover / touch over carousel
    const carouselContainer = slides[0]?.parentElement;
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
      carouselContainer.addEventListener('mouseleave', () => resetTimer());
      carouselContainer.addEventListener('touchstart', () => clearInterval(slideInterval), { passive: true });
      carouselContainer.addEventListener('touchend', () => resetTimer(), { passive: true });
    }

    startTimer();
  }

  // --- B. YouTube Video Autoplay & Interactive Controls (index3.html) ---
  initYouTubeHero();
}

/**
 * Initialize YouTube Player with automatic playback and custom Play/Pause & Mute/Unmute buttons
 */
function initYouTubeHero() {
  const ytIframe = document.getElementById('hero-youtube-player');
  const playToggleBtn = document.getElementById('hero-video-play-toggle');
  const muteToggleBtn = document.getElementById('hero-video-mute-toggle');
  const videoContainer = document.getElementById('hero-video-container');

  if (!ytIframe) return;

  // Responsive video sizing: Guarantee 100% full-width cover with no black letterboxing
  function resizeHeroVideo() {
    if (!videoContainer || !ytIframe) return;
    const w = videoContainer.clientWidth || window.innerWidth;
    const h = videoContainer.clientHeight || window.innerHeight;
    const aspect = 16 / 9;

    if (w / h > aspect) {
      ytIframe.style.width = (w + 2) + 'px';
      ytIframe.style.height = Math.ceil((w + 2) / aspect) + 'px';
    } else {
      ytIframe.style.width = Math.ceil((h + 2) * aspect) + 'px';
      ytIframe.style.height = (h + 2) + 'px';
    }
  }

  resizeHeroVideo();
  window.addEventListener('resize', resizeHeroVideo);
  window.addEventListener('orientationchange', resizeHeroVideo);

  let isPlaying = true;
  let isMuted = true;

  function updatePlayBtnUI(playing) {
    isPlaying = playing;
    if (!playToggleBtn) return;
    if (playing) {
      playToggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pause Video</span>';
    } else {
      playToggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Play Video</span>';
    }
  }

  function updateMuteBtnUI(muted) {
    isMuted = muted;
    if (!muteToggleBtn) return;
    if (muted) {
      muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      muteToggleBtn.setAttribute('title', 'Unmute Audio');
    } else {
      muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      muteToggleBtn.setAttribute('title', 'Mute Audio');
    }
  }

  // Send message directly to YouTube iframe as fallback
  function sendIframeCommand(command, args = []) {
    if (ytIframe && ytIframe.contentWindow) {
      ytIframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: args
      }), '*');
    }
  }

  // Bind YouTube Iframe API
  function createPlayer() {
    if (typeof YT !== 'undefined' && YT.Player) {
      try {
        window.ytHeroPlayer = new YT.Player('hero-youtube-player', {
          events: {
            onReady: function(event) {
              try {
                event.target.mute();
                event.target.playVideo();
                updatePlayBtnUI(true);
                updateMuteBtnUI(true);
              } catch (e) {
                console.warn("YouTube onReady play error:", e);
              }
            },
            onStateChange: function(event) {
              if (event.data === YT.PlayerState.ENDED) {
                event.target.playVideo();
              } else if (event.data === YT.PlayerState.PLAYING) {
                updatePlayBtnUI(true);
              } else if (event.data === YT.PlayerState.PAUSED) {
                updatePlayBtnUI(false);
              }
            }
          }
        });
      } catch (err) {
        console.warn("Could not bind YT.Player to iframe:", err);
      }
    }
  }

  // Load YouTube IFrame API script if not present
  if (typeof YT === 'undefined' || !YT.Player) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = function() {
      createPlayer();
    };
  } else {
    createPlayer();
  }

  // Ensure autoplay kicks off upon first document interaction if browser blocked it
  const kickstartAutoplay = () => {
    if (ytIframe) {
      sendIframeCommand('mute');
      sendIframeCommand('playVideo');
      if (window.ytHeroPlayer && typeof window.ytHeroPlayer.playVideo === 'function') {
        try { window.ytHeroPlayer.playVideo(); } catch (e) {}
      }
    }
    document.removeEventListener('click', kickstartAutoplay);
    document.removeEventListener('touchstart', kickstartAutoplay);
  };
  document.addEventListener('click', kickstartAutoplay, { once: true });
  document.addEventListener('touchstart', kickstartAutoplay, { once: true, passive: true });

  // Play/Pause button event
  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.ytHeroPlayer && typeof window.ytHeroPlayer.getPlayerState === 'function') {
        try {
          const state = window.ytHeroPlayer.getPlayerState();
          if (state === 1) { // PLAYING
            window.ytHeroPlayer.pauseVideo();
            updatePlayBtnUI(false);
            return;
          } else {
            window.ytHeroPlayer.playVideo();
            updatePlayBtnUI(true);
            return;
          }
        } catch (err) {
          console.warn("API state check fallback", err);
        }
      }

      // Fallback via postMessage
      if (isPlaying) {
        sendIframeCommand('pauseVideo');
        updatePlayBtnUI(false);
      } else {
        sendIframeCommand('playVideo');
        updatePlayBtnUI(true);
      }
    });
  }

  // Mute/Unmute audio button event
  if (muteToggleBtn) {
    muteToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.ytHeroPlayer && typeof window.ytHeroPlayer.isMuted === 'function') {
        try {
          if (window.ytHeroPlayer.isMuted()) {
            window.ytHeroPlayer.unMute();
            updateMuteBtnUI(false);
            showToast("Video audio unmuted");
            return;
          } else {
            window.ytHeroPlayer.mute();
            updateMuteBtnUI(true);
            showToast("Video audio muted");
            return;
          }
        } catch (err) {
          console.warn("API mute check fallback", err);
        }
      }

      // Fallback via postMessage
      if (isMuted) {
        sendIframeCommand('unMute');
        updateMuteBtnUI(false);
        showToast("Video audio unmuted");
      } else {
        sendIframeCommand('mute');
        updateMuteBtnUI(true);
        showToast("Video audio muted");
      }
    });
  }
}

/* ==========================================================================
   5. What Parents Say (Auto & Manual Reviews Carousel)
   ========================================================================== */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('review-prev-btn');
  const nextBtn = document.getElementById('review-next-btn');
  const countDisplay = document.getElementById('review-count-display');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentIndex = 0;
  let autoTimer = null;

  if (slides.length === 0) return;

  function showSlide(index) {
    // Hide all slides
    slides.forEach((slide) => {
      slide.classList.remove('active');
      slide.style.display = 'none';
    });

    // Reset dots
    dots.forEach((dot) => {
      dot.classList.remove('bg-brand-pink', 'w-8');
      dot.classList.add('bg-slate-300', 'w-2.5');
    });

    currentIndex = (index + slides.length) % slides.length;
    
    // Show active slide
    slides[currentIndex].classList.add('active');
    slides[currentIndex].style.display = 'block';

    // Highlight active dot
    if (dots[currentIndex]) {
      dots[currentIndex].classList.remove('bg-slate-300', 'w-2.5');
      dots[currentIndex].classList.add('bg-brand-pink', 'w-8');
    }

    // Update count display
    if (countDisplay) {
      countDisplay.textContent = `${currentIndex + 1} / ${slides.length}`;
    }
  }

  function nextReview() {
    showSlide(currentIndex + 1);
  }

  function prevReview() {
    showSlide(currentIndex - 1);
  }

  function startReviewTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextReview, 4500); // Auto-scrolls every 4.5 seconds
  }

  function restartReviewTimer() {
    clearInterval(autoTimer);
    startReviewTimer();
  }

  // Manual Controls: Next & Prev
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextReview();
      restartReviewTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevReview();
      restartReviewTimer();
    });
  }

  // Manual Controls: Dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(idx);
      restartReviewTimer();
    });
  });

  // Touch Swipe Gesture Support for Mobile
  const reviewWrapper = slides[0]?.parentElement;
  if (reviewWrapper) {
    let touchStartX = 0;
    let touchEndX = 0;

    reviewWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoTimer);
    }, { passive: true });

    reviewWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchEndX - touchStartX;
      if (diffX < -40) {
        nextReview(); // Swiped left -> next
      } else if (diffX > 40) {
        prevReview(); // Swiped right -> prev
      }
      restartReviewTimer();
    }, { passive: true });

    // Desktop hover pause
    reviewWrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
    reviewWrapper.addEventListener('mouseleave', () => startReviewTimer());
  }

  // Initial display & start auto timer
  showSlide(0);
  startReviewTimer();
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle clicked item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. WhatsApp Form Handler
   Sends all form submission data directly to WhatsApp on +919109357416
   ========================================================================== */
const SCHOOL_WHATSAPP_NUMBER = '919109357416';

function sendToWhatsApp(data, sourceTitle = 'Admission Inquiry') {
  let message = `🎒 *Seven Valleys International Preschool*\n`;
  message += `📋 *${sourceTitle}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;

  if (data.parentName) message += `👤 *Parent's Name:* ${data.parentName}\n`;
  if (data.phone) message += `📞 *Contact Number:* ${data.phone}\n`;
  if (data.email) message += `✉️ *Email Address:* ${data.email}\n`;
  if (data.childName) message += `👶 *Child's Name:* ${data.childName}\n`;
  if (data.childAge) message += `🎂 *Child's Age / DOB:* ${data.childAge}\n`;
  if (data.program) message += `🏫 *Program Interested:* ${data.program}\n`;
  if (data.tourDate) message += `📅 *Preferred Tour Date:* ${data.tourDate}\n`;
  if (data.message) message += `💬 *Message/Notes:* ${data.message}\n`;

  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📍 *Sent via School Official Website*`;

  const encodedUrl = `https://wa.me/${SCHOOL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  
  showToast("Opening WhatsApp with your details...");

  setTimeout(() => {
    window.open(encodedUrl, '_blank');
  }, 500);
}

function initWhatsAppForms() {
  const forms = document.querySelectorAll('form[data-whatsapp-form]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        parentName: form.querySelector('[name="parentName"]')?.value.trim() || '',
        phone: form.querySelector('[name="phone"]')?.value.trim() || '',
        email: form.querySelector('[name="email"]')?.value.trim() || '',
        childName: form.querySelector('[name="childName"]')?.value.trim() || '',
        childAge: form.querySelector('[name="childAge"]')?.value.trim() || '',
        program: form.querySelector('[name="program"]')?.value.trim() || '',
        tourDate: form.querySelector('[name="tourDate"]')?.value.trim() || '',
        message: form.querySelector('[name="message"]')?.value.trim() || ''
      };

      if (!formData.parentName || !formData.phone) {
        showToast("Please enter Parent's Name and Phone number", "warning");
        return;
      }

      const formTitle = form.getAttribute('data-form-title') || 'Campus Tour Booking';
      sendToWhatsApp(formData, formTitle);
    });
  });
}

/* ==========================================================================
   8. Modern Toast Notification
   ========================================================================== */
function showToast(text, type = "success") {
  let toast = document.getElementById('sv-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sv-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all duration-300 transform translate-y-12 opacity-0';
    document.body.appendChild(toast);
  }

  if (type === "warning") {
    toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all duration-300 transform translate-y-0 opacity-100 bg-amber-500 text-white';
    toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${text}</span>`;
  } else {
    toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all duration-300 transform translate-y-0 opacity-100 bg-[#12C7D9] text-white';
    toast.innerHTML = `<i class="fa-brands fa-whatsapp text-lg"></i> <span>${text}</span>`;
  }

  setTimeout(() => {
    toast.classList.add('translate-y-12', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3500);
}

// Global helper for direct WhatsApp quick button clicks
window.chatWithUsDirectly = function(customTopic = "General Inquiry") {
  const text = `Hello Seven Valleys International Preschool! I'm interested in learning more about ${customTopic}. Could you please share the details?`;
  window.open(`https://wa.me/${SCHOOL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
};
