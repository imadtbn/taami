document.addEventListener('dataLoaded', (e) => {
  const data = e.detail;
  const params = new URLSearchParams(location.search);
  const query = (params.get('q') || '').trim();
  const queryText = document.getElementById('search-query-text');
  const grid = document.getElementById('search-results-grid');

  queryText.textContent = query || 'لا توجد كلمة بحث';

  if (!query) {
    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><h2>ابدأ بكتابة ما تبحث عنه</h2><p>يمكنك البحث باسم الطعام أو الفئة أو وصف مختصر.</p></div>';
    return;
  }

  const normalized = query.toLocaleLowerCase('ar');
  const results = data.foods.filter(food => {
    const category = data.categories.find(c => c.id === food.categoryId);
    const haystack = [food.name, food.description, category?.name || ''].join(' ').toLocaleLowerCase('ar');
    return haystack.includes(normalized) ||
      (normalized.includes('بروتين') && food.nutrition.protein >= 20) ||
      ((normalized.includes('قليل') || normalized.includes('منخفض')) && normalized.includes('سعر') && food.nutrition.calories < 100);
  });

  if (!results.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fa-regular fa-face-frown" aria-hidden="true"></i><h2>لا توجد نتائج مطابقة</h2><p>جرّب اسمًا أقصر أو ابحث باسم فئة مثل الفواكه أو البقوليات.</p><a class="btn" href="index.html">تصفح الفئات</a></div>`;
    return;
  }

  grid.innerHTML = results.map(food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}" loading="lazy" decoding="async" width="600" height="400">
      <div class="food-info">
        <h3>${food.name}</h3>
        <p class="food-cal">${food.nutrition.calories} سعرة حرارية / 100غ</p>
        <div class="food-macros"><span>بروتين ${food.nutrition.protein}غ</span><span>دهون ${food.nutrition.totalFat}غ</span></div>
        <a href="product.html?id=${encodeURIComponent(food.id)}" class="btn btn-block">عرض التفاصيل</a>
      </div>
    </article>`).join('');
});