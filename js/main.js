document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Load Data
    fetchData();
});

let appData = null;

async function fetchData() {
    try {
        const response = await fetch('data/food_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        appData = await response.json();

        // Populate Navigation and Footer Categories
        populateCategories();

        // Render Home Page Categories if on index
        if(document.getElementById('home-categories-grid')) {
            renderHomeCategories();
        }

        // Dispatch event that data is loaded
        document.dispatchEvent(new CustomEvent('dataLoaded', { detail: appData }));

    } catch (error) {
        console.error("Could not fetch data:", error);
    }
}

function populateCategories() {
    if (!appData || !appData.categories) return;

    const navCategories = document.getElementById('nav-categories');
    const footerCategories = document.getElementById('footer-categories');

    let navHTML = '';
    let footerHTML = '';

    appData.categories.forEach(cat => {
        const link = `category.html?id=${cat.id}`;
        navHTML += `<a href="${link}">${cat.name}</a>`;
        footerHTML += `<li><a href="${link}">${cat.name}</a></li>`;
    });

    if(navCategories) navCategories.innerHTML = navHTML;
    if(footerCategories) footerCategories.innerHTML = footerHTML;
}

function renderHomeCategories() {
    const grid = document.getElementById('home-categories-grid');
    if(!grid || !appData) return;

    let html = '';
    appData.categories.forEach(cat => {
        // Calculate count dynamically
        const count = appData.foods.filter(food => food.categoryId === cat.id).length;

        html += `
            <a href="category.html?id=${cat.id}" class="category-card">
                <img src="${cat.image}" alt="${cat.name}">
                <h3>${cat.name}</h3>
                <p>${cat.description}</p>
                <div class="category-count">${count} أنواع</div>
            </a>
        `;
    });

    grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
