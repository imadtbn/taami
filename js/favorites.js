document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
});

function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    if(!grid) return;

    let favs = JSON.parse(localStorage.getItem('favorites')) || [];

    if(favs.length === 0) {
        grid.innerHTML = '<p class="empty-msg" style="grid-column: 1 / -1; text-align: center; color: var(--text-light);">قائمة المفضلة لديك فارغة. ابدأ بتصفح الأطعمة وإضافتها هنا!</p>';
        return;
    }

    let html = '';
    favs.forEach(food => {
        html += `
            <div class="food-card">
                <img src="${food.image}" alt="${food.name}">
                <div class="food-info">
                    <h3>${food.name}</h3>
                    <p class="food-cal">${food.calories} سعرة حرارية</p>
                    <div style="display: flex; gap: 10px; margin-top: auto;">
                        <a href="product.html?id=${food.id}" class="btn" style="flex: 1; text-align: center;">التفاصيل</a>
                        <button class="btn btn-remove-fav" data-id="${food.id}" style="background-color: #e74c3c;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;

    // Attach remove events
    const removeBtns = document.querySelectorAll('.btn-remove-fav');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            removeFavorite(id);
        });
    });
}

function removeFavorite(id) {
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    favs = favs.filter(f => f.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favs));
    renderFavorites(); // Re-render
}
