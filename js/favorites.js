document.addEventListener('DOMContentLoaded', renderFavorites);

function getFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem('favorites'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function renderFavorites() {
  const grid = document.getElementById('favorites-grid');
  if (!grid) return;
  const favorites = getFavorites();

  if (!favorites.length) {
    grid.innerHTML = '<div class="empty-state"><i class="fa-regular fa-heart" aria-hidden="true"></i><h2>قائمة المفضلة فارغة</h2><p>أضف الأطعمة التي تهمك من صفحة التفاصيل لتظهر هنا.</p><a class="btn" href="index.html">استكشف الأغذية</a></div>';
    return;
  }

  grid.innerHTML = favorites.map(food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}" loading="lazy" decoding="async" width="600" height="400">
      <div class="food-info">
        <h3>${food.name}</h3>
        <p class="food-cal">${food.calories} سعرة حرارية / 100غ</p>
        <div class="food-macros"><span>محفوظ في المفضلة</span></div>
        <div class="favorite-actions">
          <a href="product.html?id=${encodeURIComponent(food.id)}" class="btn">التفاصيل</a>
          <button class="btn btn-danger btn-remove-fav" type="button" data-id="${food.id}" aria-label="حذف ${food.name} من المفضلة"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>
        </div>
      </div>
    </article>`).join('');

  grid.querySelectorAll('.btn-remove-fav').forEach(button => {
    button.addEventListener('click', () => removeFavorite(button.dataset.id));
  });
}

function removeFavorite(id) {
  const favorites = getFavorites().filter(item => item.id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}