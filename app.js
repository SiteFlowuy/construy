
lucide.createIcons();


// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuToggle.classList.toggle('is-open');
    });

    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuToggle.classList.remove('is-open');
        });
    });
}


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


// Navbar active link
const navLinks = {
    servicios: document.querySelector('a[href="#servicios"].hidden'),
    nosotros:  document.querySelector('a[href="#nosotros"].hidden'),
    proyectos: document.querySelector('a[href="#proyectos"].hidden'),
};

// Target the desktop nav links (inside the hidden md:flex container)
const desktopNav = document.querySelector('.hidden.md\\:flex');
const navLinkMap = {};
if (desktopNav) {
    desktopNav.querySelectorAll('a[href^="#"]').forEach(a => {
        const id = a.getAttribute('href').slice(1);
        navLinkMap[id] = a;
    });
}

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        Object.values(navLinkMap).forEach(a => a.classList.remove('text-brand-orange'));
        if (navLinkMap[id]) navLinkMap[id].classList.add('text-brand-orange');
    });
}, { threshold: 0.4 });

['servicios', 'nosotros', 'proyectos'].forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
});


// Stats counters
const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);

        const target = parseInt(entry.target.dataset.counter, 10);
        const display = entry.target.querySelector('.counter-display');
        const duration = 2000;
        const start = performance.now();
        const suffix = target === 100 ? '%' : '+';
        const useThousands = target === 8500;

        function format(val) {
            if (useThousands) return val.toLocaleString('es-UY').replace(',', '.');
            return val + suffix;
        }

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // cubic ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            display.textContent = format(current);
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));


// Sticky CTA mobile
const stickyCta = document.getElementById('sticky-cta');

if (stickyCta) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const threshold = window.innerHeight * 0.3;
        const nearBottom = (scrollY + window.innerHeight) >= document.body.scrollHeight * 0.9;

        if (scrollY > threshold && !nearBottom) {
            stickyCta.classList.remove('hidden');
        } else {
            stickyCta.classList.add('hidden');
        }
    }, { passive: true });
}


// FAQ accordion
document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});


// Contact form
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('cf-submit');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                contactForm.classList.add('hidden');
                document.getElementById('contact-success').classList.remove('hidden');
            } else {
                throw new Error('Error en el servidor');
            }
        } catch {
            btn.disabled = false;
            btn.textContent = 'Error al enviar. Intentá de nuevo.';
        }
    });
}
