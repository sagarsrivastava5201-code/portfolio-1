
// ===============================
// MOBILE MENU
// ===============================

function toggleMenu() {

    const nav = document.getElementById("navLinks");

    if (nav) {
        nav.classList.toggle("show");
    }

}


// ===============================
// TYPING EFFECT
// ===============================

const typingElement = document.getElementById("typing");

if (typingElement) {

    const words = [
        "Frontend Developer",
        "Web Developer",
        "Full Stack Learner",
        "AI & ML Student"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {

        const currentWord = words[wordIndex];

        if (!deleting) {

            typingElement.textContent =
                currentWord.substring(0, charIndex + 1);

            charIndex++;

            if (charIndex === currentWord.length) {

                deleting = true;

                setTimeout(typeEffect, 1500);

                return;
            }

        } else {

            typingElement.textContent =
                currentWord.substring(0, charIndex - 1);

            charIndex--;

            if (charIndex === 0) {

                deleting = false;

                wordIndex++;

                if (wordIndex >= words.length) {
                    wordIndex = 0;
                }

            }

        }

        setTimeout(
            typeEffect,
            deleting ? 50 : 100
        );
    }

    typeEffect();
}


// ===============================
// PROJECT LINKS
// ===============================

function openLink(url) {

    window.open(url, "_blank");

}


// ===============================
// COUNTER ANIMATION
// ===============================

const counters = document.querySelectorAll("[data-count]");

counters.forEach(counter => {

    const target = Number(counter.dataset.count);

    let current = 0;

    const updateCounter = () => {

        const increment = Math.ceil(target / 50);

        current += increment;

        if (current >= target) {

            counter.textContent = target;

        } else {

            counter.textContent = current;

            requestAnimationFrame(updateCounter);

        }

    };

    updateCounter();

});


// ===============================
// PARTICLES
// ===============================

if (typeof particlesJS !== "undefined") {

    particlesJS("particles-js", {

        particles: {

            number: {
                value: 60,
                density: {
                    enable: true,
                    value_area: 900
                }
            },

            color: {
                value: "#00ffff"
            },

            shape: {
                type: "circle"
            },

            opacity: {
                value: 0.4,
                random: true
            },

            size: {
                value: 2,
                random: true
            },

            line_linked: {
                enable: true,
                distance: 150,
                color: "#00ffff",
                opacity: 0.15,
                width: 1
            },

            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out"
            }

        },

        interactivity: {

            detect_on: "canvas",

            events: {

                onhover: {
                    enable: true,
                    mode: "repulse"
                },

                onclick: {
                    enable: true,
                    mode: "push"
                },

                resize: true

            },

            modes: {

                repulse: {
                    distance: 100
                },

                push: {
                    particles_nb: 4
                }

            }

        },

        retina_detect: true

    });

}
