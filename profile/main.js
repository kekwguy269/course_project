// переключение темы
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const logoImg = document.getElementById('logo-img');

const lightLogo = '../main/img/quickdash-logo-light.png';
const darkLogo = '../main/img/quickdash-logo-dark.png';

function updateLogo() {
    const isDarkTheme = body.classList.contains('dark-theme');
    logoImg.src = isDarkTheme ? darkLogo : lightLogo;
}

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

// получение данных пользователя
function getUserData() {
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
        return JSON.parse(currentUser);
    }
    const users = JSON.parse(localStorage.getItem('quickdash_users') || '[]');
    if (users.length > 0) {
        return users[users.length - 1];
    }
    return null;
}

// получение случайных товаров из каталога с изображениями
function getRandomProducts() {
    const defaultProducts = [
        { name: 'Классический бургер', price: 299, icon: 'fas fa-hamburger', image: '../catalog/img/burger.png' },
        { name: 'Двойной чизбургер', price: 399, icon: 'fas fa-cheese', image: '../catalog/img/double_cheeseburger.png' },
        { name: 'Острые крылышки', price: 249, icon: 'fas fa-drumstick-bite', image: '../catalog/img/nuggets.png' },
        { name: 'Картошка фри', price: 129, icon: 'fas fa-french-fries', image: '../catalog/img/potato.png' },
        { name: 'Чикен бургер', price: 279, icon: 'fas fa-pepper-hot', image: '../catalog/img/chicken_burger.png' },
        { name: 'Кола 0.5л', price: 99, icon: 'fas fa-cocktail', image: '../catalog/img/cola.png' },
        { name: 'Мороженое пломбир', price: 89, icon: 'fas fa-ice-cream', image: '../catalog/img/icecream.png' },
        { name: 'Пицца Маргарита', price: 499, icon: 'fas fa-pizza-slice', image: '../catalog/img/pizza.png' }
    ];
    
    const adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const allProducts = [...defaultProducts, ...adminProducts];
    
    const shuffled = [...allProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, 3);
}

// форматирование даты регистрации
function formatDate(dateString) {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// получение инициалов
function getInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
}

// статусы заказов
const orderStatuses = [
    { status: 'Заказ выполнен', class: 'status-completed', icon: 'fas fa-check-circle' },
    { status: 'В процессе', class: 'status-processing', icon: 'fas fa-spinner' },
    { status: 'Отклонён', class: 'status-rejected', icon: 'fas fa-times-circle' }
];

// рендер профиля
function renderProfile() {
    const container = document.getElementById('profile-container');
    const user = getUserData();

    if (!user) {
        container.innerHTML = `
            <div class="profile-card unauthorized">
                <i class="fas fa-user-circle"></i>
                <h2>Вы не авторизованы</h2>
                <p>Войдите в аккаунт, чтобы просмотреть профиль</p>
                <a href="../login/login.html" class="btn btn-primary">
                    <i class="fas fa-sign-in-alt"></i> Войти
                </a>
                <a href="../login/registration.html" class="btn btn-outline" style="margin-top: 12px;">
                    <i class="fas fa-user-plus"></i> Зарегистрироваться
                </a>
            </div>
        `;
        return;
    }

    const randomProducts = getRandomProducts();
    
    let ordersHtml = '';
    randomProducts.forEach((product, index) => {
        const status = orderStatuses[index % orderStatuses.length];
        
        const hasImage = product.image && product.image !== '';
        const imageHtml = hasImage 
            ? `<img src="${product.image}" alt="${escapeHtml(product.name)}">`
            : `<i class="${product.icon}"></i>`;
        
        ordersHtml += `
            <div class="order-item">
                <div class="order-image">
                    ${imageHtml}
                </div>
                <div class="order-info">
                    <div class="order-name">${escapeHtml(product.name)}</div>
                    <div class="order-price">${product.price} ₽</div>
                </div>
                <div class="order-status ${status.class}">
                    <i class="${status.icon}" style="margin-right: 4px;"></i> ${status.status}
                </div>
            </div>
        `;
    });

    const initials = getInitials(user.name);
    const registeredAt = user.registeredAt || new Date().toISOString();

    container.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <div class="avatar">
                    ${initials}
                </div>
                <h1 class="profile-name">${escapeHtml(user.name)}</h1>
                <p class="profile-email">${escapeHtml(user.email)}</p>
            </div>
            
            <div class="profile-info">
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Email</div>
                        <div class="info-value">${escapeHtml(user.email)}</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Телефон</div>
                        <div class="info-value">${user.phone ? escapeHtml(user.phone) : 'Не указан'}</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Дата регистрации</div>
                        <div class="info-value">${formatDate(registeredAt)}</div>
                    </div>
                </div>
            </div>
            
            <div class="profile-actions">
                <div class="dropdown">
                    <button id="dropdown-btn" class="dropdown-btn">
                        <span><i class="fas fa-shopping-bag"></i> Мои заказы (${randomProducts.length})</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div id="dropdown-menu" class="dropdown-menu">
                        ${ordersHtml}
                    </div>
                </div>
                <button id="logout-btn" class="btn btn-danger">
                    <i class="fas fa-sign-out-alt"></i> Выйти из аккаунта
                </button>
            </div>
        </div>
    `;

    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            dropdownBtn.classList.toggle('open');
        });
        
        document.addEventListener('click', (e) => {
            if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                dropdownBtn.classList.remove('open');
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('current_user');
            alert('✅ Вы вышли из аккаунта');
            window.location.href = '../main/index.html';
        });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

renderProfile();