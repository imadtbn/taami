document.addEventListener('dataLoaded', (e) => {
    const data = e.detail;

    // Get Query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const queryTextSpan = document.getElementById('search-query-text');
    const grid = document.getElementById('search-results-grid');

    if(!query) {
        queryTextSpan.textContent = "لا توجد كلمة بحث";
        grid.innerHTML = '<p>الرجاء إدخال كلمة للبحث.</p>';
        return;
    }

    queryTextSpan.textContent = query;
    const lowerQuery = query.toLowerCase();

    // Perform Search
    // 1. Search in Foods (name, description, category name)
    const results = data.foods.filter(food => {
        const category = data.categories.find(c => c.id === food.categoryId);
        const catName = category ? category.name.toLowerCase() : '';

        return food.name.toLowerCase().includes(lowerQuery) ||
               food.description.toLowerCase().includes(lowerQuery) ||
               catName.includes(lowerQuery) ||
               (query.includes('بروتين') && food.nutrition.protein > 20) || // Simple smart search mock
               (query.includes('سعرات') && food.nutrition.calories < 100);
    });

    // Render Results
    if(results.length === 0) {
        grid.innerHTML = '<p>لم يتم العثور على نتائج مطابقة لبحثك.</p>';
        return;
    }

    let html = '';
    results.forEach(food => {
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
});
