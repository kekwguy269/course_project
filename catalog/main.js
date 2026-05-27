// переключение темы
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// переключение логотипа при смене темы
const logoImages = document.querySelectorAll('.logo-img');
const lightLogo = './img/quickdash-logo-light.png';
const darkLogo = './img/quickdash-logo-dark.png';

function updateLogo() {
    const isDarkTheme = body.classList.contains('dark-theme');
    const logoSrc = isDarkTheme ? darkLogo : lightLogo;
    logoImages.forEach(img => {
        img.src = logoSrc;
    });
}

// проверка сохранённой темы
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

updateLogo();

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

        updateLogo();
    });
}

// поисковая строка с фильтрацией
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

// функция поиска товаров
function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    let hasVisibleProducts = false;

    productCards.forEach(card => {
        const productTitle = card.querySelector('.product-title').textContent.toLowerCase();
        const searchLower = searchTerm.toLowerCase().trim();

        if (searchTerm === '' || productTitle.includes(searchLower)) {
            card.style.display = 'flex';
            hasVisibleProducts = true;
        } else {
            card.style.display = 'none';
        }
    });

    // показываем сообщение, если товары не найдены
    let noResultsMessage = document.querySelector('.no-results-message');
    if (!hasVisibleProducts && searchTerm.trim() !== '') {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <i class="fas fa-search"></i>
                <p>Ничего не найдено по запросу "${searchTerm}"</p>
                <button class="clear-search-btn">Очистить поиск</button>
            `;
            const productsGrid = document.querySelector('.products-grid');
            productsGrid.parentNode.insertBefore(noResultsMessage, productsGrid.nextSibling);

            const clearBtn = noResultsMessage.querySelector('.clear-search-btn');
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                filterProducts('');
            });
        } else {
            noResultsMessage.style.display = 'block';
            const messageText = noResultsMessage.querySelector('p');
            messageText.innerHTML = `Ничего не найдено по запросу "${searchTerm}"`;
        }
    } else if (noResultsMessage) {
        noResultsMessage.style.display = 'none';
    }
}

function handleSearch() {
    const query = searchInput?.value.trim();
    filterProducts(query);
}

// поиск при вводе текста (реальное время)
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });
}

// поиск по кнопке
if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
}

// поиск по Enter
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// добавляем кнопку очистки поиска
function addClearButton() {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !document.querySelector('.search-clear')) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'search-clear';
        clearBtn.innerHTML = '<i class="fas fa-times"></i>';
        clearBtn.style.position = 'absolute';
        clearBtn.style.right = '50px';
        clearBtn.style.top = '50%';
        clearBtn.style.transform = 'translateY(-50%)';
        clearBtn.style.background = 'transparent';
        clearBtn.style.border = 'none';
        clearBtn.style.color = '#888';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.fontSize = '1rem';
        clearBtn.style.display = 'none';
        clearBtn.style.width = '30px';
        clearBtn.style.height = '30px';
        clearBtn.style.borderRadius = '50%';

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterProducts('');
            clearBtn.style.display = 'none';
            searchInput.focus();
        });

        searchContainer.appendChild(clearBtn);

        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 0) {
                clearBtn.style.display = 'flex';
                clearBtn.style.alignItems = 'center';
                clearBtn.style.justifyContent = 'center';
            } else {
                clearBtn.style.display = 'none';
            }
        });
    }
}

// стили для сообщения "не найдено"
const style = document.createElement('style');
style.textContent = `
    .no-results-message {
        text-align: center;
        padding: 40px 20px;
        background: white;
        border-radius: 28px;
        margin: 20px 0;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    
    .no-results-message i {
        font-size: 3rem;
        color: var(--red-hot);
        margin-bottom: 16px;
    }
    
    .no-results-message p {
        font-size: 1rem;
        color: #666;
        margin-bottom: 20px;
    }
    
    .clear-search-btn {
        background: var(--red-hot);
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition-smooth);
    }
    
    .clear-search-btn:hover {
        background: #c72a3a;
        transform: translateY(-2px);
    }
    
    body.dark-theme .no-results-message {
        background: #1e1e1e;
    }
    
    body.dark-theme .no-results-message p {
        color: #bbbbbb;
    }
    
    .search-clear:hover {
        background: rgba(0,0,0,0.1);
        color: var(--red-hot);
    }
    
    body.dark-theme .search-clear {
        color: #aaa;
    }
    
    body.dark-theme .search-clear:hover {
        background: rgba(255,255,255,0.1);
        color: var(--orange-flame);
    }
`;
document.head.appendChild(style);

addClearButton();

// функция для обновления обработчиков кнопок заказа
function attachOrderButtons() {
    const productButtons = document.querySelectorAll('.product-button');
    productButtons.forEach(button => {
        button.removeEventListener('click', handleOrderClick);
        button.addEventListener('click', handleOrderClick);
    });
}

function handleOrderClick(e) {
    const button = e.currentTarget;
    const productName = button.getAttribute('data-product');
    const productPrice = button.getAttribute('data-price');
    window.location.href = `../payment/payment.html?product=${encodeURIComponent(productName)}&price=${productPrice}`;
}

// функция для отображения цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// загрузка товаров из админ-панели (без дублирования)
function loadProductsFromAdmin() {
    const savedProducts = localStorage.getItem('admin_products');
    const savedImages = JSON.parse(localStorage.getItem('product_images') || '{}');
    const productsGrid = document.querySelector('.products-grid');

    // удаляем только товары, добавленные через админ-панель (имеют data-id)
    const adminProducts = document.querySelectorAll('.product-card[data-id]');
    adminProducts.forEach(el => el.remove());

    if (savedProducts) {
        const products = JSON.parse(savedProducts);

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-id', product.id);

            const productImage = savedImages[product.id];

            let iconClass = 'fas fa-hamburger';
            if (product.category === 'Закуски') iconClass = 'fas fa-drumstick-bite';
            else if (product.category === 'Напитки') iconClass = 'fas fa-cocktail';
            else if (product.category === 'Десерты') iconClass = 'fas fa-ice-cream';
            else if (product.category === 'Бургеры') iconClass = 'fas fa-hamburger';

            const imageHtml = productImage
                ? `<img src="${productImage}" alt="${escapeHtml(product.name)}" style="width:100%; height:100%; object-fit:cover;">`
                : `<div class="product-image-placeholder"><i class="${iconClass}"></i></div>`;

            productCard.innerHTML = `
                <div class="product-image">
                    ${imageHtml}
                </div>
                <div class="product-info">
                    <div class="product-title">${escapeHtml(product.name)}</div>
                    <div class="product-price">${formatPrice(product.price)} <small>₽</small></div>
                </div>
                <button class="product-button" data-product="${escapeHtml(product.name)}" data-price="${product.price}">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            `;

            productsGrid.appendChild(productCard);
        });

        attachOrderButtons();
    }
}

// функция для экранирования HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// загружаем товары при загрузке страницы
loadProductsFromAdmin();

// слушаем изменения в localStorage (для обновления при добавлении товаров из админ-панели)
window.addEventListener('storage', function (e) {
    if (e.key === 'admin_products' || e.key === 'product_images') {
        loadProductsFromAdmin();
    }
});