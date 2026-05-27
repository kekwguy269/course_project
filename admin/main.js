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

// обработка формы входа
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

const validUsername = 'admin';
const validPassword = 'quickdash2024';

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === validUsername && password === validPassword) {
        localStorage.setItem('admin_authenticated', 'true');
        window.location.href = '../admin-panel/admin-panel.html';
    } else {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});