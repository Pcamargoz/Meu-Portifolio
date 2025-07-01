document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // Custom cursor logic
    const cursor = document.getElementById('cursor');
    const interactiveElements = document.querySelectorAll('a, button, .skill-card');
    
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.2,
            ease: 'power2.out'
        });
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });


    // Background canvas animation
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(0, 242, 234, ${Math.random() * 0.5 + 0.2})`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.1) this.size -= 0.01;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].size <= 0.1) {
                particles.splice(i, 1);
                particles.push(new Particle());
                i--;
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // GSAP Animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Hero Section Animation
    tl.to('.hero-image-container', { scale: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' })
      .from('.hero-title', { y: 50, opacity: 0, duration: 0.8 }, '-=1.2')
      .from('.hero-subtitle', { y: 50, opacity: 0, duration: 0.8 }, '-=1')
      .from('.hero-links .cta-button', { y: 30, opacity: 0, stagger: 0.2, duration: 0.6 }, '-=0.7');

    // Scroll-triggered animations
    const sections = gsap.utils.toArray('section');
    sections.forEach(section => {
        const title = section.querySelector('.section-title');
        const content = section.querySelectorAll('p, .skill-card, .project-card, .strategy-list li');
        
        if(title){
             gsap.to(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.8
            });
        }
        
        if(content.length > 0){
            gsap.to(content, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.15
            });
        }
    });
});