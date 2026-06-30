
const sections = [
    { id: 'navbar', file: './pages/navbar.html' },
    { id: 'mobile-drawer', file: './pages/drawer.html' },
    { id: 'hero', file: './pages/hero.html' },
    { id: 'servicios', file: './pages/services.html' },
    { id: 'status', file: './pages/status.html' },
    { id: 'porque-elegirnos', file: './pages/porque-elegirnos.html' },
    { id: 'proyectos', file: './pages/projects.html' },
    { id: 'soluciones', file: './pages/why-us.html' },
    { id: 'clientes', file: './pages/clients.html' },
    { id: 'contacto', file: './pages/contact.html' },
    { id: 'footer', file: './pages/footer.html' },
    { id: 'floating', file: './pages/floating.html' }
];

/* ============================================
   CARGA DE COMPONENTES
============================================ */
async function loadComponents() {
    for (const section of sections) {
        try {
            const res = await fetch(section.file + "?t=" + Date.now());
            const html = await res.text();

            const container = document.getElementById(section.id);

            if (container) {
                container.innerHTML = html;
            }

        } catch (err) {
            console.error("Error cargando:", section.file, err);
        }
    }

    initApp();
}

document.addEventListener("DOMContentLoaded", loadComponents);


/* ============================================
   APP PRINCIPAL
============================================ */
function initApp() {

    initCarousel();
    initScrollHeader();
    initScrollReveal();
    initDrawer();
    initForm();


    /* ============================================
       CARRUSEL HERO
    ============================================ */
    function initCarousel() {
        let currentSlide = 0;
        const track = document.getElementById('hero-carousel');
        const dots = document.querySelectorAll('.carousel-dot');

        if (!track) return;

        window.moveCarousel = function (index) {
            currentSlide = index % 4;

            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach((dot, i) => {
                const active = i === currentSlide;

                dot.classList.toggle('active-dot', active);
                dot.classList.toggle('bg-white', active);
                dot.classList.toggle('bg-white/30', !active);
                dot.style.width = active ? '48px' : '12px';
            });
        };

        setInterval(() => {
            window.moveCarousel(currentSlide + 1);
        }, 6000);
    }


    /* ============================================
       HEADER ON SCROLL
    ============================================ */
    function initScrollHeader() {
        const header = document.getElementById('header');
        const backToTop = document.getElementById('back-to-top');

        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                if (backToTop) backToTop.classList.add('opacity-100');
            } else {
                header.classList.remove('scrolled');
                if (backToTop) backToTop.classList.remove('opacity-100');
            }
        });
    }


    /* ============================================
       SCROLL REVEAL + COUNTERS
    ============================================ */
    function initScrollReveal() {

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add('visible');

                    if (entry.target.hasAttribute('data-count')) {
                        const target = parseInt(entry.target.getAttribute('data-count'));
                        let current = 0;
                        const increment = target / 100;

                        const timer = setInterval(() => {
                            current += increment;

                            if (current >= target) {
                                entry.target.innerText = `+${target}`;
                                clearInterval(timer);
                            } else {
                                entry.target.innerText = `+${Math.floor(current)}`;
                            }

                        }, 20);
                    }
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-reveal, [data-count]')
            .forEach(el => observer.observe(el));
    }


    /* ============================================
       DRAWER MOBILE
    ============================================ */
    function initDrawer() {

        const menuToggle = document.getElementById('menu-toggle');
        const closeDrawer = document.getElementById('close-drawer');
        const drawer = document.getElementById('drawer');

        if (!menuToggle || !closeDrawer || !drawer) return;

        menuToggle.addEventListener('click', () => {
            drawer.classList.remove('translate-x-full');
        });

        closeDrawer.addEventListener('click', () => {
            drawer.classList.add('translate-x-full');
        });

        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.add('translate-x-full');
            });
        });
    }


    /* ============================================
       FORMULARIO CONTACTO
    ============================================ */
    function initForm() {

        const form = document.getElementById("contact-form");

        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const button = document.getElementById("submit-btn");

            if (button) {
                button.disabled = true;
                button.innerHTML = "Enviando...";
            }

            try {

                const response = await fetch(form.action, {
                    method: "POST",
                    body: new FormData(form)
                });

                const text = await response.text();

                if (response.ok && text.trim() === "OK") {

                    Swal.fire({
                        icon: "success",
                        title: "¡Mensaje enviado!",
                        text: "Su solicitud fue enviada correctamente.",
                        confirmButtonColor: "#2563eb"
                    });

                    form.reset();

                } else {

                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: text,
                        confirmButtonColor: "#dc2626"
                    });

                }

            } catch (error) {

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No fue posible conectar con el servidor.",
                    confirmButtonColor: "#dc2626"
                });

            }

            if (button) {
                button.disabled = false;
                button.innerHTML = "Enviar Solicitud";
            }
        });
    }
}