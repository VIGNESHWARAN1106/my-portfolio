document.addEventListener("DOMContentLoaded", () => {

    /* ---------------- Mobile menu toggle ---------------- */
    const menuToggle = document.getElementById("menuToggle");
    const sidebarNav = document.getElementById("sidebarNav");

    menuToggle.addEventListener("click", () => {
        const isOpen = sidebarNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            sidebarNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Close mobile nav when clicking outside or pressing Escape
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#sidebar") && sidebarNav.classList.contains("open")) {
            sidebarNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && sidebarNav.classList.contains("open")) {
            sidebarNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    /* ---------------- Scroll progress + scroll-up button ---------------- */
    const scrollProgress = document.getElementById("scrollProgress");
    const scrollUpBtn = document.getElementById("scrollUp");

    const onScroll = () => {
        const doc = document.documentElement;
        const scrolled = doc.scrollTop;
        const max = doc.scrollHeight - doc.clientHeight;
        scrollProgress.style.width = `${(scrolled / max) * 100}%`;
        scrollUpBtn.classList.toggle("show", scrolled > 500);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    scrollUpBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------------- Scroll-spy active nav link ---------------- */
    const sections = document.querySelectorAll(".section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.dataset.nav === entry.target.id);
                });
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(section => spyObserver.observe(section));

    /* ---------------- Reveal-on-scroll ---------------- */
    document.querySelectorAll(
        ".project-card, .timeline-item, .contact-row, .skill-group, .skills-track-record"
    ).forEach(el => el.classList.add("reveal"));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    /* ---------------- Typing animation (no dependency) ---------------- */
    function typeLoop(el, words, { typeSpeed = 90, backSpeed = 45, pause = 1400 } = {}) {
        if (!el) return;
        let wordIndex = 0, charIndex = 0, deleting = false;

        function tick() {
            const word = words[wordIndex];
            if (!deleting) {
                charIndex++;
                el.textContent = word.slice(0, charIndex);
                if (charIndex === word.length) {
                    deleting = true;
                    return setTimeout(tick, pause);
                }
            } else {
                charIndex--;
                el.textContent = word.slice(0, charIndex);
                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            setTimeout(tick, deleting ? backSpeed : typeSpeed);
        }
        tick();
    }

    const roles = ["Mobile Developer", "Full-Stack Developer", "Problem Solver"];
    typeLoop(document.querySelector(".typing"), roles);
    typeLoop(document.querySelector(".typing-2"), roles);

    /* ---------------- Animate skill bars when visible ---------------- */
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                fill.style.width = `${fill.dataset.fill}%`;
                barObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll(".bar-fill").forEach(el => barObserver.observe(el));

    /* ---------------- Carousel (vanilla, no dependency) ---------------- */
    const track = document.getElementById("carouselTrack");
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById("carPrev");
    const nextBtn = document.getElementById("carNext");
    const dotsWrap = document.getElementById("carouselDots");

    let current = 0;
    let autoplayTimer;

    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => goTo(current + 1), 3200);
    }
    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    prevBtn.addEventListener("click", () => { goTo(current - 1); startAutoplay(); });
    nextBtn.addEventListener("click", () => { goTo(current + 1); startAutoplay(); });

    const carouselWrap = document.querySelector(".carousel-wrap");
    carouselWrap.addEventListener("mouseenter", stopAutoplay);
    carouselWrap.addEventListener("mouseleave", startAutoplay);

    /* Touch swipe support for mobile */
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
            if (diff > 0) goTo(current + 1);
            else goTo(current - 1);
        }
        startAutoplay();
    }, { passive: true });

    goTo(0);
    startAutoplay();

    /* ---------------- Footer year ---------------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});