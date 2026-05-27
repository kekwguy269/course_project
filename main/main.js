// инициализация Swiper (предотвращаем скролл страницы)
let currentScrollPosition = window.scrollY;

function saveScrollPosition() {
    currentScrollPosition = window.scrollY;
}

function restoreScrollPosition() {
    if (Math.abs(window.scrollY - currentScrollPosition) > 10) {
        window.scrollTo({
            top: currentScrollPosition,
            behavior: 'instant'
        });
    }
}

setInterval(saveScrollPosition, 100);

const teamSwiper = new Swiper('.team-swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 16,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    touchStartPreventDefault: false,
    simulateTouch: true,
    allowTouchMove: true,
    breakpoints: {
        0: {
            centeredSlides: true,
            spaceBetween: 12,
        },
        380: {
            centeredSlides: true,
            spaceBetween: 16,
        },
        480: {
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 20,
        },
        768: {
            centeredSlides: false,
            slidesPerView: 2.2,
            spaceBetween: 24,
        },
        1024: {
            centeredSlides: false,
            slidesPerView: 3,
            spaceBetween: 24,
        }
    },
    on: {
        slideChangeTransitionStart: saveScrollPosition,
        slideChangeTransitionEnd: restoreScrollPosition,
        autoplayStart: saveScrollPosition,
        autoplayStop: saveScrollPosition,
        navigationNext: function() {
            saveScrollPosition();
            setTimeout(restoreScrollPosition, 50);
        },
        navigationPrev: function() {
            saveScrollPosition();
            setTimeout(restoreScrollPosition, 50);
        }
    }
});

// обработка кликов по пагинации
document.querySelectorAll('.swiper-pagination-bullet').forEach(bullet => {
    bullet.addEventListener('click', () => {
        const scrollPos = window.scrollY;
        setTimeout(() => {
            window.scrollTo(window.scrollX, scrollPos);
        }, 50);
    });
});

// защита при наведении на swiper
const swiperContainer = document.querySelector('.team-swiper');
if (swiperContainer) {
    swiperContainer.addEventListener('mouseenter', saveScrollPosition);
    swiperContainer.addEventListener('mouseleave', restoreScrollPosition);
    swiperContainer.addEventListener('touchstart', saveScrollPosition);
    swiperContainer.addEventListener('touchend', () => {
        setTimeout(restoreScrollPosition, 100);
    });
}

// переключение темы
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

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

// анимация для кнопки "Наверх"
const scrollToTopBtn = document.getElementById('scrollToTop');

function smoothScrollTo(targetY, duration = 800) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeOutQuad = progress * (2 - progress);
        
        window.scrollTo(0, startY + distance * easeOutQuad);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo(0, 600);
    });
}

// плавная прокрутка для якорных ссылок в навигации
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - 20;
            smoothScrollTo(targetPosition, 700);
        }
    });
});

// поисковая строка
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

function handleSearch() {
    const query = searchInput?.value.trim();
    if (query) {
        alert(`🔍 Поиск: "${query}". Функция поиска скоро будет доступна!`);
    } else {
        alert('🔍 Введите название блюда для поиска');
    }
}

if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// обработка формы обратной связи
document.querySelector('.feedback-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
    this.reset();
});