document.addEventListener('dataLoaded', (e) => {
    const data = e.detail;

    // Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('product-container');

    if(!productId) {
        container.innerHTML = '<h1>المنتج غير موجود</h1>';
        return;
    }

    const food = data.foods.find(f => f.id === productId);
    if(!food) {
        container.innerHTML = '<h1>المنتج غير موجود</h1>';
        return;
    }

    const category = data.categories.find(c => c.id === food.categoryId);

    // Check if in favorites
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFav = favorites.some(f => f.id === food.id);
    const favIconClass = isFav ? 'fa-solid text-red' : 'fa-regular';
    const favText = isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة';

    // Vitamins HTML
    let vitaminsHTML = '';
    if(food.nutrition.vitamins && food.nutrition.vitamins.length > 0) {
        vitaminsHTML = `
            <h4>الفيتامينات والمعادن الرئيسية:</h4>
            <ul class="vitamins-list">
                ${food.nutrition.vitamins.map(v => `<li>${v.name} <span>(${v.dv} من القيمة اليومية)</span></li>`).join('')}
            </ul>
        `;
    }

    const html = `
        <div class="breadcrumb">
            <a href="index.html">الرئيسية</a> &gt;
            <a href="category.html?id=${category.id}">${category.name}</a> &gt;
            <span>${food.name}</span>
        </div>

        <div class="product-details">
            <div class="product-image">
                <img src="${food.image}" alt="${food.name}">
            </div>
            <div class="product-info">
                <h1>${food.name}</h1>
                <p class="product-desc">${food.description}</p>

                <div class="product-actions">
                    <button class="btn btn-outline" id="fav-btn" data-id="${food.id}">
                        <i class="${favIconClass} fa-heart"></i> <span id="fav-text">${favText}</span>
                    </button>
                </div>

                <div class="nutrition-table-container">
                    <h3>القيمة الغذائية لكل 100 جرام</h3>
                    <table class="nutrition-table">
                        <tbody>
                            <tr><th>السعرات الحرارية</th><td>${food.nutrition.calories} ككال</td></tr>
                            <tr><th>البروتين</th><td>${food.nutrition.protein} جم</td></tr>
                            <tr><th>الكربوهيدرات</th><td>${food.nutrition.carbs} جم</td></tr>
                            <tr><th>الدهون الكلية</th><td>${food.nutrition.totalFat} جم</td></tr>
                            <tr class="sub-row"><th>الدهون المشبعة</th><td>${food.nutrition.saturatedFat} جم</td></tr>
                            <tr class="sub-row"><th>الدهون غير المشبعة</th><td>${food.nutrition.unsaturatedFat} جم</td></tr>
                            <tr><th>الألياف</th><td>${food.nutrition.fiber} جم</td></tr>
                            <tr><th>السكر</th><td>${food.nutrition.sugar} جم</td></tr>
                        </tbody>
                    </table>
                    ${vitaminsHTML}
                    <p class="source-note">* المصدر: قاعدة بيانات وزارة الزراعة الأمريكية (USDA).</p>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    document.title = `${food.name} - دليلك الغذائي الشامل`;

    // Handle Favorites Button
    const favBtn = document.getElementById('fav-btn');
    favBtn.addEventListener('click', () => {
        let favs = JSON.parse(localStorage.getItem('favorites')) || [];
        const index = favs.findIndex(f => f.id === food.id);

        const icon = favBtn.querySelector('i');
        const textSpan = document.getElementById('fav-text');

        if(index > -1) {
            // Remove
            favs.splice(index, 1);
            icon.classList.remove('fa-solid', 'text-red');
            icon.classList.add('fa-regular');
            textSpan.textContent = 'إضافة للمفضلة';
        } else {
            // Add (store basic info to render in favs page later)
            favs.push({
                id: food.id,
                name: food.name,
                image: food.image,
                calories: food.nutrition.calories
            });
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid', 'text-red');
            textSpan.textContent = 'إزالة من المفضلة';
        }

        localStorage.setItem('favorites', JSON.stringify(favs));
    });
});

// Appending Related Products Logic
document.addEventListener('dataLoaded', (e) => {
    const data = e.detail;
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const food = data.foods.find(f => f.id === productId);

    if (food) {
        const relatedFoods = data.foods.filter(f => f.categoryId === food.categoryId && f.id !== food.id).slice(0, 3);

        if (relatedFoods.length > 0) {
            let relatedHTML = '<div class="related-products"><h2>منتجات ذات صلة</h2><div class="foods-grid">';
            relatedFoods.forEach(rf => {
                relatedHTML += `
                    <div class="food-card">
                        <img src="${rf.image}" alt="${rf.name}">
                        <div class="food-info">
                            <h3>${rf.name}</h3>
                            <p class="food-cal">${rf.nutrition.calories} سعرة حرارية</p>
                            <a href="product.html?id=${rf.id}" class="btn btn-block">عرض التفاصيل</a>
                        </div>
                    </div>
                `;
            });
            relatedHTML += '</div></div>';

            // Append to container
            const container = document.getElementById('product-container');
            container.innerHTML += relatedHTML;
        }
    }
});
