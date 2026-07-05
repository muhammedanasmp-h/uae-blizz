// Blizz UAE Admin Panel JS Backend Connection

const API_BASE = window.location.origin + '/api';
let adminToken = localStorage.getItem('blizz_admin_token') || '';

// --- Elements & Nav ---
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const sidebar = document.getElementById('admin-sidebar');
const mainContent = document.querySelector('.main-content');
const btnLogout = document.getElementById('btn-logout');

// Sidebar menu item tab switching
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const tabId = item.getAttribute('data-tab');
    switchTab(tabId);
  });
});

function switchTab(tabId) {
  // Update sidebar active class
  document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
  const activeMenu = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeMenu) activeMenu.classList.add('active');

  // Update visible tab views
  document.querySelectorAll('.tab-view').forEach(view => {
    view.style.display = 'none';
    view.classList.remove('active');
  });
  const activeView = document.getElementById(tabId);
  if (activeView) {
    activeView.style.display = 'block';
    activeView.classList.add('active');
  }

  // Update Title
  const titleMap = {
    'tab-dashboard': 'Overview',
    'tab-products': 'Products Catalog',
    'tab-blog': 'Blog Management',
    'tab-most-sold': 'Most Sold Products',
    'tab-collection': 'Our Collection'
  };
  document.getElementById('page-title').textContent = titleMap[tabId] || 'Dashboard';

  // Mobile sidebar close on navigate
  if (window.innerWidth <= 992) {
    sidebar.classList.remove('active');
  }

  // Refresh tab content
  if (tabId === 'tab-dashboard') loadStats();
  if (tabId === 'tab-products') loadProducts();
  if (tabId === 'tab-blog') loadBlogs();
  if (tabId === 'tab-most-sold') loadMostSold();
  if (tabId === 'tab-collection') loadCollection();
}

// --- Mobile Navigation Drawer Toggle ---
document.getElementById('sidebar-open').addEventListener('click', () => {
  sidebar.classList.add('active');
});

// Close button on mobile sidebar header
const sidebarCloseBtn = document.getElementById('sidebar-close');
if (sidebarCloseBtn) {
  sidebarCloseBtn.style.display = 'block';
  sidebarCloseBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });
}

// --- Auth Handling ---
if (adminToken) {
  loginOverlay.style.display = 'none';
  loadStats();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      adminToken = data.token;
      localStorage.setItem('blizz_admin_token', adminToken);
      loginOverlay.style.display = 'none';
      document.getElementById('login-password').value = '';
      loadStats();
    } else {
      alert(data.error || 'Access Denied: Invalid Security Key');
    }
  } catch (err) {
    console.error(err);
    alert('Failed to reach backend server. Make sure node app is running.');
  }
});

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('blizz_admin_token');
  adminToken = '';
  loginOverlay.style.display = 'flex';
});

// Helper for authorized headers
function getAuthHeaders(extraHeaders = {}) {
  return {
    'x-admin-token': adminToken,
    ...extraHeaders
  };
}

// --- Load Dashboard Overview Stats ---
async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load stats');
    const data = await res.json();

    document.getElementById('stat-total-products').textContent = data.totalProducts || 0;
    document.getElementById('stat-visible-products').textContent = data.visibleProducts || 0;
    document.getElementById('stat-soldout-products').textContent = data.soldoutProducts || 0;
    document.getElementById('stat-total-posts').textContent = data.totalPosts || 0;
    const collectionStatEl = document.getElementById('stat-total-collection');
    if (collectionStatEl) collectionStatEl.textContent = data.totalCollection || 0;
  } catch (err) {
    console.error(err);
  }
}

// --- Image Preview Handlers ---
function setupImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (input && preview) {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => preview.src = event.target.result;
        reader.readAsDataURL(file);
      }
    });
  }
}
setupImagePreview('product-image', 'product-image-preview');
setupImagePreview('blog-image', 'blog-image-preview');

// --- Product Modals & Toggle Functions ---
function openProductModal(productData = null) {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const title = document.getElementById('product-modal-title');
  const preview = document.getElementById('product-image-preview');

  form.reset();
  preview.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";

  if (productData) {
    title.textContent = 'Edit Product';
    document.getElementById('product-id').value = productData._id;
    document.getElementById('product-name').value = productData.name;
    document.getElementById('product-quantity').value = productData.quantity;
    document.getElementById('product-unit').value = productData.unit;
    document.getElementById('product-units-carton').value = productData.unitPerCarton || 1;
    document.getElementById('product-category').value = productData.category;
    document.getElementById('product-price').value = productData.price;
    document.getElementById('product-old-price').value = productData.oldPrice || '';
    document.getElementById('product-visible').checked = productData.isVisible;
    if (productData.image) preview.src = productData.image;
  } else {
    title.textContent = 'Add New Product';
    document.getElementById('product-id').value = '';
  }

  modal.classList.add('active');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

// --- Product CRUD Functions ---
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorised or server issue');
    const products = await res.json();
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';

    products.forEach(p => {
      const isVisibleBadge = p.isVisible 
        ? `<span class="action-badge badge-green">Live</span>`
        : `<span class="action-badge badge-gray">Hidden</span>`;
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="product-cell">
            <img class="product-thumb" src="${p.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23ccc\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4\'%3E%3C/path%3E%3C/svg%3E'}" alt="">
            <div>
              <strong style="display:block">${p.name}</strong>
              <small style="color:var(--text-muted)">${p.quantity}${p.unit} (${p.unitPerCarton} per ctn)</small>
            </div>
          </div>
        </td>
        <td>${p.category}</td>
        <td>
          <span style="font-weight:600">AED ${p.price.toFixed(2)}</span>
          ${p.oldPrice ? `<del style="display:block; font-size:0.8rem; color:var(--accent-red)">AED ${p.oldPrice.toFixed(2)}</del>` : ''}
        </td>
        <td>${isVisibleBadge}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon edit-btn" onclick="editProduct('${p._id}')">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon delete-btn" onclick="deleteProduct('${p._id}')">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

async function editProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: getAuthHeaders()
    });
    const products = await res.json();
    const product = products.find(p => p._id === id);
    if (product) openProductModal(product);
  } catch (err) {
    console.error(err);
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to permanently delete this product?')) return;
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadProducts();
    } else {
      alert('Failed to delete product');
    }
  } catch (err) {
    console.error(err);
  }
}

// Product Form Submission
document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('product-id').value;
  const formData = new FormData();

  formData.append('name', document.getElementById('product-name').value);
  formData.append('quantity', document.getElementById('product-quantity').value);
  formData.append('unit', document.getElementById('product-unit').value);
  formData.append('unitPerCarton', document.getElementById('product-units-carton').value);
  formData.append('category', document.getElementById('product-category').value);
  formData.append('price', document.getElementById('product-price').value);
  formData.append('oldPrice', document.getElementById('product-old-price').value);
  formData.append('isVisible', document.getElementById('product-visible').checked);

  // Defaults for schema fields we are removing/hiding
  formData.append('rating', '5');
  formData.append('badge', 'none');
  formData.append('badgeText', '');
  formData.append('desc', '');
  formData.append('packaging', '');
  formData.append('bgImage', '');

  const fileInput = document.getElementById('product-image');
  if (fileInput.files[0]) {
    formData.append('image', fileInput.files[0]);
  }

  const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: formData
    });

    if (res.ok) {
      closeProductModal();
      loadProducts();
    } else {
      const errData = await res.json();
      alert('Error: ' + errData.error);
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong during product submission.');
  }
});

// --- Blog Modals ---
function openBlogModal(blogData = null) {
  const modal = document.getElementById('blog-modal');
  const form = document.getElementById('blog-form');
  const title = document.getElementById('blog-modal-title');
  const preview = document.getElementById('blog-image-preview');

  form.reset();
  preview.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
  document.getElementById('blog-date').value = new Date().toISOString().split('T')[0];

  if (blogData) {
    title.textContent = 'Edit Blog Post';
    document.getElementById('blog-id').value = blogData._id;
    document.getElementById('blog-title').value = blogData.title;
    document.getElementById('blog-category').value = blogData.category;
    document.getElementById('blog-date').value = new Date(blogData.date).toISOString().split('T')[0];
    document.getElementById('blog-excerpt').value = blogData.excerpt;
    document.getElementById('blog-content').value = blogData.content;
    document.getElementById('blog-published').checked = blogData.isPublished;
    if (blogData.image) preview.src = blogData.image;
  } else {
    title.textContent = 'Create Blog Post';
    document.getElementById('blog-id').value = '';
  }

  modal.classList.add('active');
}

function closeBlogModal() {
  document.getElementById('blog-modal').classList.remove('active');
}

// --- Blog CRUD Functions ---
async function loadBlogs() {
  try {
    const res = await fetch(`${API_BASE}/admin/blog`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorised or server issue');
    const posts = await res.json();
    const tbody = document.getElementById('blog-table-body');
    tbody.innerHTML = '';

    posts.forEach(post => {
      const isPubBadge = post.isPublished 
        ? `<span class="action-badge badge-green">Published</span>`
        : `<span class="action-badge badge-gray">Draft</span>`;
      
      const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong style="display:block">${post.title}</strong>
          <small style="color:var(--text-muted); display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;">
            ${post.excerpt}
          </small>
        </td>
        <td>${post.category}</td>
        <td>${formattedDate}</td>
        <td>${isPubBadge}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon edit-btn" onclick="editBlog('${post._id}')">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon delete-btn" onclick="deleteBlog('${post._id}')">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

async function editBlog(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/blog`, {
      headers: getAuthHeaders()
    });
    const posts = await res.json();
    const post = posts.find(p => p._id === id);
    if (post) openBlogModal(post);
  } catch (err) {
    console.error(err);
  }
}

async function deleteBlog(id) {
  if (!confirm('Are you sure you want to permanently delete this blog post?')) return;
  try {
    const res = await fetch(`${API_BASE}/blog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadBlogs();
    } else {
      alert('Failed to delete blog post');
    }
  } catch (err) {
    console.error(err);
  }
}

// Blog Form Submission
document.getElementById('blog-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('blog-id').value;
  const formData = new FormData();

  formData.append('title', document.getElementById('blog-title').value);
  formData.append('category', document.getElementById('blog-category').value);
  formData.append('date', document.getElementById('blog-date').value);
  formData.append('excerpt', document.getElementById('blog-excerpt').value);
  formData.append('content', document.getElementById('blog-content').value);
  formData.append('isPublished', document.getElementById('blog-published').checked);

  const fileInput = document.getElementById('blog-image');
  if (fileInput.files[0]) {
    formData.append('image', fileInput.files[0]);
  }

  const url = id ? `${API_BASE}/blog/${id}` : `${API_BASE}/blog`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: formData
    });

    if (res.ok) {
      closeBlogModal();
      loadBlogs();
    } else {
      const errData = await res.json();
      alert('Error: ' + errData.error);
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong during blog post submission.');
  }
});

// ─── Most Sold CRUD Functions ─────────────────────────────────────────────────

setupImagePreview('most-sold-image', 'most-sold-image-preview');

function openMostSoldModal(itemData = null) {
  const modal = document.getElementById('most-sold-modal');
  const form = document.getElementById('most-sold-form');
  const title = document.getElementById('most-sold-modal-title');
  const preview = document.getElementById('most-sold-image-preview');

  form.reset();
  preview.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";

  if (itemData) {
    title.textContent = 'Edit Most Sold Product';
    document.getElementById('most-sold-id').value = itemData._id;
    document.getElementById('most-sold-title').value = itemData.title;
    document.getElementById('most-sold-subtitle').value = itemData.subtitle || '';
    document.getElementById('most-sold-price').value = itemData.price;
    document.getElementById('most-sold-label').value = itemData.label || 'MOST SOLD';
    document.getElementById('most-sold-colors').value = itemData.colors || '';
    if (itemData.image) preview.src = itemData.image;
  } else {
    title.textContent = 'Add Most Sold Product';
    document.getElementById('most-sold-id').value = '';
    document.getElementById('most-sold-label').value = 'MOST SOLD';
  }

  modal.classList.add('active');
}

function closeMostSoldModal() {
  document.getElementById('most-sold-modal').classList.remove('active');
}

async function loadMostSold() {
  try {
    const res = await fetch(`${API_BASE}/most-sold`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorised or server issue');
    const items = await res.json();
    const tbody = document.getElementById('most-sold-table-body');
    tbody.innerHTML = '';

    // Update Add button & info label based on count
    const addBtn = document.getElementById('add-most-sold-btn');
    const infoLabel = document.getElementById('most-sold-limit-info');
    if (items.length >= 3) {
      addBtn.disabled = true;
      addBtn.title = 'Limit of 3 products reached for this section';
      addBtn.style.opacity = '0.5';
      addBtn.style.cursor = 'not-allowed';
      infoLabel.textContent = '⚠️ Limit reached — max 3 products allowed. Delete one to add another.';
      infoLabel.style.color = 'var(--accent-red)';
    } else {
      addBtn.disabled = false;
      addBtn.title = '';
      addBtn.style.opacity = '1';
      addBtn.style.cursor = 'pointer';
      infoLabel.textContent = `${items.length}/3 products added`;
      infoLabel.style.color = 'var(--text-muted)';
    }

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">No most sold products yet. Click "Add Most Sold" to begin.</td></tr>`;
      return;
    }

    items.forEach(item => {
      const colorDots = item.colors
        ? item.colors.split(',').map(c => `<span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${c.trim()}; margin-right:3px; border:1px solid rgba(255,255,255,0.2);"></span>`).join('')
        : '—';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="product-cell">
            <img class="product-thumb" src="${item.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23ccc\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4\'%3E%3C/path%3E%3C/svg%3E'}" alt="">
            <strong>${item.title}</strong>
          </div>
        </td>
        <td>${item.subtitle || '—'}</td>
        <td><span style="font-weight:600">AED ${parseFloat(item.price).toFixed(2)}</span></td>
        <td><span class="action-badge badge-green">${item.label}</span></td>
        <td>${colorDots}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon edit-btn" onclick="editMostSold('${item._id}')">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon delete-btn" onclick="deleteMostSold('${item._id}')">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

async function editMostSold(id) {
  try {
    const res = await fetch(`${API_BASE}/most-sold`, {
      headers: getAuthHeaders()
    });
    const items = await res.json();
    const item = items.find(i => i._id === id);
    if (item) openMostSoldModal(item);
  } catch (err) {
    console.error(err);
  }
}

async function deleteMostSold(id) {
  if (!confirm('Are you sure you want to permanently delete this Most Sold product?')) return;
  try {
    const res = await fetch(`${API_BASE}/most-sold/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadMostSold();
    } else {
      alert('Failed to delete most sold product');
    }
  } catch (err) {
    console.error(err);
  }
}

// Most Sold Form Submission
document.getElementById('most-sold-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('most-sold-id').value;
  const formData = new FormData();

  formData.append('title', document.getElementById('most-sold-title').value);
  formData.append('subtitle', document.getElementById('most-sold-subtitle').value);
  formData.append('price', document.getElementById('most-sold-price').value);
  formData.append('label', document.getElementById('most-sold-label').value);
  formData.append('colors', document.getElementById('most-sold-colors').value);

  const fileInput = document.getElementById('most-sold-image');
  if (fileInput.files[0]) {
    formData.append('image', fileInput.files[0]);
  }

  const url = id ? `${API_BASE}/most-sold/${id}` : `${API_BASE}/most-sold`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: formData
    });

    if (res.ok) {
      closeMostSoldModal();
      loadMostSold();
    } else {
      const errData = await res.json();
      alert('Error: ' + errData.error);
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong during most sold submission.');
  }
});

// --- Our Collection Tab Management ---
const collectionModal = document.getElementById('collection-modal');
const collectionForm = document.getElementById('collection-form');

setupImagePreview('collection-image', 'collection-image-preview');
setupImagePreview('collection-bg-image', 'collection-bg-image-preview');

function openCollectionModal(item = null) {
  if (!collectionModal) return;
  collectionModal.classList.add('active');

  const titleEl = document.getElementById('collection-modal-title');
  const idInput = document.getElementById('collection-id');
  const nameInput = document.getElementById('collection-name');
  const descInput = document.getElementById('collection-desc');
  const visibleCheck = document.getElementById('collection-visible');

  // Reset previews
  const defaultPreviewSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
  document.getElementById('collection-image-preview').src = defaultPreviewSvg;
  document.getElementById('collection-bg-image-preview').src = defaultPreviewSvg;

  // Reset inputs
  collectionForm.reset();

  if (item) {
    titleEl.textContent = 'Edit Collection Product';
    idInput.value = item._id || '';
    nameInput.value = item.name || '';
    descInput.value = item.desc || '';
    visibleCheck.checked = item.isVisible !== false;

    if (item.image) {
      document.getElementById('collection-image-preview').src = item.image;
    }
    if (item.bgImage) {
      document.getElementById('collection-bg-image-preview').src = item.bgImage;
    }
  } else {
    titleEl.textContent = 'Add Collection Product';
    idInput.value = '';
    visibleCheck.checked = true;
  }
}

function closeCollectionModal() {
  if (collectionModal) collectionModal.classList.remove('active');
}

async function loadCollection() {
  const tbody = document.getElementById('collection-table-body');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Loading collection products...</td></tr>';

  try {
    const res = await fetch(`${API_BASE}/admin/collection`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load collection');
    const products = await res.json();
    tbody.innerHTML = '';

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No products found in collection. Add one above!</td></tr>';
      return;
    }

    products.forEach(p => {
      const tr = document.createElement('tr');

      // Visibility badge
      const isVisibleBadge = p.isVisible 
        ? `<span class="action-badge badge-green">Live</span>`
        : `<span class="action-badge badge-gray">Hidden</span>`;

      // Limit description length for display in table
      const displayDesc = p.desc && p.desc.length > 80 
        ? p.desc.substring(0, 80) + '...' 
        : (p.desc || '—');

      tr.innerHTML = `
        <td>
          <div class="product-cell">
            <img class="product-thumb" src="${p.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23ccc\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4\'%3E%3C/path%3E%3C/svg%3E'}" alt="">
            <strong>${p.name}</strong>
          </div>
        </td>
        <td>${displayDesc}</td>
        <td>${isVisibleBadge}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon edit-btn" onclick="editCollection('${p._id}')">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon delete-btn" onclick="deleteCollection('${p._id}')">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--accent-red);">Error loading collection products.</td></tr>';
  }
}

async function editCollection(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/collection`, {
      headers: getAuthHeaders()
    });
    const items = await res.json();
    const item = items.find(i => i._id === id);
    if (item) openCollectionModal(item);
  } catch (err) {
    console.error(err);
  }
}

async function deleteCollection(id) {
  if (!confirm('Are you sure you want to permanently delete this product from the homepage Collection?')) return;
  try {
    const res = await fetch(`${API_BASE}/collection/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadCollection();
      loadStats();
    } else {
      alert('Failed to delete product from collection');
    }
  } catch (err) {
    console.error(err);
  }
}

if (collectionForm) {
  collectionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('collection-id').value;
    const formData = new FormData();

    formData.append('name', document.getElementById('collection-name').value);
    formData.append('desc', document.getElementById('collection-desc').value);
    formData.append('isVisible', document.getElementById('collection-visible').checked);
    // Send defaults/empties for schema compatibility
    formData.append('price', '0');
    formData.append('oldPrice', '');
    formData.append('category', 'detergent');
    formData.append('rating', '5');
    formData.append('badge', 'none');
    formData.append('badgeText', '');
    formData.append('packaging', '');

    const imgFile = document.getElementById('collection-image').files[0];
    if (imgFile) formData.append('image', imgFile);

    const bgImgFile = document.getElementById('collection-bg-image').files[0];
    if (bgImgFile) formData.append('bgImage', bgImgFile);

    const url = id ? `${API_BASE}/collection/${id}` : `${API_BASE}/collection`;
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: formData
      });

      if (res.ok) {
        closeCollectionModal();
        loadCollection();
        loadStats();
      } else {
        const errData = await res.json();
        alert('Error: ' + errData.error);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong during collection submission.');
    }
  });
}

// Bind to window for HTML inline event handlers
window.openCollectionModal = openCollectionModal;
window.closeCollectionModal = closeCollectionModal;
window.editCollection = editCollection;
window.deleteCollection = deleteCollection;
window.loadCollection = loadCollection;
