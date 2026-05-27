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

// проверка сообщения о успешной регистрации
if (localStorage.getItem('registration_success') === 'true') {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    localStorage.removeItem('registration_success');
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// обработка формы входа
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // получаем пользователей из localStorage
    const users = JSON.parse(localStorage.getItem('quickdash_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // успешный вход
        localStorage.setItem('current_user', JSON.stringify({
            name: user.name,
            email: user.email
        }));
        alert(`✅ Добро пожаловать, ${user.name}!`);
        window.location.href = '../profile/profile.html';
    } else {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});