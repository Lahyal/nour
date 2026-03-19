/* ============================================================
   NOUR THEME — theme.js
   Salla Twilight Theme
   Version: 1.0.0
   ============================================================ */

'use strict';

/* ── GALLERY ── */
function switchThumb(thumb, imgUrl) {
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  const main = document.getElementById('mainProductImg');
  if (main) {
    main.style.opacity = '0';
    main.style.transform = 'scale(0.98)';
    setTimeout(() => {
      main.src = imgUrl;
      main.style.opacity = '1';
      main.style.transform = 'scale(1)';
    }, 150);
  }
}

function goSlide(idx, dot) {
  document.querySelectorAll('.img-dot').forEach(d => d.classList.remove('active'));
  dot.classList.add('active');
  const thumb = document.querySelectorAll('.thumb')[idx];
  if (thumb) thumb.click();
}

/* ── ACCORDION ── */
function toggleAcc(btn) {
  const body = btn.nextElementSibling;
  const icon = btn.querySelector('.acc-icon');
  const isOpen = body.classList.contains('open');
  // close all
  document.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.acc-head').forEach(h => {
    h.classList.remove('open');
    const i = h.querySelector('.acc-icon');
    if (i) i.textContent = '+';
  });
  // open clicked
  if (!isOpen) {
    body.classList.add('open');
    btn.classList.add('open');
    if (icon) icon.textContent = '−';
  }
}

/* ── FAQ ── */
function toggleFaq(item) {
  const answer = item.querySelector('.faq-a');
  const plus   = item.querySelector('.faq-plus');
  const isOpen = item.classList.contains('open');
  // close all
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    const a = i.querySelector('.faq-a');
    const p = i.querySelector('.faq-plus');
    if (a) a.classList.remove('open');
    if (p) p.textContent = '+';
  });
  // open clicked
  if (!isOpen) {
    item.classList.add('open');
    if (answer) answer.classList.add('open');
    if (plus)   plus.textContent = '−';
  }
}

/* ── QUANTITY ── */
function chQty(delta) {
  const input = document.getElementById('qtyVal');
  if (!input) return;
  const max = parseInt(input.max) || 99;
  const val = Math.max(1, Math.min(max, parseInt(input.value || 1) + delta));
  input.value = val;
  updateSubtotal();
}

function updateSubtotal() {
  const input    = document.getElementById('qtyVal');
  const display  = document.getElementById('subtotalDisplay');
  const priceEl  = document.getElementById('priceNow');
  if (!input || !display || !priceEl) return;

  const qty   = parseInt(input.value) || 1;
  const price = parseFloat(priceEl.textContent.replace(/[^\d.]/g, '')) || 0;
  const total = (price * qty).toFixed(2);

  // get currency from price-currency element
  const currencyEl = document.querySelector('.price-currency');
  const currency   = currencyEl ? currencyEl.textContent.trim() : 'ر.س';

  display.textContent = total + ' ' + currency;
}

/* ── SUBSCRIPTION TOGGLE ── */
var subType = 'once';
var basePrice = 0;
var subDiscount = 0.15; // 15% default, overridden below

function initSubscription() {
  const priceEl    = document.getElementById('priceNow');
  const discountEl = document.getElementById('subDiscountPct');
  if (priceEl) basePrice    = parseFloat(priceEl.textContent) || 0;
  if (discountEl) subDiscount = parseFloat(discountEl.dataset.pct || 15) / 100;
}

function selectSub(type) {
  subType = type;

  const once      = document.getElementById('subOnce');
  const recurring = document.getElementById('subRecurring');
  const priceEl   = document.getElementById('priceNow');

  if (once)      once.classList.toggle('selected',      type === 'once');
  if (recurring) recurring.classList.toggle('selected', type === 'recurring');

  const radioOnce      = document.getElementById('radioOnce');
  const radioRecurring = document.getElementById('radioRecurring');
  if (radioOnce)      radioOnce.className      = 'sub-radio' + (type === 'once'      ? ' selected' : '');
  if (radioRecurring) radioRecurring.className = 'sub-radio' + (type === 'recurring' ? ' selected' : '');

  if (priceEl && basePrice > 0) {
    const newPrice = type === 'recurring'
      ? Math.round(basePrice * (1 - subDiscount))
      : basePrice;
    priceEl.textContent = newPrice.toFixed(2);
    updateSubtotal();
  }
}

/* ── BUNDLE SELECTOR ── */
var bundleQty   = 1;
var bundlePrice = 0;

function selectBundle(idx, unitPrice, qty) {
  bundleQty   = qty;
  bundlePrice = unitPrice;

  document.querySelectorAll('.bundle-card').forEach((card, i) => {
    card.classList.toggle('active', i + 1 === idx);
  });

  // update price block
  const priceEl = document.getElementById('priceNow');
  if (priceEl) priceEl.textContent = unitPrice.toFixed(2);

  // update bundle total
  const totalEl   = document.getElementById('bundleTotalPrice');
  const wasEl     = document.getElementById('bundleTotalWas');
  const saveEl    = document.getElementById('bundleSaveLabel');
  const origPrice = parseFloat(document.querySelector('.price-was')?.textContent) || 0;

  if (totalEl)   totalEl.textContent  = (unitPrice * qty).toFixed(2) + ' ' + getCurrency();
  if (wasEl && origPrice) wasEl.textContent = (origPrice * qty).toFixed(2) + ' ' + getCurrency();

  // sync qty input
  const qtyInput = document.getElementById('qtyVal');
  if (qtyInput) qtyInput.value = qty;

  updateSubtotal();
}

function getCurrency() {
  const el = document.querySelector('.price-currency');
  return el ? el.textContent.trim() : 'ر.س';
}

/* ── ADD TO CART ── */
function addToCart() {
  const btn = document.getElementById('addBtn');
  if (!btn) return;

  // animate button
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="hgi-stroke hgi-checkmark-circle-01" style="font-size:20px"></i> تمت الإضافة!';
  btn.style.background = 'var(--success)';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    btn.disabled = false;
  }, 2000);
}

function buyNow() {
  // Salla Web Component handles actual checkout
  window.location.href = '#checkout';
}

/* ── STICKY BAR ── */
function initStickyBar() {
  const bar  = document.getElementById('stickyBar');
  const hero = document.querySelector('.product-hero');
  if (!bar || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => bar.classList.toggle('show', !entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(hero);
}

/* ── MOBILE MENU ── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (!menu) return;
  menu.classList.toggle('open');
  if (btn) btn.classList.toggle('open');
  // close search if open
  const search = document.getElementById('searchBar');
  if (search && search.classList.contains('open')) search.classList.remove('open');
}

/* ── SEARCH BAR ── */
function toggleSearch() {
  const bar = document.getElementById('searchBar');
  if (!bar) return;
  bar.classList.toggle('open');
  if (bar.classList.contains('open')) {
    const input = bar.querySelector('input, salla-search');
    if (input) setTimeout(() => input.focus(), 100);
  }
  // close menu if open
  const menu = document.getElementById('mobileMenu');
  if (menu && menu.classList.contains('open')) menu.classList.remove('open');
}

/* ── LANGUAGE TOGGLE ── */
var currentLang = document.documentElement.lang || 'ar';

function toggleLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  document.documentElement.lang = currentLang;
  document.documentElement.dir  = currentLang === 'ar' ? 'rtl' : 'ltr';
  const btn = document.querySelector('.lang-btn');
  if (btn) btn.textContent = currentLang === 'ar' ? '🌐 EN' : '🌐 ع';
  // Salla handles full locale switch — this is a preview toggle only
}

/* ── VARIANT SELECTOR ── */
function selectVariant(btn, name, optionId) {
  const group = document.querySelectorAll(`.vbtn[data-option="${optionId}"]`);
  group.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const label = document.getElementById('variantLabel-' + optionId);
  if (label) label.textContent = name;
}

/* ── HELPFUL VOTING ── */
function voteHelpful(btn, type) {
  const parent = btn.closest('.tc-helpful, .review-helpful');
  if (!parent) return;
  parent.querySelectorAll('.hbtn-sm').forEach(b => b.style.opacity = '0.5');
  btn.style.opacity   = '1';
  btn.style.color     = 'var(--forest)';
  btn.style.borderColor = 'var(--forest)';
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── CLOSE ON OUTSIDE CLICK ── */
document.addEventListener('click', e => {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  const search = document.getElementById('searchBar');

  if (menu && menu.classList.contains('open') &&
      !menu.contains(e.target) && !hamburger?.contains(e.target)) {
    menu.classList.remove('open');
    hamburger?.classList.remove('open');
  }

  if (search && search.classList.contains('open') &&
      !search.contains(e.target) &&
      !e.target.closest('[onclick="toggleSearch()"]')) {
    search.classList.remove('open');
  }
});

/* ── COUNTDOWN TIMER ── */
function initCountdowns() {
  document.querySelectorAll('[data-expiry]').forEach(el => {
    const expiry = new Date(el.dataset.expiry);
    if (isNaN(expiry.getTime())) return;

    function tick() {
      const diff = expiry - new Date();
      if (diff <= 0) {
        el.textContent = 'انتهى العرض';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);
      el.innerHTML = `<i class="hgi-stroke hgi-clock-01" style="font-size:12px"></i> ينتهي خلال: ${d}ي ${h}س ${m}د ${s}ث`;
    }
    tick();
    setInterval(tick, 1000);
  });
}

/* ── INTERSECTION OBSERVER — animate on scroll ── */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.stat-card, .tc, .review-card, .ben-item, .faq-item, .product-card, .vid-card'
  ).forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    observer.observe(el);
  });
}

/* ── IMAGE LAZY LOAD ── */
function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

/* ── NEWSLETTER FORM ── */
function submitNewsletter(e) {
  e && e.preventDefault();
  const input = document.querySelector('.newsletter-input');
  const btn   = document.querySelector('.newsletter-btn');
  if (!input || !input.value.trim()) return;

  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ تم الاشتراك!';
    btn.style.background = 'var(--success)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
    }, 3000);
  }
  // In production: salla newsletter API handles this via web component
}

/* ── CONTACT FORM ── */
function submitContact(e) {
  e && e.preventDefault();
  const btn = document.querySelector('.contact-form .btn-main, .contact-form .btn-primary');
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="hgi-stroke hgi-checkmark-circle-01"></i> تم الإرسال!';
  btn.style.background = 'var(--success)';
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.background = '';
  }, 3000);
}

/* ── HEADER SCROLL BEHAVIOUR ── */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      header.style.boxShadow = '0 4px 24px rgba(20,20,18,.12)';
    } else {
      header.style.boxShadow = '';
    }
    lastY = y;
  }, { passive: true });
}

/* ── MAIN INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initStickyBar();
  initScrollAnimations();
  initLazyImages();
  initCountdowns();
  initSubscription();
  initHeaderScroll();

  // gallery image transition style
  const mainImg = document.getElementById('mainProductImg');
  if (mainImg) {
    mainImg.style.transition = 'opacity .15s ease, transform .15s ease';
  }

  // qty input live update
  const qtyInput = document.getElementById('qtyVal');
  if (qtyInput) {
    qtyInput.addEventListener('input', updateSubtotal);
  }
});
