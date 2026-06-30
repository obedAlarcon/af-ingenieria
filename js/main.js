/* ============================================
   CARGADOR INTELIGENTE DE COMPONENTES
   ============================================ */
const sections = [
    { id: 'navbar',           file: './pages/navbar.html' },
    { id: 'mobile-drawer',    file: './pages/drawer.html' },
    { id: 'hero',             file: './pages/hero.html' },
    { id: 'servicios',        file: './pages/services.html' },
    { id: 'status',           file: './pages/status.html' },
    { id: 'porque-elegirnos', file: './pages/porque-elegirnos.html' },
    { id: 'proyectos',        file: './pages/projects.html' },
    { id: 'soluciones',       file: './pages/why-us.html' },
    { id: 'clientes',         file: './pages/clients.html' },
    { id: 'contacto',         file: './pages/contact.html' },
    { id: 'footer',           file: './pages/footer.html' },
    { id: 'floating',         file: './pages/floating.html' }
];

async function loadComponents() {

    for (const section of sections) {

      const res = await fetch(section.file + "?t=" + Date.now());
const html = await res.text();

console.log("Cargando:", section.file);
console.log(html.substring(0, 300));

        const container = document.getElementById(section.id);

if (container) {
    console.log("ANTES:", section.id, html.includes("../af-ingenieria"), html.includes("../assets"));

    container.innerHTML = html;

    console.log(
        "DESPUÉS:",
        section.id,
        container.innerHTML.includes("../af-ingenieria"),
        container.innerHTML.includes("../assets")
    );
}
    }

    // Todos los componentes ya están cargados
    initApp();
}

document.addEventListener("DOMContentLoaded", loadComponents);


// Arrancar la carga



/* ============================================
   LÓGICA DE LA PÁGINA
   ============================================ */
function initApp() {
    
    // 1. CAROUSEL DEL HERO
    let currentSlide = 0;
    const track = document.getElementById('hero-carousel');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (track) {
        window.moveCarousel = function(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${index * 25}%)`;
            dots.forEach((dot, i) => {
                const active = i === index;
                dot.classList.toggle('active-dot', active);
                dot.classList.toggle('bg-white', active);
                dot.classList.toggle('bg-white/30', !active);
                dot.style.width = active ? '48px' : '12px';
            });
        };
        setInterval(() => window.moveCarousel((currentSlide + 1) % 4), 6000);
    }

    // 2. EFECTO DEL HEADER AL BAJAR
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');
    
    if (header) {
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

    // 3. SCROLL REVEAL (Hace visible las secciones al bajar)
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

    document.querySelectorAll('.scroll-reveal, [data-count]').forEach(el => {
        observer.observe(el);
    });

    // 4. MENÚ MÓVIL (DRAWER)
     const menuToggle = document.getElementById('menu-toggle');
        const closeDrawer = document.getElementById('close-drawer');
        const drawer = document.getElementById('drawer');
console.log("drawer:", drawer);

if (!menuToggle || !closeDrawer || !drawer) {
    console.warn("Drawer no listo todavía");
    return;
}
    if (menuToggle) menuToggle.addEventListener('click', () => drawer.classList.remove('translate-x-full'));
    if (closeDrawer) closeDrawer.addEventListener('click', () => drawer.classList.add('translate-x-full'));
    if (drawer) {
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => drawer.classList.add('translate-x-full'));
        });
    }

    /* ============================================
   FORMULARIO DE CONTACTO
============================================ */

const form = document.getElementById("contact-form");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const button = document.getElementById("submit-btn");

        button.disabled = true;
        button.innerHTML = "Enviando...";

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

        button.disabled = false;
        button.innerHTML = "Enviar Solicitud";

    });

}
}