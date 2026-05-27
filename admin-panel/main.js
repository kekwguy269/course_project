// проверка авторизации
if (localStorage.getItem('admin_authenticated') !== 'true') {
    window.location.href = './admin-login.html';
}

// переключение темы
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// кнопка выхода
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('admin_authenticated');
        window.location.href = './admin-login.html';
    });
}

// переменные для хранения изображений
let currentImageData = null;

// обработчик выбора файла
const fileInput = document.getElementById('product-image');
const fileNameDisplay = document.getElementById('file-name-display');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');

fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        fileNameDisplay.textContent = file.name;

        const reader = new FileReader();
        reader.onload = function (event) {
            currentImageData = event.target.result;
            previewImg.src = currentImageData;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        removeImage();
    }
});

function removeImage() {
    fileInput.value = '';
    currentImageData = null;
    fileNameDisplay.textContent = 'Файл не выбран';
    imagePreview.style.display = 'none';
    previewImg.src = '#';
}

function loadAdminProducts() {
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const container = document.getElementById('admin-products-list');
    const productsCountSpan = document.getElementById('products-count');

    if (products.length === 0) {
        container.innerHTML = '<div class="empty-products-message"><i class="fas fa-box-open"></i> Нет добавленных товаров</div>';
        if (productsCountSpan) productsCountSpan.textContent = '8';
        return;
    }

    if (productsCountSpan) productsCountSpan.textContent = 8 + products.length;

    container.innerHTML = products.map(product => `
                <div class="admin-product-item" data-id="${product.id}">
                    <div class="admin-product-info">
                        <div class="admin-product-name">${escapeHtml(product.name)}</div>
                        <div class="admin-product-price">${product.price} ₽ • ${product.category}</div>
                    </div>
                    <button class="delete-product-btn" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

window.deleteProduct = function (productId) {
    let products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    products = products.filter(p => p.id !== productId);
    localStorage.setItem('admin_products', JSON.stringify(products));
    loadAdminProducts();

    const images = JSON.parse(localStorage.getItem('product_images') || '{}');
    delete images[productId];
    localStorage.setItem('product_images', JSON.stringify(images));

    alert('🗑️ Товар удалён из каталога');
};

const addProductForm = document.getElementById('add-product-form');
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productCategory = document.getElementById('product-category').value;

    let products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const newProductId = Date.now();
    const newProduct = {
        id: newProductId,
        name: productName,
        price: parseInt(productPrice),
        category: productCategory,
        hasImage: !!currentImageData
    };
    products.push(newProduct);
    localStorage.setItem('admin_products', JSON.stringify(products));

    if (currentImageData) {
        const images = JSON.parse(localStorage.getItem('product_images') || '{}');
        images[newProductId] = currentImageData;
        localStorage.setItem('product_images', JSON.stringify(images));
    }

    alert(`✅ Товар "${productName}" добавлен!\n\nЦена: ${productPrice} ₽\nКатегория: ${productCategory}\n\nТовар появится в каталоге после обновления страницы.`);

    addProductForm.reset();
    removeImage();
    loadAdminProducts();
});

loadAdminProducts();