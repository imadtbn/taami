document.addEventListener('dataLoaded', (e) => {
  const data = e.detail;
  const params = new URLSearchParams(location.search);
  const categoryId = params.get('id');
  const title = document.getElementById('category-title');
  const desc = document.getElementById('category-description');
  const count = document.getElementById('category-count');
  const grid = document.getElementById('category-foods-grid');
  const sortSelect = document.getElementById('sort-select');

  const showError = (message) => {
    title.textContent = 'الفئة غير موجودة';
    desc.textContent = '';
    count.textContent = '0 عنصر';
    grid.innerHTML = `<div class="error-state"><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i><h2>تعذر عرض الفئة</h2><p>${message}</p><a class="btn" href="index.html">العودة للرئيسية</a></div>`;
  };

  if (!categoryId) return showError('لم يتم تحديد فئة صالحة.');
  const category = data.categories.find(c => c.id === categoryId);
  if (!category) return showError('الفئة المطلوبة غير متوفرة في الدليل.');

  title.textContent = category.name;
  desc.textContent = category.description;
  document.title = `${category.name} | دليلك الغذائي الشامل`;

  const foods = data.foods.filter(f => f.categoryId === categoryId);
  count.textContent = `${foods.length} أنواع`;

  const card = food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}" loading="lazy" decoding="async" width="600" height="400">
      <div class="food-info">
        <h3>${food.name}</h3>
        <p class="food-cal">${food.nutrition.calories} سعرة حرارية / 100غ</p>
        <div class="food-macros" aria-label="المغذيات الكبرى">
          <span>بروتين ${food.nutrition.protein}غ</span>
          <span>كربوهيدرات ${food.nutrition.carbs}غ</span>
        </div>
        <a href="product.html?id=${encodeURIComponent(food.id)}" class="btn btn-block" aria-label="عرض تفاصيل ${food.name}">عرض التفاصيل</a>
      </div>
    </article>`;

  const render = list => {
    grid.innerHTML = list.length ? list.map(card).join('') :
      '<div class="empty-state"><i class="fa-solid fa-bowl-food" aria-hidden="true"></i><h2>لا توجد أطعمة بعد</h2><p>ستظهر عناصر هذه الفئة هنا عند إضافتها إلى قاعدة البيانات.</p></div>';
  };

  sortSelect.addEventListener('change', () => {
    const sorted = [...foods];
    switch (sortSelect.value) {
      case 'name-desc': sorted.sort((a,b) => b.name.localeCompare(a.name, 'ar')); break;
      case 'cal-asc': sorted.sort((a,b) => a.nutrition.calories - b.nutrition.calories); break;
      case 'cal-desc': sorted.sort((a,b) => b.nutrition.calories - a.nutrition.calories); break;
      default: sorted.sort((a,b) => a.name.localeCompare(b.name, 'ar'));
    }
    render(sorted);
  });

  render(foods);
});