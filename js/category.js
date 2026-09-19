document.addEventListener('dataLoaded', (e) => {
    const data = e.detail;

    // Get Category ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');

    if(!categoryId) {
        document.getElementById('category-title').textContent = "الفئة غير موجودة";
        return;
    }

    const category = data.categories.find(c => c.id === categoryId);
    if(!category) {
        document.getElementById('category-title').textContent = "الفئة غير موجودة";
        return;
    }

    // Set Header
    document.getElementById('category-title').textContent = category.name;
    document.getElementById('category-description').textContent = category.description;

    // Get Foods for this category
    let foods = data.foods.filter(f => f.categoryId === categoryId);

    // Set Count
    document.getElementById('category-count').textContent = `${foods.length} أنواع`;

    // Render Foods
    const grid = document.getElementById('category-foods-grid');
    const sortSelect = document.getElementById('sort-select');

    function renderFoods(foodsToRender) {
        grid.innerHTML = '';
        if(foodsToRender.length === 0) {
            grid.innerHTML = '<p>لا توجد أطعمة في هذه الفئة حالياً.</p>';
            return;
        }

        let html = '';
        foodsToRender.forEach(food => {
            html += `
                <div class="food-card">
                    <img src="${food.image}" alt="${food.name}">
                    <div class="food-info">
                        <h3>${food.name}</h3>
                        <p class="food-cal">${food.nutrition.calories} سعرة حرارية</p>
                        <a href="product.html?id=${food.id}" class="btn btn-block">عرض التفاصيل</a>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    }

    // Sort Logic
    sortSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        let sorted = [...foods];
        if(val === 'name-asc') sorted.sort((a,b) => a.name.localeCompare(b.name, 'ar'));
        if(val === 'name-desc') sorted.sort((a,b) => b.name.localeCompare(a.name, 'ar'));
        if(val === 'cal-asc') sorted.sort((a,b) => a.nutrition.calories - b.nutrition.calories);
        if(val === 'cal-desc') sorted.sort((a,b) => b.nutrition.calories - a.nutrition.calories);
        renderFoods(sorted);
    });

    // Initial Render
    renderFoods(foods);
});
