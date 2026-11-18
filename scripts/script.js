// 0. Tailwind CSS Configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                space: ['"Space Grotesk"', 'sans-serif'],
                fira: ['"Fira Code"', 'monospace'],
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                tech: {
                    bg: '#121721',       // Azul Noturno
                    card: '#1B2E4B',     // Azul Profundo
                    border: '#3E465F',   // Azul Muted
                    text: '#F5F5F5',     // Branco Lumin
                    subtext: '#F2EFE9',  // Off-White
                    neon: '#00d2ff',     // Glowing Cyan/Neon Accent
                }
            }
        }
    }
};

// 1. Mouse Follower Orb Effect
const orb = document.getElementById('glow-orb');

document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        orb.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    });
});

// 2. Typewriter Effect (Alternating words)
const roles = ["Desenvolvedor Fullstack", "Game Designer", "Ilustrador 2D", "Pixel Artist"];
const typeElement = document.getElementById('typewriter');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typeElement.innerHTML = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeElement.innerHTML = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pausa no final da palavra antes de apagar
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pausa antes de digitar a nova palavra
    }

    setTimeout(typeWriter, typeSpeed + (Math.random() * 20));
}

// Inicia a digitação após um pequeno atraso
setTimeout(typeWriter, 800);

// 3. Scroll Reveal Animation with IntersectionObserver
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" 
});

revealElements.forEach(el => revealObserver.observe(el));

// 4. Modal Interactivity Logic
const modal = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const btnCloseModal = document.getElementById('closeModalBtn');
const projectCards = document.querySelectorAll('.project-card');

const modalImg = document.getElementById('modalImage');
const modalTtl = document.getElementById('modalTitle');
const modalDsc = document.getElementById('modalDesc');

function openModal(title, image, desc) {
    modalTtl.textContent = title;
    modalImg.src = image;
    modalDsc.textContent = desc;
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    
    document.body.style.overflow = '';
}

projectCards.forEach(card => {
    card.addEventListener('click', () => {
        openModal(
            card.getAttribute('data-title'),
            card.getAttribute('data-image'),
            card.getAttribute('data-desc')
        );
    });
});

btnCloseModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('pointer-events-none')) {
        closeModal();
    }
});