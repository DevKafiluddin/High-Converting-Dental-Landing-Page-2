/**
 * BRIGHTSMILE DENTAL — INTERACTIVE & TRACKING SCRIPT
 */

// Helper to send GTM/GA4 Events
function pushAnalyticsEvent(eventName, eventParams = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventParams,
    timestamp: new Date().toISOString()
  });
  console.log(`[Analytics Event]: ${eventName}`, eventParams);
}

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------- */
  /* 1. ANALYTICS & EVENT TRACKING SETUP                                        */
  /* -------------------------------------------------------------------------- */

  // A. Phone Clicks Tracking
  document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
    phoneLink.addEventListener('click', (e) => {
      pushAnalyticsEvent('phone_click', {
        link_id: phoneLink.id || 'general_phone_link',
        phone_number: phoneLink.getAttribute('href').replace('tel:', '')
      });
    });
  });

  // B. CTA Button Clicks Tracking
  document.querySelectorAll('.btn--cta, .btn--primary').forEach(ctaBtn => {
    ctaBtn.addEventListener('click', () => {
      pushAnalyticsEvent('cta_button_click', {
        button_text: ctaBtn.textContent.trim(),
        target_href: ctaBtn.getAttribute('href')
      });
    });
  });

  // C. Booking Form Submission
  const bookingForm = document.getElementById('appointmentForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const treatment = document.getElementById('treatmentInterest').value;
      const time = document.getElementById('preferredTime').value;

      // Hide form & show success UI
      bookingForm.style.display = 'none';
      document.getElementById('formSuccess').hidden = false;

      // Track confirmation event
      pushAnalyticsEvent('appointment_confirmation', {
        treatment_interest: treatment,
        preferred_time: time
      });
    });
  }

  // D. Scroll Depth Tracking (25%, 50%, 75%, 90%)
  const trackedDepths = new Set();
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    [25, 50, 75, 90].forEach(depth => {
      if (scrollPercent >= depth && !trackedDepths.has(depth)) {
        trackedDepths.add(depth);
        pushAnalyticsEvent('scroll_depth', { percent_scrolled: depth });
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. BEFORE / AFTER INTERACTIVE SLIDER LOGIC                                 */
  /* -------------------------------------------------------------------------- */
  const slider = document.getElementById('baSlider');
  const clip = document.getElementById('baClip');
  const handle = document.getElementById('baHandle');

  if (slider && clip && handle) {
    let isDragging = false;

    const setSliderPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let x = clientX - rect.left;
      
      // Boundaries
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percentage = (x / rect.width) * 100;
      clip.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Mouse Events
    handle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) setSliderPosition(e.clientX);
    });

    // Touch Events for Mobile
    handle.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        setSliderPosition(e.touches[0].clientX);
      }
    });
  }
});