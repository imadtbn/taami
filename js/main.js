let appData = null;

document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initNavigation();
  fetchData();
});

function setCurrentYear() {
  document.querySelectorAll('#current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

function initNavigation() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.getElementById('mainNav');
  const dropdown = nav?.querySelector('.dropdown');
  const dropbtn = dropdown?.querySelector('.dropbtn');

  const closeCategories = () => {
    if (!dropdown || !dropbtn) return;
    dropdown.classList.remove('open');
    dropbtn.setAttribute('aria-expanded', 'false');
  };

  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'فتح القائمة');
    const icon = toggle.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars';
    closeCategories();
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      if (!open) closeCategories();
    });

    nav.addEventListener('click', e => {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.main-header')) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) closeMenu();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const wasOpen = nav.classList.contains('is-open');
        closeMenu();
        if (wasOpen) toggle.focus();
      }
    });
  }

  if (dropdown && dropbtn) {
    dropbtn.addEventListener('click', e => {
      e.preventDefault();
      const open = dropdown.classList.toggle('open');
      dropbtn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) closeCategories();
    });
  }
}

async function fetchData() {
  try {
    const response = await fetch('data/food_data.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    appData = await response.json();
    populateCategories();
    if (document.getElementById('home-categories-grid')) renderHomeCategories();
    document.dispatchEvent(new CustomEvent('dataLoaded', { detail: appData }));
  } catch (error) {
    console.error('تعذر تحميل البيانات:', error);
    document.querySelectorAll('.loader').forEach(el => {
      el.className = 'error-state';
      el.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><h2>تعذر تحميل البيانات</h2><p>تحقق من الاتصال ثم أعد تحميل الصفحة.</p>';
    });
  }
}

function populateCategories() {
  if (!appData?.categories) return;
  const navCategories = document.getElementById('nav-categories');
  const footerCategories = document.getElementById('footer-categories');

  const categoryIcons = {
    'red-meat': 'fa-drumstick-bite',
    'white-meat': 'fa-egg',
    seafood: 'fa-fish-fins',
    legumes: 'fa-seedling',
    vegetables: 'fa-carrot',
    fruits: 'fa-apple-whole',
    'nuts-seeds': 'fa-leaf',
    dairy: 'fa-cheese',
    'whole-grains': 'fa-wheat-awn'
  };
  const navHTML = appData.categories.map(cat => {
    const icon = categoryIcons[cat.id] || 'fa-utensils';
    return `<a href="category.html?id=${encodeURIComponent(cat.id)}"><span class="nav-icon" aria-hidden="true"><i class="fa-solid ${icon}"></i></span><span class="nav-label">${cat.name}</span></a>`;
  }).join('');

  const footerHTML = appData.categories.map(cat => {
    const icon = categoryIcons[cat.id] || 'fa-utensils';
    return `<li><a class="footer-link" href="category.html?id=${encodeURIComponent(cat.id)}"><span class="footer-link-icon" aria-hidden="true"><i class="fa-solid ${icon}"></i></span><span class="footer-link-label">${cat.name}</span></a></li>`;
  }).join('');

  if (navCategories) navCategories.innerHTML = navHTML;
  if (footerCategories) footerCategories.innerHTML = footerHTML;
}

function renderHomeCategories() {
  const grid = document.getElementById('home-categories-grid');
  if (!grid || !appData) return;

  grid.innerHTML = appData.categories.map(cat => {
    const count = appData.foods.filter(food => food.categoryId === cat.id).length;
    return `
      <a href="category.html?id=${encodeURIComponent(cat.id)}" class="category-card">
        <img src="${cat.image}" alt="${cat.name}" loading="lazy" decoding="async" width="400" height="300">
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
        <span class="category-count">${count} أنواع</span>
      </a>`;
  }).join('');
}
