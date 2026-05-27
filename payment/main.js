// переключение темы
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const logoImg = document.getElementById('logo-img');
const subtitle = document.getElementById('subtitle');

// пути к логотипам
const lightLogo = './img/quickdash-logo-light.png';
const darkLogo = './img/quickdash-logo-dark.png';

function updateLogo() {
    const isDarkTheme = body.classList.contains('dark-theme');
    logoImg.src = isDarkTheme ? darkLogo : lightLogo;
}

function updateSubtitleColor() {
    const isDarkTheme = body.classList.contains('dark-theme');
    subtitle.style.color = isDarkTheme ? '#bbbbbb' : '#666';
}

// проверка сохранённой темы
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

updateLogo();
updateSubtitleColor();

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
        updateSubtitleColor();
    });
}

// получение параметров товара из URL
const urlParams = new URLSearchParams(window.location.search);
const productName = urlParams.get('product');
const productPrice = urlParams.get('price');

document.getElementById('product-name').textContent = productName || 'Неизвестный товар';
document.getElementById('product-price').textContent = `${productPrice || 0} ₽`;
document.getElementById('total-price').textContent = `${productPrice || 0} ₽`;

// обработка отправки формы
document.getElementById('payment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`✅ Заказ оформлен!\n\nТовар: ${productName}\nСумма: ${productPrice} ₽\n\nСкоро с вами свяжется оператор для подтверждения заказа.`);
    window.location.href = '../catalog/catalog.html';
});