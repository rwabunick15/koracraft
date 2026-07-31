console.log("SCRIPT LOADED");
// 1. Precise Track Point System Matrix
const hasMouse = window.matchMedia("(pointer:fine)").matches;

if(hasMouse){

    const cursor = document.querySelector(".custom-cursor");

    if(cursor){

        document.addEventListener("mousemove",(e)=>{

            gsap.to(cursor,{
                x:e.clientX,
                y:e.clientY,
                duration:0.04,
                ease:"power2.out"
            });

        });

    }

}else{

    const cursor=document.querySelector(".custom-cursor");

    if(cursor){

        cursor.remove();

    }

}

// 2. Hard Scroll Reset & Restoration Overrides (Forces Page to Top on Reload)
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

// 3. Multilingual Initial Cinematic Flow Sequence
const greetings = ["Hello", "Muraho", "Habari", "Bonjour", "你好"];
const introText = document.getElementById('intro-greeting');
const introTl = gsap.timeline();

greetings.forEach((word) => {
    introTl.to(introText, {
        opacity: 0,
        scale: 0.9,
        duration: 0.15,
        onComplete: () => { introText.textContent = word; }
    })
    .to(introText, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" })
    .to({}, { duration: 0.2 });
});

introTl.to(".intro-overlay", { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
.to(".main-content", { opacity: 1, duration: 0.4 }, "-=0.4")

// Draws your geometric tech lines underneath the fresh image logo seamlessly
.from(".logo-line-horizontal", { width: 0, opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.1")
.from(".logo-line-diagonal", { height: 0, opacity: 0, duration: 0.3, ease: "power2.out" })

// Optimized to animate the center image logo container wrapper correctly
.to(".hero-title-container", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
.to(".hero-subtitle", { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "-=0.3")
.to(".learn-more-btn", { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");

// 4. Modular Arsenal Core Configuration Matrix
const arsenalData = {
    'html-css': {
        title: 'HTML5 & CSS3 Interface Structure',
        desc: 'The foundational bedrock of standard-driven presentation layers. We utilize valid HTML5 tags coupled with advanced CSS Grid architectures to deploy hyper-scalable layouts that hold their visual structural integrity flawlessly across screen sizes.'
    },
    'js': {
        title: 'JavaScript Program Logic Engine',
        desc: 'Advanced ES6+ engine architecture. Handles raw calculations, algorithmic object parameters, programmatic client tracking vectors, asynchronous data dispatches, and responsive interface manipulation frames natively within browser engines.'
    },
    'gsap': {
        title: 'GSAP Animation Staging Array',
        desc: 'The GreenSock Animation Platform array. Recognized as the world standard framework for premium, hardware-accelerated user interaction timelines, fluid scroll state syncing, and high-performance cross-browser kinetic displays.'
    },
    'db': {
        title: 'Database & Endpoint Systems',
        desc: 'Custom relational server management structures. We write efficient RESTful API configurations, structure complex query channels, and tie persistent database nodes together safely to process payment logic and user inputs without security vulnerabilities.'
    }
};

function toggleModal(key) {
    const target = document.getElementById('info-modal');
    if (!key) {
        target.classList.remove('active');
        return;
    }
    const record = arsenalData[key];
    if (record) {
        document.getElementById('modal-title').textContent = record.title;
        document.getElementById('modal-desc').textContent = record.desc;
        target.classList.add('active');
    }
}

// ======================================================
// Scroll Animations
// ======================================================

gsap.registerPlugin(ScrollTrigger);

// Tools Cards
gsap.from(".tool-card", {
    scrollTrigger: {
        trigger: ".tools-grid",
        start: "top 80%"
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out"
});

// Pricing Cards
gsap.from(".card-left", {
    scrollTrigger: {
        trigger: ".pricing-container",
        start: "top 80%"
    },
    x: -120,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
});

gsap.from(".card-center", {
    scrollTrigger: {
        trigger: ".pricing-container",
        start: "top 80%"
    },
    y: 80,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
});

gsap.from(".card-right", {
    scrollTrigger: {
        trigger: ".pricing-container",
        start: "top 80%"
    },
    x: 120,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
});

// Journey
gsap.from(".journey-step-row", {
    scrollTrigger: {
        trigger: ".journey-wrapper",
        start: "top 80%"
    },
    y: 70,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: "power3.out"
});

// Background Lines
gsap.to(".line-1", {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    },
    y: -150
});

gsap.to(".line-2", {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    },
    y: 150
});

// ======================================================
// Active Navigation Highlight
// ======================================================

window.addEventListener("scroll", () => {

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 120;

        if (window.scrollY >= top) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }

    });

});

// ======================================================
// Mobile Navigation
// ======================================================

window.addEventListener("DOMContentLoaded",()=>{

    const menuButton=document.querySelector(".menu-toggle");

    const navMenu=document.querySelector(".nav-links");

    const overlay=document.querySelector(".nav-overlay");

    if(!menuButton || !navMenu || !overlay) return;

    function closeMenu(){

        navMenu.classList.remove("open");

        overlay.classList.remove("active");

        menuButton.classList.remove("active");

        menuButton.setAttribute("aria-expanded","false");

        document.body.style.overflow="";

    }

    menuButton.addEventListener("click",()=>{

        const isOpen=navMenu.classList.toggle("open");

        overlay.classList.toggle("active");

        menuButton.classList.toggle("active");

        menuButton.setAttribute("aria-expanded",isOpen);

        document.body.style.overflow=isOpen ? "hidden" : "";

    });

    overlay.addEventListener("click",closeMenu);

    document.querySelectorAll(".nav-links a").forEach(link=>{

        link.addEventListener("click",closeMenu);

    });

});

// ======================================================
// Contact Form Backend Integration
// ======================================================

window.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("lead-form");

    if (!contactForm) {
        console.error("Contact form not found.");
        return;
    }

    contactForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const submitButton = contactForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        const formData = {
            full_name: document.getElementById("full_name").value.trim(),
            company_name: document.getElementById("company_name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            website_type: document.getElementById("website_type").value,
            budget: document.getElementById("budget").value,
            timeline: document.getElementById("timeline").value,
            project_description: document.getElementById("project_description").value.trim()
        };

        try {

            const response = await fetch("https://koracraft-backend.onrender.com/api/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const result = await response.json();

            if (result.success) {

                contactForm.reset();

                alert("✅ Thank you! Your request has been submitted successfully. We will contact you within 24 hours.");

            }

        } catch (err) {

            console.error(err);

            alert("Unable to connect to the KoraCraft server.");

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Submit Request";

        }

    });

});