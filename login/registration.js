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

// обработка формы регистрации
const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // проверка совпадения паролей
    if (password !== confirmPassword) {
        alert('❌ Пароли не совпадают!');
        return;
    }

    // проверка длины пароля
    if (password.length < 6) {
        alert('❌ Пароль должен содержать минимум 6 символов!');
        return;
    }

    // получаем существующих пользователей
    const users = JSON.parse(localStorage.getItem('quickdash_users') || '[]');

    // проверка, существует ли пользователь с таким email
    if (users.find(u => u.email === email)) {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
        return;
    }

    // добавляем нового пользователя
    const newUser = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('quickdash_users', JSON.stringify(users));

    // устанавливаем флаг успешной регистрации для страницы логина
    localStorage.setItem('registration_success', 'true');

    alert(`✅ Добро пожаловать, ${name}! Регистрация прошла успешно. Теперь вы можете войти.`);
    window.location.href = './login.html';
});