// Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    navLinks.classList.remove('active');
});

// Scroll animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Floating cards animation
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.5}s`;
});

// Typing effect
const roles = ["Data Scientist", "Web Developer", "C++ Programmer", "AI Enthusiast"];
let index = 0;
let charIndex = 0;
let currentRole = "";
let deleting = false;

function typeEffect() {
    if (index >= roles.length) index = 0;
    currentRole = roles[index];

    let displayText = deleting
        ? currentRole.substring(0, charIndex--)
        : currentRole.substring(0, charIndex++);

    document.getElementById("typed").textContent = displayText;

    if (!deleting && charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeEffect, 1000);
    } else if (deleting && charIndex === 0) {
        deleting = false;
        index++;
        setTimeout(typeEffect, 300);
    } else {
        setTimeout(typeEffect, deleting ? 80 : 120);
    }
}

typeEffect();

// Timeline animation
const timelineItems = document.querySelectorAll(".timeline-content");

function showTimeline() {
    timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            item.classList.add("show");
        }
    });
}

window.addEventListener("scroll", showTimeline);

// Particles animation
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 100; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        // Draw connecting lines
        for (let j = i + 1; j < particles.length; j++) {
            let q = particles[j];
            let dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255,255,255,0.05)";
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(drawParticles);
}

drawParticles();


document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Hide any previous errors
    const errorDiv = document.getElementById('form-error');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    try {
        // Get form data
        const formData = new FormData(this);
        
        // Send to Formspree
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        } else {
            // Get more details about the error
            const errorData = await response.json();
            throw new Error(errorData.error || `Server responded with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show detailed error message
        errorDiv.textContent = `Error: ${error.message}. Please try again or email me directly at hafizhassan142003@gmail.com`;
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});