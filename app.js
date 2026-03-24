
lucide.createIcons();


const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.classList.add('shadow-sm');
    } else {
        navbar.classList.remove('shadow-sm');
    }
});


const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));
});
