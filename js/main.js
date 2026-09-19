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
  const dropdown = document.querySelector('.dropdown');
  const dropbtn = document.querySelector('.dropbtn');

  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      const icon = toggle.querySelector('i');
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    nav.addEventListener('click', e => {
      if (e.target.closest('a') && !e.target.closest('.dropdown-content')) closeMenu();
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.main-header')) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  if (dropdown && dropbtn) {
    dropbtn.addEventListener('click', e => {
      e.preventDefault();
      const open = dropdown.classList.toggle('open');
      dropbtn.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        dropbtn.setAttribute('aria-expanded', 'false');
      }
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

  const navHTML = appData.categories.map(cat =>
    `<a href="category.html?id=${encodeURIComponent(cat.id)}">${cat.name}</a>`
  ).join('');

  const footerHTML = appData.categories.map(cat =>
    `<li><a href="category.html?id=${encodeURIComponent(cat.id)}">${cat.name}</a></li>`
  ).join('');

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
