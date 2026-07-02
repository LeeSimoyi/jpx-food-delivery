/* ═══════════════════════════════════════════
   JPX FOOD — ADMIN DASHBOARD LOGIC
   ═══════════════════════════════════════════ */

/* ── AUTH GUARD ── */
const adminSession = JSON.parse(localStorage.getItem('jpx2_admin_session') || 'null');
if(!adminSession || !adminSession.loggedIn){
  window.location.href = 'login.html';
}

/* ── ADMIN MENU ITEMS (extends/overrides PRODUCTS from app.js) ── */
let ADMIN_MENU = JSON.parse(localStorage.getItem('jpx2_admin_menu') || 'null') || PRODUCTS.map(p => ({...p, active:true}));
function saveMenu(){ localStorage.setItem('jpx2_admin_menu', JSON.stringify(ADMIN_MENU)); }

/* ── SAMPLE / SEEDED ORDERS (combines real localStorage orders + demo data for a populated admin view) ── */
function getAllOrders(){
  const realOrders = JSON.parse(localStorage.getItem('jpx2_orders') || '[]').map(o => ({
    ...o, customer: 'Guest Customer', payment: 'card'
  }));
  const seedOrders = JSON.parse(localStorage.getItem('jpx2_admin_orders_seed') || 'null') || [
    {id:'#JPX-58213', customer:'Tatenda Moyo', items:'Classic Burger ×2, Fries', total:'$14.20', status:'pending', payment:'ecocash', date:'Just now'},
    {id:'#JPX-58198', customer:'Chipo Nhamo', items:'Margherita Pizza, Lemonade ×2', total:'$10.20', status:'pending', payment:'card', date:'5 min ago'},
    {id:'#JPX-58177', customer:'Rudo Dube', items:'Grilled Chicken Platter', total:'$9.00', status:'confirmed', payment:'cash', date:'18 min ago'},
    {id:'#JPX-58150', customer:'Tinashe Gore', items:'Sadza & Beef Stew ×2', total:'$9.00', status:'preparing', payment:'ecocash', date:'32 min ago'},
    {id:'#JPX-58122', customer:'Anesu Chari', items:'BBQ Chicken Pizza, Wings 6pc', total:'$12.00', status:'preparing', payment:'card', date:'45 min ago'},
    {id:'#JPX-58099', customer:'Farai Sibanda', items:'Loaded Cheese Fries, Shake', total:'$5.70', status:'delivered', payment:'cash', date:'1 hr ago'},
    {id:'#JPX-58076', customer:'Vimbai Moyo', items:'Pepperoni Pizza', total:'$7.50', status:'delivered', payment:'card', date:'2 hrs ago'},
    {id:'#JPX-58055', customer:'Kuda Ndlovu', items:'Chicken & Chips, Sundae', total:'$8.20', status:'delivered', payment:'ecocash', date:'3 hrs ago'},
    {id:'#JPX-58032', customer:'Nyasha Banda', items:'Spicy Chicken Burger ×3', total:'$14.40', status:'cancelled', payment:'card', date:'5 hrs ago'},
    {id:'#JPX-58011', customer:'Tariro Mhako', items:'Veggie Pizza, Punch', total:'$7.80', status:'delivered', payment:'cash', date:'Yesterday'},
  ];
  if(!localStorage.getItem('jpx2_admin_orders_seed')) localStorage.setItem('jpx2_admin_orders_seed', JSON.stringify(seedOrders));
  return [...realOrders, ...seedOrders];
}
function saveSeedOrders(orders){ localStorage.setItem('jpx2_admin_orders_seed', JSON.stringify(orders)); }

/* ── SIDEBAR / TOPBAR ── */
function initAdminUI(){
  document.getElementById('adminName').textContent = adminSession.name || 'JPX Admin';
  document.getElementById('adminEmail').textContent = adminSession.email;
  document.getElementById('adminAvatar').textContent = (adminSession.name||'JA').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const ham = document.getElementById('adminHamburger');
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('adminOverlay');
  ham.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('open'); });
  overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });
}

function adminLogout(){
  showAdminToast('', 'Logging out…');
  setTimeout(() => {
    localStorage.removeItem('jpx2_admin_session');
    window.location.href = 'login.html';
  }, 500);
}

const TITLES = {overview:'Dashboard Overview', orders:'Order Management', menu:'Menu Management', customers:'Customers', analytics:'Analytics', settings:'Settings'};
function switchAdminPanel(p, el){
  document.querySelectorAll('.admin-panel').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item[data-p]').forEach(x => x.classList.remove('active'));
  document.getElementById('ap-'+p).classList.add('active');
  const nav = el || document.querySelector(`.admin-nav-item[data-p="${p}"]`);
  if(nav) nav.classList.add('active');
  document.getElementById('topbarTitle').textContent = TITLES[p] || p;
  // close mobile sidebar
  document.getElementById('adminSidebar').classList.remove('open');
  document.getElementById('adminOverlay').classList.remove('open');

  if(p === 'overview') renderOverview();
  if(p === 'orders') renderOrdersTable();
  if(p === 'menu') renderMenuTable();
  if(p === 'customers') renderCustomers();
  if(p === 'analytics') renderAnalytics();
}

/* ── TOAST (simple admin version) ── */
function showAdminToast(type, msg){
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa-solid fa-${type==='success'?'check':type==='error'?'xmark':'bell'}"></i><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ── STATUS BADGE HELPER ── */
const STATUS_LABELS = {pending:'Pending', confirmed:'Confirmed', preparing:'Preparing', delivered:'Delivered', cancelled:'Cancelled'};
function statusBadge(status){
  return `<span class="admin-status-badge ${status}">${STATUS_LABELS[status]||status}</span>`;
}

/* ── OVERVIEW ── */
function renderOverview(){
  const orders = getAllOrders();
  const pending = orders.filter(o => o.status==='pending').length;
  const revenue = orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+parseFloat((o.total||'$0').replace('$','')),0);

  document.getElementById('statTotalOrders').textContent = orders.length;
  document.getElementById('statRevenue').textContent = '$'+revenue.toFixed(2);
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statMenuItems').textContent = ADMIN_MENU.length;
  document.getElementById('pendingBadge').textContent = pending;

  document.getElementById('recentOrdersBody').innerHTML = orders.slice(0,6).map(o => `
    <tr>
      <td><strong style="color:var(--primary)">${o.id}</strong></td>
      <td>${o.customer}</td>
      <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.items}</td>
      <td><strong>${o.total}</strong></td>
      <td>${statusBadge(o.status)}</td>
      <td style="color:var(--muted);font-size:.78rem">${o.date}</td>
    </tr>`).join('');

  const best = [...ADMIN_MENU].sort((a,b)=>(b.badge||0)-(a.badge||0)).slice(0,5);
  document.getElementById('bestSellersBody').innerHTML = best.map(p => `
    <tr>
      <td><div class="admin-prod-cell"><img src="${p.img}" alt="${p.name}"/><span>${p.name}</span></div></td>
      <td>${p.cat}</td>
      <td><strong>$${p.price.toFixed(2)}</strong></td>
      <td><i class="fa-solid fa-star" style="color:#F5A623"></i> ${p.rating}</td>
      <td>${p.reviews||0}</td>
    </tr>`).join('');
}

/* ── ORDERS PANEL ── */
let orderStatusFilter = 'all';
let orderSearchTerm = '';
function renderOrdersTable(){
  let orders = getAllOrders();
  if(orderStatusFilter !== 'all') orders = orders.filter(o => o.status === orderStatusFilter);
  if(orderSearchTerm) orders = orders.filter(o => o.id.toLowerCase().includes(orderSearchTerm) || o.customer.toLowerCase().includes(orderSearchTerm));

  const body = document.getElementById('ordersTableBody');
  if(!orders.length){
    body.innerHTML = `<tr><td colspan="7" class="admin-empty-row"><i class="fa-solid fa-receipt" style="font-size:2rem;display:block;margin-bottom:10px;color:var(--gray2)"></i>No orders found</td></tr>`;
    return;
  }
  body.innerHTML = orders.map(o => `
    <tr>
      <td><strong style="color:var(--primary)">${o.id}</strong></td>
      <td>${o.customer}</td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.items}</td>
      <td><strong>${o.total}</strong></td>
      <td style="text-transform:capitalize">${o.payment}</td>
      <td>${statusBadge(o.status)}</td>
      <td>
        <div class="admin-row-actions">
          ${o.status==='pending' ? `<button class="admin-action-btn approve" title="Confirm Order" onclick="updateOrderStatus('${o.id}','confirmed')"><i class="fa-solid fa-check"></i></button>
          <button class="admin-action-btn reject" title="Cancel Order" onclick="updateOrderStatus('${o.id}','cancelled')"><i class="fa-solid fa-xmark"></i></button>` : ''}
          ${o.status==='confirmed' ? `<button class="admin-action-btn approve" title="Mark Preparing" onclick="updateOrderStatus('${o.id}','preparing')"><i class="fa-solid fa-fire-burner"></i></button>` : ''}
          ${o.status==='preparing' ? `<button class="admin-action-btn approve" title="Mark Delivered" onclick="updateOrderStatus('${o.id}','delivered')"><i class="fa-solid fa-truck-fast"></i></button>` : ''}
          <button class="admin-action-btn" title="View Details" onclick="viewOrderDetail('${o.id}')"><i class="fa-solid fa-eye"></i></button>
        </div>
      </td>
    </tr>`).join('');
}
function filterOrdersByStatus(status, el){
  orderStatusFilter = status;
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderOrdersTable();
}
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('orderSearchInput');
  if(searchInput) searchInput.addEventListener('input', e => { orderSearchTerm = e.target.value.toLowerCase().trim(); renderOrdersTable(); });
});

function updateOrderStatus(orderId, newStatus){
  let seedOrders = JSON.parse(localStorage.getItem('jpx2_admin_orders_seed') || '[]');
  const idx = seedOrders.findIndex(o => o.id === orderId);
  if(idx > -1){
    seedOrders[idx].status = newStatus;
    saveSeedOrders(seedOrders);
  } else {
    // also try real orders
    let realOrders = JSON.parse(localStorage.getItem('jpx2_orders') || '[]');
    const ridx = realOrders.findIndex(o => o.id === orderId);
    if(ridx > -1){ realOrders[ridx].status = newStatus; localStorage.setItem('jpx2_orders', JSON.stringify(realOrders)); }
  }
  renderOrdersTable();
  renderOverview();
  const labels = {confirmed:'confirmed', preparing:'marked as preparing', delivered:'marked as delivered', cancelled:'cancelled'};
  showAdminToast('success', `Order ${orderId} ${labels[newStatus]||'updated'}`);
}

function viewOrderDetail(orderId){
  const order = getAllOrders().find(o => o.id === orderId);
  if(!order) return;
  showAdminModal({
    title: `Order ${order.id}`,
    body: `<div style="text-align:left;font-size:.85rem;line-height:1.9">
      <strong>Customer:</strong> ${order.customer}<br>
      <strong>Items:</strong> ${order.items}<br>
      <strong>Total:</strong> ${order.total}<br>
      <strong>Payment:</strong> ${order.payment}<br>
      <strong>Status:</strong> ${STATUS_LABELS[order.status]}<br>
      <strong>Time:</strong> ${order.date}
    </div>`,
    confirmText: 'Close'
  });
}

/* ── MENU MANAGEMENT ── */
function renderMenuTable(){
  const body = document.getElementById('menuTableBody');
  if(!ADMIN_MENU.length){
    body.innerHTML = `<tr><td colspan="7" class="admin-empty-row">No menu items yet</td></tr>`;
    return;
  }
  body.innerHTML = ADMIN_MENU.map(p => `
    <tr>
      <td><div class="admin-prod-cell"><img src="${p.img}" alt="${p.name}"/><span>${p.name}</span></div></td>
      <td>${p.cat}</td>
      <td><strong>$${p.price.toFixed(2)}</strong></td>
      <td style="color:var(--gray2);text-decoration:line-through">$${(p.old||p.price).toFixed(2)}</td>
      <td><i class="fa-solid fa-star" style="color:#F5A623"></i> ${p.rating}</td>
      <td><span class="admin-status-badge ${p.active!==false ? 'delivered' : 'cancelled'}">${p.active!==false ? 'Active' : 'Hidden'}</span></td>
      <td>
        <div class="admin-row-actions">
          <button class="admin-action-btn" title="Edit" onclick="openFoodModal(${p.id})"><i class="fa-solid fa-pen"></i></button>
          <button class="admin-action-btn" title="${p.active!==false?'Hide':'Show'}" onclick="toggleMenuActive(${p.id})"><i class="fa-solid fa-${p.active!==false?'eye-slash':'eye'}"></i></button>
          <button class="admin-action-btn reject" title="Delete" onclick="deleteMenuItem(${p.id})"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function toggleMenuActive(id){
  const item = ADMIN_MENU.find(p => p.id === id);
  if(!item) return;
  item.active = item.active === false ? true : false;
  saveMenu(); renderMenuTable();
  showAdminToast('success', `${item.name} ${item.active ? 'is now visible' : 'is now hidden'} on the menu`);
}
function deleteMenuItem(id){
  const item = ADMIN_MENU.find(p => p.id === id);
  if(!item) return;
  showAdminModal({
    title: 'Delete Menu Item?',
    body: `Are you sure you want to permanently delete "${item.name}"? This cannot be undone.`,
    confirmText: 'Delete', danger: true,
    onConfirm: () => {
      ADMIN_MENU = ADMIN_MENU.filter(p => p.id !== id);
      saveMenu(); renderMenuTable(); renderOverview();
      showAdminToast('success', 'Menu item deleted');
    }
  });
}

let editingFoodId = null;
function openFoodModal(id){
  editingFoodId = id || null;
  const backdrop = document.getElementById('foodModalBackdrop');
  const title = document.getElementById('foodModalTitle');
  if(id){
    const item = ADMIN_MENU.find(p => p.id === id);
    title.textContent = 'Edit Menu Item';
    document.getElementById('fName').value = item.name;
    document.getElementById('fCat').value = item.cat;
    document.getElementById('fUnit').value = item.unit || '1pc';
    document.getElementById('fPrice').value = item.price;
    document.getElementById('fOldPrice').value = item.old || '';
    document.getElementById('fImgUrl').value = item.img;
    document.getElementById('fDesc').value = item.desc || '';
    document.getElementById('foodImgPreview').src = item.img;
    document.getElementById('foodImgPreview').style.display = 'block';
    document.getElementById('uploadIcon').style.display = 'none';
    document.getElementById('uploadText').textContent = 'Click to change image';
  } else {
    title.textContent = 'Add New Menu Item';
    ['fName','fUnit','fPrice','fOldPrice','fImgUrl','fDesc'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fCat').selectedIndex = 0;
    document.getElementById('foodImgPreview').style.display = 'none';
    document.getElementById('uploadIcon').style.display = 'block';
    document.getElementById('uploadText').textContent = 'Click to upload food image (or paste an image URL below)';
  }
  backdrop.classList.add('open');
}
function closeFoodModal(){ document.getElementById('foodModalBackdrop').classList.remove('open'); }

document.addEventListener('DOMContentLoaded', () => {
  const imgInput = document.getElementById('foodImgInput');
  if(imgInput){
    imgInput.addEventListener('change', function(){
      const file = this.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById('foodImgPreview').src = e.target.result;
        document.getElementById('foodImgPreview').style.display = 'block';
        document.getElementById('uploadIcon').style.display = 'none';
        document.getElementById('fImgUrl').value = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  const urlInput = document.getElementById('fImgUrl');
  if(urlInput){
    urlInput.addEventListener('input', function(){
      if(this.value){
        document.getElementById('foodImgPreview').src = this.value;
        document.getElementById('foodImgPreview').style.display = 'block';
        document.getElementById('uploadIcon').style.display = 'none';
      }
    });
  }
});

function saveFoodItem(){
  const name = document.getElementById('fName').value.trim();
  const price = parseFloat(document.getElementById('fPrice').value);
  if(!name || isNaN(price)){
    showAdminToast('error', 'Please enter at least a name and price.');
    return;
  }
  const data = {
    name,
    cat: document.getElementById('fCat').value,
    unit: document.getElementById('fUnit').value.trim() || '1pc',
    price,
    old: parseFloat(document.getElementById('fOldPrice').value) || price * 1.15,
    img: document.getElementById('fImgUrl').value.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    desc: document.getElementById('fDesc').value.trim() || 'Delicious freshly prepared meal.',
  };
  if(editingFoodId){
    const idx = ADMIN_MENU.findIndex(p => p.id === editingFoodId);
    ADMIN_MENU[idx] = {...ADMIN_MENU[idx], ...data};
    showAdminToast('success', `${name} updated successfully`);
  } else {
    const newId = Math.max(0, ...ADMIN_MENU.map(p=>p.id)) + 1;
    ADMIN_MENU.push({id:newId, ...data, rating:4.5, reviews:0, badge:10, active:true});
    showAdminToast('success', `${name} added to menu`);
  }
  saveMenu();
  closeFoodModal();
  renderMenuTable();
  renderOverview();
}

/* ── CUSTOMERS ── */
function renderCustomers(){
  const accounts = JSON.parse(localStorage.getItem('jpx2_accounts') || '[]');
  const seed = [
    {name:'Tatenda Moyo', email:'tatenda@jpxfood.com', orders:14, spent:'$182.40', joined:'Mar 2025'},
    {name:'Chipo Nhamo', email:'chipo@jpxfood.com', orders:9, spent:'$96.10', joined:'Jun 2025'},
    {name:'Rudo Dube', email:'rudo@jpxfood.com', orders:5, spent:'$48.00', joined:'Sep 2025'},
  ];
  const all = [...seed, ...accounts.map(a => ({name:a.name, email:a.email, orders:Math.floor(Math.random()*8)+1, spent:'$'+(Math.random()*150+20).toFixed(2), joined:'2026'}))];
  const body = document.getElementById('customersBody');
  body.innerHTML = all.map(c => `
    <tr>
      <td><div class="admin-prod-cell"><div class="admin-avatar" style="width:32px;height:32px;font-size:.7rem">${c.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div><span>${c.name}</span></div></td>
      <td>${c.email}</td>
      <td>${c.orders}</td>
      <td><strong>${c.spent}</strong></td>
      <td style="color:var(--muted);font-size:.78rem">${c.joined}</td>
    </tr>`).join('');
}

/* ── ANALYTICS ── */
function renderAnalytics(){
  const cats = {};
  ADMIN_MENU.forEach(p => { cats[p.cat] = (cats[p.cat]||0) + (p.reviews||10); });
  const total = Object.values(cats).reduce((a,b)=>a+b,0) || 1;
  document.getElementById('categoryAnalytics').innerHTML = Object.entries(cats).map(([cat,val]) => {
    const pct = Math.round(val/total*100);
    return `<div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:5px"><span>${cat}</span><strong>${pct}%</strong></div>
      <div style="height:9px;background:var(--gray);border-radius:100px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--primary),var(--primary2));border-radius:100px"></div></div>
    </div>`;
  }).join('');

  const orders = getAllOrders();
  const payCounts = {};
  orders.forEach(o => { payCounts[o.payment] = (payCounts[o.payment]||0)+1; });
  const payTotal = orders.length || 1;
  const payLabels = {ecocash:'EcoCash', card:'Card', cash:'Cash on Delivery'};
  document.getElementById('paymentAnalytics').innerHTML = Object.entries(payCounts).map(([m,c]) => {
    const pct = Math.round(c/payTotal*100);
    return `<div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:5px"><span>${payLabels[m]||m}</span><strong>${pct}% (${c} orders)</strong></div>
      <div style="height:9px;background:var(--gray);border-radius:100px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#F5A623,#E8470A);border-radius:100px"></div></div>
    </div>`;
  }).join('');
}

/* ── SIMPLE ADMIN MODAL ── */
function showAdminModal({title, body, confirmText='OK', danger=false, onConfirm}){
  const ov = document.createElement('div');
  ov.className = 'modal-backdrop open';
  ov.innerHTML = `<div class="modal-box" style="text-align:left">
    <h3 style="margin-bottom:14px">${title}</h3>
    <div style="margin-bottom:22px">${body}</div>
    <div class="modal-btns">
      <button class="btn btn-outline" id="amCancel">Close</button>
      ${onConfirm ? `<button class="btn ${danger?'btn-dark':'btn-primary'}" id="amConfirm" style="${danger?'background:#D13030':''}">${confirmText}</button>` : ''}
    </div>
  </div>`;
  document.body.appendChild(ov);
  ov.querySelector('#amCancel').onclick = () => ov.remove();
  const confirmBtn = ov.querySelector('#amConfirm');
  if(confirmBtn) confirmBtn.onclick = () => { ov.remove(); onConfirm && onConfirm(); };
  ov.addEventListener('click', e => { if(e.target === ov) ov.remove(); });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initAdminUI();
  renderOverview();
});

/* ════════════════════════════════════════════════════════════
   ADMIN UPGRADES — v5
   ════════════════════════════════════════════════════════════ */

/* ── GLOBAL TOPBAR SEARCH ── */
document.addEventListener('DOMContentLoaded', () => {
  const globalSearch = document.getElementById('adminGlobalSearch');
  if(globalSearch){
    globalSearch.addEventListener('input', function(){
      const q = this.value.trim().toLowerCase();
      if(!q) return;
      // Auto-switch to orders panel and filter
      switchAdminPanel('orders', document.querySelector('[data-p="orders"]'));
      orderSearchTerm = q;
      document.getElementById('orderSearchInput').value = q;
      renderOrdersTable();
    });
    globalSearch.addEventListener('keydown', e => {
      if(e.key === 'Escape'){ globalSearch.value = ''; orderSearchTerm = ''; renderOrdersTable(); }
    });
  }
});

/* ── NOTIFICATIONS SYSTEM ── */
let notifRead = JSON.parse(sessionStorage.getItem('jpx_admin_notifs_read') || '[]');

function getNotifications(){
  const orders = getAllOrders();
  const pending = orders.filter(o => o.status === 'pending');
  const notifs = [];

  pending.forEach(o => {
    notifs.push({
      id: 'order_'+o.id,
      icon: 'fa-receipt',
      color: '#E8470A',
      title: 'New Order Pending',
      body: `${o.id} from ${o.customer} — ${o.total}`,
      time: o.date || 'Just now',
      read: notifRead.includes('order_'+o.id),
      action: () => {
        switchAdminPanel('orders', document.querySelector('[data-p="orders"]'));
        filterOrdersByStatus('pending', document.querySelector('[data-s="pending"]'));
        document.getElementById('notifBackdrop').style.display = 'none';
      }
    });
  });

  // Also notify about low menu items (< 5 active)
  const activeItems = ADMIN_MENU.filter(i => i.active !== false).length;
  if(activeItems < 6){
    notifs.push({
      id: 'menu_low',
      icon: 'fa-bowl-food',
      color: '#b45309',
      title: 'Low Menu Items',
      body: `Only ${activeItems} items are currently visible to customers.`,
      time: 'Now',
      read: notifRead.includes('menu_low'),
      action: () => {
        switchAdminPanel('menu', document.querySelector('[data-p="menu"]'));
        document.getElementById('notifBackdrop').style.display = 'none';
      }
    });
  }

  return notifs;
}

function updateNotifBadge(){
  const notifs = getNotifications();
  const unread = notifs.filter(n => !n.read).length;
  const dot = document.getElementById('adminNotifDot');
  if(dot) dot.style.display = unread > 0 ? 'block' : 'none';
}

function showNotifPanel(){
  const notifs = getNotifications();
  const list = document.getElementById('notifList');
  const backdrop = document.getElementById('notifBackdrop');

  if(!notifs.length){
    list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted)"><i class="fa-regular fa-bell" style="font-size:2rem;display:block;margin-bottom:10px;color:var(--gray2)"></i>No new notifications</div>';
  } else {
    list.innerHTML = notifs.map(n => `
      <div style="display:flex;gap:12px;padding:12px;border-radius:12px;background:${n.read?'var(--bg)':'rgba(232,71,10,.04)'};border:1px solid var(--gray);margin-bottom:8px;cursor:pointer" onclick="(${n.action.toString()})()">
        <div style="width:38px;height:38px;border-radius:10px;background:${n.color}18;color:${n.color};display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0">
          <i class="fa-solid ${n.icon}"></i>
        </div>
        <div style="flex:1;min-width:0">
          <strong style="display:block;font-size:.84rem;margin-bottom:3px">${n.title}</strong>
          <span style="font-size:.76rem;color:var(--muted)">${n.body}</span>
          <span style="display:block;font-size:.7rem;color:var(--gray2);margin-top:4px">${n.time}</span>
        </div>
        ${!n.read ? '<span style="width:8px;height:8px;border-radius:50%;background:var(--primary);flex-shrink:0;margin-top:6px"></span>' : ''}
      </div>`).join('');
  }
  backdrop.style.display = 'flex';
}

function markAllRead(){
  const notifs = getNotifications();
  notifRead = notifs.map(n => n.id);
  sessionStorage.setItem('jpx_admin_notifs_read', JSON.stringify(notifRead));
  updateNotifBadge();
  showAdminToast('success', 'All notifications marked as read');
  document.getElementById('notifBackdrop').style.display = 'none';
}

// Close notif panel on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.getElementById('notifBackdrop');
  if(backdrop){
    backdrop.addEventListener('click', e => {
      if(e.target === backdrop) backdrop.style.display = 'none';
    });
  }
  // Start polling for new orders every 30s to keep badge fresh
  setInterval(() => {
    updateNotifBadge();
    // Refresh pending count badge in sidebar
    const pending = getAllOrders().filter(o => o.status === 'pending').length;
    const badge = document.getElementById('pendingBadge');
    if(badge) badge.textContent = pending;
  }, 30000);

  // Initial badge update
  setTimeout(updateNotifBadge, 500);
});

/* ── KEYBOARD SHORTCUTS ── */
document.addEventListener('keydown', e => {
  // Ctrl/Cmd + K → focus global search
  if((e.ctrlKey || e.metaKey) && e.key === 'k'){
    e.preventDefault();
    const gs = document.getElementById('adminGlobalSearch');
    if(gs){ gs.focus(); gs.select(); }
  }
  // Escape → close any open modal
  if(e.key === 'Escape'){
    closeFoodModal();
    const nb = document.getElementById('notifBackdrop');
    if(nb) nb.style.display = 'none';
    const overlay = document.getElementById('adminOverlay');
    const sidebar = document.getElementById('adminSidebar');
    if(overlay && sidebar){ overlay.classList.remove('open'); sidebar.classList.remove('open'); }
  }
});

/* ── AUTO-REFRESH OVERVIEW every 15s when visible ── */
let overviewRefreshInterval = null;
function startOverviewRefresh(){
  if(overviewRefreshInterval) clearInterval(overviewRefreshInterval);
  overviewRefreshInterval = setInterval(() => {
    const panel = document.getElementById('ap-overview');
    if(panel && panel.classList.contains('active')) renderOverview();
  }, 15000);
}
document.addEventListener('DOMContentLoaded', startOverviewRefresh);
