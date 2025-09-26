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

// Skills Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Category switching
    const categories = document.querySelectorAll('.category');
    const categoryContents = document.querySelectorAll('.skill-category-content');
    
    categories.forEach(category => {
        category.addEventListener('click', () => {
            // Remove active class from all categories
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            category.classList.add('active');
            
            // Get the category id
            const categoryId = category.getAttribute('data-category');
            
            // Hide all category contents
            categoryContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected category content
            document.getElementById(categoryId).classList.add('active');
        });
    });
    
    // Animate skill bars when they come into view
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                });
            }
        });
    }, { threshold: 0.3 });
    
    // Observe the skills section
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }
});

// Projects Filtering and Interaction - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality (unchanged)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    // FIXED: Project card flip functionality
    projectCards.forEach(card => {
        // Add click handler for mobile
        card.addEventListener('click', function(e) {
            // Don't flip if clicking on links or buttons
            if (e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            
            // Toggle flipped state
            if (window.innerWidth <= 768) {
                this.classList.toggle('flipped');
            }
        });
        
        // Add hover handler for desktop
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.classList.add('flipped');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('flipped');
            });
        }
    });
    
    // FIXED: Back button functionality
    const viewLessBtns = document.querySelectorAll('.view-less');
    viewLessBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectCard = this.closest('.project-card');
            projectCard.classList.remove('flipped');
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        projectCards.forEach(card => {
            card.classList.remove('flipped');
        });
    });
});


// Professional Profiles Animation
document.addEventListener('DOMContentLoaded', function() {
    // Animate number counters
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        statNumber.textContent = target;
                        clearInterval(timer);
                    } else {
                        statNumber.textContent = Math.floor(current);
                    }
                }, 16);
                
                observer.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
    
    // Add hover effects
    const profileCards = document.querySelectorAll('.profile-card');
    
    profileCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Platform-specific interactions
    const platforms = {
        linkedin: () => {
            const nodes = document.querySelectorAll('.connection-node');
            nodes.forEach((node, index) => {
                node.style.animation = `pulse 2s infinite ${index * 0.3}s`;
            });
        },
        github: () => {
            // Simulate code typing effect
            const codeLines = document.querySelectorAll('.code-line');
            codeLines.forEach((line, index) => {
                line.style.animation = `codeTyping 3s infinite ${index * 0.5}s`;
            });
        }
    };
    
    // Initialize platform animations
    Object.keys(platforms).forEach(platform => {
        const card = document.querySelector(`[data-platform="${platform}"]`);
        if (card) {
            platforms[platform]();
        }
    });
});