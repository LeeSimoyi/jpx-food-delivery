/* ════════════════════════════════════════════════════════════
   JPX FOOD — app.js
   Shared JavaScript loaded on every customer-facing page.

   Contents:
     1. PRODUCTS DATA     — the master food menu array
     2. CART               — add/remove/update cart items (localStorage)
     3. TOAST / MODAL       — small reusable UI feedback helpers
     4. NAVBAR              — sticky scroll state + mobile drawer
     5. CART PANEL           — slide-in cart sidebar
     6. REVEAL ANIMATIONS    — scroll-triggered fade-ins
     7. PRODUCT CARD BUILDER — renders a single food card's HTML
     8. NAVBAR SEARCH        — live dropdown search across the menu
     9. INIT                — runs once the page has loaded
   ════════════════════════════════════════════════════════════ */

/* ── PRODUCTS DATA ── */
const PRODUCTS = [
  {id:1, name:'JPX Classic Burger',  cat:'Burgers',      price:5.50, old:6.00, unit:'1pc',  rating:4.9, reviews:214, badge:12, desc:'Double beef patty, cheddar, house sauce',   img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80'},
  {id:2, name:'Spicy Chicken Burger',cat:'Burgers',      price:4.80, old:5.50, unit:'1pc',  rating:4.7, reviews:178, badge:13, desc:'Crispy chicken, jalapeños, sriracha mayo',   img:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80'},
  {id:3, name:'Margherita Pizza',    cat:'Pizza',        price:6.20, old:7.00, unit:'1pc',  rating:4.8, reviews:132, badge:11, desc:'San Marzano tomato, mozzarella, basil',       img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80'},
  {id:4, name:'BBQ Chicken Pizza',   cat:'Pizza',        price:7.00, old:8.00, unit:'1pc',  rating:4.6, reviews:98,  badge:13, desc:'Smoky BBQ base, grilled chicken, red onion', img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80'},
  {id:5, name:'Grilled Chicken',     cat:'Chicken',      price:7.50, old:8.50, unit:'1pc',  rating:4.9, reviews:301, badge:12, desc:'Herb-marinated half chicken, fries, salad',  img:'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80'},
  {id:6, name:'Sadza & Beef Stew',   cat:'Local Meals',  price:4.50, old:5.00, unit:'1pc',  rating:4.8, reviews:256, badge:10, desc:'Traditional sadza with slow-cooked beef',    img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80'},
  {id:7, name:'Loaded Cheese Fries', cat:'Sides',        price:3.20, old:3.50, unit:'1pc',  rating:4.7, reviews:189, badge:9,  desc:'Crispy fries, cheddar, bacon bits',          img:'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80'},
  {id:8, name:'Chocolate Lava Cake', cat:'Desserts',     price:3.80, old:4.20, unit:'1pc',  rating:5.0, reviews:112, badge:10, desc:'Warm cake, molten centre, vanilla ice cream', img:'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80'},
  {id:9, name:'Chicken Wings 6pc',   cat:'Chicken',      price:5.00, old:5.50, unit:'6pcs', rating:4.7, reviews:145, badge:9,  desc:'Buffalo or BBQ, crispy wings',               img:'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&q=80'},
  {id:10,name:'Veggie Pizza',        cat:'Pizza',        price:5.80, old:6.50, unit:'1pc',  rating:4.5, reviews:67,  badge:11, desc:'Roasted peppers, mushroom, olives',           img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80'},
  {id:11,name:'Chicken & Chips',     cat:'Chicken',      price:5.20, old:6.00, unit:'1pc',  rating:4.8, reviews:220, badge:13, desc:'Golden fried chicken, seasoned fries',        img:'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80'},
  {id:12,name:'Mango Fruit Punch',   cat:'Drinks',       price:2.00, old:2.20, unit:'500ml',rating:4.6, reviews:88,  badge:9,  desc:'Fresh mango, passion fruit, ginger',         img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80'},
  {id:13,name:'Sadza & Greens',      cat:'Local Meals',  price:4.00, old:4.50, unit:'1pc',  rating:4.8, reviews:180, badge:11, desc:'Sadza with pumpkin leaves and peanuts',       img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80'},
  {id:14,name:'Ice Cream Sundae',    cat:'Desserts',     price:3.00, old:3.50, unit:'1pc',  rating:4.8, reviews:95,  badge:14, desc:'Three scoops, choc sauce, nuts, cherry',     img:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80'},
  {id:15,name:'Sparkling Lemonade',  cat:'Drinks',       price:1.80, old:2.00, unit:'400ml',rating:4.5, reviews:60,  badge:10, desc:'Fresh lemon, mint, soda water, honey',       img:'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80'},
  {id:16,name:'Beef Burger Deluxe',  cat:'Burgers',      price:6.50, old:7.50, unit:'1pc',  rating:4.8, reviews:167, badge:13, desc:'Triple patty, bacon, special sauce',          img:'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&q=80'},
  {id:17,name:'Pepperoni Pizza',     cat:'Pizza',        price:7.50, old:8.50, unit:'1pc',  rating:4.9, reviews:203, badge:12, desc:'Loaded pepperoni, mozzarella, tomato',        img:'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80'},
  {id:18,name:'Fried Chicken Meal',  cat:'Chicken',      price:6.00, old:7.00, unit:'1pc',  rating:4.7, reviews:134, badge:14, desc:'3-piece fried chicken, coleslaw, roll',       img:'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80'},
  {id:19,name:'Chocolate Shake',     cat:'Drinks',       price:2.50, old:3.00, unit:'400ml',rating:4.8, reviews:77,  badge:17, desc:'Rich chocolate milkshake with whipped cream', img:'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80'},
  {id:20,name:'Onion Rings',         cat:'Sides',        price:2.80, old:3.20, unit:'1pc',  rating:4.6, reviews:98,  badge:13, desc:'Crispy beer-battered onion rings',           img:'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80'},
];

/* ── CART ── */
let cart = JSON.parse(localStorage.getItem('jpx2_cart') || '[]');
function saveCart(){ localStorage.setItem('jpx2_cart', JSON.stringify(cart)); }

function addToCart(id){
  const p = PRODUCTS.find(x => x.id === id); if(!p) return;
  const ex = cart.find(c => c.id === id);
  if(ex) ex.qty++;
  else cart.push({...p, qty:1});
  saveCart(); updateCartUI(); renderCartPanel();
  bumpBadge();
  showToast(`<i class="fa-solid fa-check"></i> ${p.name} added to cart`, 'success');
}
function removeFromCart(id){
  cart = cart.filter(c => c.id !== id);
  saveCart(); updateCartUI(); renderCartPanel();
  if(typeof renderCartPage==='function') renderCartPage();
}
function changeQty(id, delta){
  const item = cart.find(c => c.id === id); if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(); updateCartUI(); renderCartPanel();
  if(typeof renderCartPage==='function') renderCartPage();
}
function clearCart(){
  cart = []; saveCart(); updateCartUI(); renderCartPanel();
  if(typeof renderCartPage==='function') renderCartPage();
}
function cartTotal(){ return cart.reduce((s,c) => s + c.price * c.qty, 0); }
function cartCount(){ return cart.reduce((s,c) => s + c.qty, 0); }

function updateCartUI(){
  const n = cartCount();
  document.querySelectorAll('.cart-count').forEach(b => {
    b.textContent = n;
    b.style.opacity = n > 0 ? '1' : '0';
    b.style.transform = n > 0 ? 'scale(1)' : 'scale(0)';
  });
}
function bumpBadge(){
  document.querySelectorAll('.cart-count').forEach(b => {
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    setTimeout(() => b.classList.remove('bump'), 350);
  });
}

function renderCartPanel(){
  const body = document.getElementById('cartPanelBody');
  const totEl = document.getElementById('cartPanelTotal');
  const hdCount = document.getElementById('cartPanelCount');
  if(!body) return;
  const n = cartCount();
  if(hdCount) hdCount.textContent = n ? `${n} item${n>1?'s':''}` : '';
  if(!cart.length){
    body.innerHTML = `<div class="cart-empty-state">
      <i class="fa-solid fa-bag-shopping"></i>
      <p>Your cart is empty</p>
      <a href="${window.location.pathname.includes('/pages/')? '' : 'pages/'}menu.html" class="btn btn-primary btn-sm">Browse Menu</a>
    </div>`;
    if(totEl) totEl.textContent = '$0.00'; return;
  }
  body.innerHTML = cart.map(c => `
    <div class="cart-item">
      <img class="cart-item-img" src="${c.img}" alt="${c.name}" loading="lazy"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-unit">${c.unit}</div>
        <div class="cart-item-price">$${(c.price*c.qty).toFixed(2)}</div>
        <div class="cart-qty-row">
          <button class="cqb" onclick="changeQty(${c.id},-1)"><i class="fa-solid fa-minus"></i></button>
          <span class="cqn">${c.qty}</span>
          <button class="cqb" onclick="changeQty(${c.id},1)"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
      <button class="cart-item-del" onclick="removeFromCart(${c.id})" title="Remove"><i class="fa-solid fa-trash-can"></i></button>
    </div>`).join('');
  if(totEl) totEl.textContent = '$'+cartTotal().toFixed(2);
  const totEl2 = document.getElementById('cartPanelTotalFinal');
  if(totEl2) totEl2.textContent = '$'+cartTotal().toFixed(2);
}

/* Cart panel open/close */
function initCartPanel(){
  const btn = document.getElementById('cartBtn');
  const backdrop = document.getElementById('cartBackdrop');
  const panel = document.getElementById('cartPanel');
  const closeBtn = document.getElementById('cartClose');
  function open(){ backdrop&&backdrop.classList.add('open'); panel&&panel.classList.add('open'); document.body.style.overflow='hidden'; renderCartPanel(); }
  function close(){ backdrop&&backdrop.classList.remove('open'); panel&&panel.classList.remove('open'); document.body.style.overflow=''; }
  btn&&btn.addEventListener('click', open);
  closeBtn&&closeBtn.addEventListener('click', close);
  backdrop&&backdrop.addEventListener('click', close);
}

/* ── TOAST ── */
function showToast(html, type=''){
  let wrap = document.getElementById('toastWrap');
  if(!wrap){ wrap = document.createElement('div'); wrap.className='toast-wrap'; wrap.id='toastWrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = `toast ${type}`; t.innerHTML = html;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 3300);
}

/* ── MODAL ── */
function showModal({iconClass='warn', title, body, confirmText='Confirm', cancelText='Cancel', onConfirm}){
  const icons = {warn:'fa-triangle-exclamation', danger:'fa-trash-can', success:'fa-check'};
  const ov = document.createElement('div');
  ov.className = 'modal-backdrop open';
  ov.innerHTML = `<div class="modal-box">
    <div class="modal-icon ${iconClass}"><i class="fa-solid ${icons[iconClass]||icons.warn}"></i></div>
    <h3>${title}</h3><p>${body}</p>
    <div class="modal-btns">
      <button class="btn btn-outline" id="mCancel">${cancelText}</button>
      <button class="btn btn-primary" id="mConfirm">${confirmText}</button>
    </div>
  </div>`;
  document.body.appendChild(ov);
  ov.querySelector('#mCancel').onclick = () => ov.remove();
  ov.querySelector('#mConfirm').onclick = () => { ov.remove(); onConfirm&&onConfirm(); };
  ov.addEventListener('click', e => { if(e.target===ov) ov.remove(); });
}

/* ── NAVBAR ── */
function initNavbar(){
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const drawer = document.getElementById('navDrawer');
  const overlay = document.getElementById('navOverlay');
  const closeBtn = document.getElementById('drawerClose');

  function open(){ ham&&ham.classList.add('active'); drawer&&drawer.classList.add('open'); overlay&&overlay.classList.add('open'); document.body.style.overflow='hidden'; }
  function close(){ ham&&ham.classList.remove('active'); drawer&&drawer.classList.remove('open'); overlay&&overlay.classList.remove('open'); document.body.style.overflow=''; }

  ham&&ham.addEventListener('click', () => drawer&&drawer.classList.contains('open') ? close() : open());
  closeBtn&&closeBtn.addEventListener('click', close);
  overlay&&overlay.addEventListener('click', close);
  drawer&&drawer.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if(e.key==='Escape') close(); });
}

/* ── REVEAL ── */
function initReveal(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, {threshold:.08});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── PRODUCT CARD HTML ── */
function productCardHTML(p, prefix=''){
  const off = Math.round((1 - p.price/p.old)*100);
  return `<div class="product-card" onclick="window.location='${prefix}food-detail.html?id=${p.id}'">
    <div class="product-card-img">
      <img src="${p.img}" alt="${p.name}" loading="lazy"/>
      <span class="discount-badge">${off}% OFF</span>
    </div>
    <div class="product-card-body">
      <div class="product-name">${p.name}</div>
      <div class="product-rating"><i class="fa-solid fa-star"></i> ${p.rating} (${p.reviews})</div>
      <div class="product-price-row">
        <div class="price-wrap">
          <span class="price-main">$${p.price.toFixed(1)}</span>
          <span class="price-unit">/${p.unit}</span>
          <span class="price-old">$${p.old.toFixed(1)}</span>
        </div>
        <button class="product-add-btn" onclick="event.stopPropagation();addToCart(${p.id})" aria-label="Add to cart">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  </div>`;
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  updateCartUI();
  initCartPanel();
  renderCartPanel();
});

/* ── NAVBAR SEARCH ── */
function initNavSearch(){
  const inputs = document.querySelectorAll('#navSearch');
  inputs.forEach(input => {
    const wrap = input.closest('.nav-search');
    if(!wrap) return;
    let dropdown = wrap.querySelector('.search-dropdown');
    if(!dropdown){
      dropdown = document.createElement('div');
      dropdown.className = 'search-dropdown';
      wrap.style.position = 'relative';
      wrap.appendChild(dropdown);
    }
    const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';

    function renderResults(q){
      if(!q){ dropdown.classList.remove('open'); dropdown.innerHTML=''; return; }
      const matches = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      ).slice(0, 6);

      if(!matches.length){
        dropdown.innerHTML = `<div class="search-empty"><i class="fa-solid fa-bowl-food"></i>No dishes found for "${q}"</div>`;
        dropdown.classList.add('open');
        return;
      }
      dropdown.innerHTML = matches.map(p => `
        <div class="search-result-item" onclick="window.location='${prefix}food-detail.html?id=${p.id}'">
          <img src="${p.img}" alt="${p.name}" loading="lazy"/>
          <div class="search-result-info"><strong>${p.name}</strong><span>${p.cat}</span></div>
          <span class="search-result-price">$${p.price.toFixed(2)}</span>
        </div>`).join('') +
        `<div class="search-view-all" onclick="window.location='${prefix}menu.html?q=${encodeURIComponent(q)}'">
          <i class="fa-solid fa-magnifying-glass"></i> View all results for "${q}"
        </div>`;
      dropdown.classList.add('open');
    }

    input.addEventListener('input', e => renderResults(e.target.value.trim().toLowerCase()));
    input.addEventListener('focus', e => { if(e.target.value.trim()) renderResults(e.target.value.trim().toLowerCase()); });
    input.addEventListener('keydown', e => {
      if(e.key === 'Enter'){
        const q = input.value.trim();
        if(q) window.location = prefix + 'menu.html?q=' + encodeURIComponent(q);
      }
      if(e.key === 'Escape'){ dropdown.classList.remove('open'); input.blur(); }
    });
    document.addEventListener('click', e => {
      if(!wrap.contains(e.target)) dropdown.classList.remove('open');
    });
  });
}
document.addEventListener('DOMContentLoaded', initNavSearch);

/* ── SESSION-AWARE NAVBAR ── */
function initSessionNav(){
  const session = JSON.parse(localStorage.getItem('jpx2_session') || 'null');
  const signinEl = document.getElementById('navSignin');
  const profileEl = document.getElementById('navProfile');
  const profileInitEl = document.getElementById('navProfileInit');
  const profileNameEl = document.getElementById('navProfileName');
  const profileDropdown = document.getElementById('navProfileDropdown');

  if(!signinEl && !profileEl) return; // navbar not present on this page

  if(session && session.loggedIn){
    // Show profile avatar, hide sign-in button
    if(signinEl) signinEl.style.display = 'none';
    if(profileEl) profileEl.style.display = 'flex';

    // Set initials
    const initials = (session.name || 'U')
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    if(profileInitEl) profileInitEl.textContent = initials;
    if(profileNameEl) profileNameEl.textContent = session.name ? session.name.split(' ')[0] : 'Account';
  } else {
    // Not logged in — show sign-in, hide profile
    if(signinEl) signinEl.style.display = 'flex';
    if(profileEl) profileEl.style.display = 'none';
  }

  // Toggle dropdown on click
  if(profileEl && profileDropdown){
    profileEl.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      if(profileDropdown) profileDropdown.classList.remove('open');
    });
  }
}

/* Logout from navbar */
function navLogout(){
  localStorage.removeItem('jpx2_session');
  showToast('<i class="fa-solid fa-right-from-bracket"></i> Signed out successfully','');
  setTimeout(() => window.location.href = (window.location.pathname.includes('/pages/') ? '' : 'pages/') + 'login.html', 700);
}

document.addEventListener('DOMContentLoaded', initSessionNav);

/* ── UPDATE MOBILE DRAWER based on session ── */
function initDrawerSession(){
  const session = JSON.parse(localStorage.getItem('jpx2_session') || 'null');
  const drawerFooter = document.querySelector('.drawer-footer');
  if(!drawerFooter) return;

  const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';

  if(session && session.loggedIn){
    const initials = (session.name || 'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const firstName = session.name ? session.name.split(' ')[0] : 'Account';
    drawerFooter.innerHTML = `
      <div style="display:flex;align-items:center;gap:11px;padding:12px 16px;background:var(--bg);border-radius:12px;margin-bottom:14px">
        <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary2));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:.82rem;flex-shrink:0">${initials}</div>
        <div><strong style="font-size:.88rem;display:block">${session.name}</strong><span style="font-size:.74rem;color:var(--muted)">${session.email||''}</span></div>
      </div>
      <a href="${prefix}dashboard.html" class="drawer-btn-outline"><i class="fa-solid fa-gauge"></i> My Account</a>
      <button onclick="navLogout()" style="width:100%;padding:12px;border-radius:12px;background:rgba(209,48,48,.08);color:#D13030;border:1.5px solid rgba(209,48,48,.25);font-weight:700;font-size:.88rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;font-family:var(--font)"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>`;
  }
  // If not logged in — leave drawer footer as-is with Sign In + Order Now buttons
}

document.addEventListener('DOMContentLoaded', initDrawerSession);

/* ── BACK TO TOP BUTTON ── */
function initBackToTop(){
  // Create button if not present
  let btn = document.getElementById('backToTopBtn');
  if(!btn){
    btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
    document.body.appendChild(btn);
  }
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
    // Navbar scroll shadow
    const nav = document.getElementById('navbar');
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  }, {passive:true});
}

/* ── ANNOUNCEMENT BAR ── */
function initAnnounceBar(){
  // Don't show if dismissed this session
  if(sessionStorage.getItem('jpx_announce_dismissed')) return;
  // Only on homepage and menu
  const path = window.location.pathname;
  const isHome = path.endsWith('index.html') || path.endsWith('/') || path.endsWith('/jpx-food-v2/');
  const isMenu = path.includes('menu.html');
  if(!isHome && !isMenu) return;

  const bar = document.createElement('div');
  bar.className = 'announce-bar';
  bar.id = 'announceBar';
  bar.innerHTML = `
    <i class="fa-solid fa-tag"></i>
    <span>Use code <strong>JPXFIRST</strong> at checkout for 20% off your first order! 
    <a href="${isHome ? 'pages/' : ''}menu.html">Order now</a></span>
    <button class="announce-bar-close" onclick="dismissAnnounce()" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>`;
  document.body.insertBefore(bar, document.body.firstChild);
  // Adjust body padding for both bar + navbar
  const barH = bar.offsetHeight || 38;
  document.body.style.paddingTop = (66 + barH) + 'px';
}
function dismissAnnounce(){
  const bar = document.getElementById('announceBar');
  if(bar){ bar.style.display = 'none'; document.body.style.paddingTop = '66px'; }
  sessionStorage.setItem('jpx_announce_dismissed', '1');
}

document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();
  initAnnounceBar();
});

/* ── NEWSLETTER SUBSCRIPTION ── */
function subscribeNewsletter(){
  const input = document.getElementById('footerNlEmail');
  if(!input) return;
  const email = input.value.trim();
  if(!email || !/\S+@\S+\.\S+/.test(email)){
    showToast('<i class="fa-solid fa-triangle-exclamation"></i> Please enter a valid email address.', 'error');
    return;
  }
  // Save to localStorage
  const subs = JSON.parse(localStorage.getItem('jpx2_newsletter') || '[]');
  if(subs.includes(email)){
    showToast('<i class="fa-solid fa-info"></i> You are already subscribed!', '');
    return;
  }
  subs.push(email);
  localStorage.setItem('jpx2_newsletter', JSON.stringify(subs));
  input.value = '';
  showToast('<i class="fa-solid fa-check"></i> Subscribed! You\'ll receive our best deals by email.', 'success');
}
