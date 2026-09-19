document.addEventListener('dataLoaded', (e) => {
  const data = e.detail;
  const productId = new URLSearchParams(location.search).get('id');
  const container = document.getElementById('product-container');

  const showError = () => {
    container.innerHTML = '<div class="error-state"><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i><h1>الطعام غير موجود</h1><p>قد يكون الرابط غير صحيح أو تمت إزالة العنصر.</p><a href="index.html" class="btn">العودة للرئيسية</a></div>';
  };

  if (!productId) return showError();
  const food = data.foods.find(f => f.id === productId);
  if (!food) return showError();

  const category = data.categories.find(c => c.id === food.categoryId);
  const favorites = getFavorites();
  const isFavorite = favorites.some(item => item.id === food.id);
  const vitamins = (food.nutrition.vitamins || []).map(v => `<li>${v.name} <span>(${v.dv} من القيمة اليومية)</span></li>`).join('');

  const related = data.foods
    .filter(item => item.categoryId === food.categoryId && item.id !== food.id)
    .slice(0, 3);

  const relatedHTML = related.length ? `
    <section class="related-products" aria-labelledby="related-title">
      <h2 id="related-title">أطعمة ذات صلة</h2>
      <div class="foods-grid">
        ${related.map(item => `
          <article class="food-card">
            <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" width="600" height="400">
            <div class="food-info"><h3>${item.name}</h3><p class="food-cal">${item.nutrition.calories} سعرة / 100غ</p><a href="product.html?id=${encodeURIComponent(item.id)}" class="btn btn-block">عرض التفاصيل</a></div>
          </article>`).join('')}
      </div>
    </section>` : '';

  container.innerHTML = `
    <nav class="breadcrumb" aria-label="مسار الصفحة"><a href="index.html">الرئيسية</a><span>/</span><a href="category.html?id=${encodeURIComponent(category?.id || '')}">${category?.name || 'الفئات'}</a><span>/</span><span aria-current="page">${food.name}</span></nav>
    <article class="product-details">
      <div class="product-image"><img src="${food.image}" alt="${food.name}" decoding="async" width="600" height="400"></div>
      <div class="product-info">
        <h1>${food.name}</h1>
        <p class="product-desc">${food.description}</p>
        <div class="product-actions"><button class="btn btn-outline" id="fav-btn" type="button" aria-pressed="${isFavorite}"><i class="${isFavorite ? 'fa-solid text-red' : 'fa-regular'} fa-heart" aria-hidden="true"></i><span id="fav-text">${isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}</span></button></div>
        <div class="nutrition-summary" aria-label="ملخص القيم الغذائية">
          <div class="nutrition-stat"><strong>${food.nutrition.calories}</strong><span>سعرة</span></div>
          <div class="nutrition-stat"><strong>${food.nutrition.protein}غ</strong><span>بروتين</span></div>
          <div class="nutrition-stat"><strong>${food.nutrition.carbs}غ</strong><span>كربوهيدرات</span></div>
          <div class="nutrition-stat"><strong>${food.nutrition.totalFat}غ</strong><span>دهون</span></div>
        </div>
        <section class="nutrition-table-container" aria-labelledby="nutrition-title">
          <h3 id="nutrition-title">القيمة الغذائية لكل 100 غرام</h3>
          <div class="table-scroll"><table class="nutrition-table"><tbody>
            <tr><th scope="row">السعرات الحرارية</th><td>${food.nutrition.calories} ككال</td></tr>
            <tr><th scope="row">البروتين</th><td>${food.nutrition.protein} غ</td></tr>
            <tr><th scope="row">الكربوهيدرات</th><td>${food.nutrition.carbs} غ</td></tr>
            <tr><th scope="row">الدهون الكلية</th><td>${food.nutrition.totalFat} غ</td></tr>
            <tr class="sub-row"><th scope="row">الدهون المشبعة</th><td>${food.nutrition.saturatedFat} غ</td></tr>
            <tr class="sub-row"><th scope="row">الدهون غير المشبعة</th><td>${food.nutrition.unsaturatedFat} غ</td></tr>
            <tr><th scope="row">الألياف</th><td>${food.nutrition.fiber} غ</td></tr>
            <tr><th scope="row">السكر</th><td>${food.nutrition.sugar} غ</td></tr>
          </tbody></table></div>
          ${vitamins ? `<h4>الفيتامينات والمعادن الرئيسية</h4><ul class="vitamins-list">${vitamins}</ul>` : ''}
          <p class="source-note">القيم المعروضة معلومات مرجعية عامة وقد تختلف حسب طريقة التحضير والمنتج.</p>
        </section>
      </div>
    </article>
    ${relatedHTML}`;

  document.title = `${food.name} | دليلك الغذائي الشامل`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `القيمة الغذائية لـ ${food.name}: السعرات والبروتين والكربوهيدرات والدهون لكل 100 غرام.`;

  const button = document.getElementById('fav-btn');
  button.addEventListener('click', () => toggleFavorite(food, button));
});

function getFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem('favorites'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function toggleFavorite(food, button) {
  let favorites = getFavorites();
  const index = favorites.findIndex(item => item.id === food.id);
  const icon = button.querySelector('i');
  const text = document.getElementById('fav-text');

  if (index >= 0) {
    favorites.splice(index, 1);
    icon.className = 'fa-regular fa-heart';
    text.textContent = 'إضافة للمفضلة';
    button.setAttribute('aria-pressed', 'false');
  } else {
    favorites.push({ id: food.id, name: food.name, image: food.image, calories: food.nutrition.calories });
    icon.className = 'fa-solid fa-heart text-red';
    text.textContent = 'إزالة من المفضلة';
    button.setAttribute('aria-pressed', 'true');
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}