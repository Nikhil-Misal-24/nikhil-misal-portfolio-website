document.addEventListener('DOMContentLoaded', () => {
    // 15. PRELOADER
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);

    // 1. NAVBAR SCROLL EFFECT
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    

    // 2. ACTIVE SECTION TRACKING
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });

                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 3. SMOOTH SCROLL & CLOSE MOBILE MENU
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // offset for fixed navbar
                    behavior: 'smooth'
                });
            }

            // Close mobile menu
            if (hamburger.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // 4. MOBILE HAMBURGER MENU
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        if (hamburger.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // 5. SCROLL ANIMATIONS
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay');
                if (delay) {
                    el.style.transitionDelay = `${delay}ms`;
                }
                el.classList.add('visible');
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    animateElements.forEach(el => animateObserver.observe(el));

    // 6. HERO PCB BACKGROUND ANIMATION
    const canvas = document.getElementById('pcb-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let nodes = [];
        let time = 0;

        function initCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            drawStaticBackground();
        }

        function drawStaticBackground() {
            ctx.clearRect(0, 0, width, height);
            
            const gridSize = 40;
            const rows = Math.ceil(height / gridSize);
            const cols = Math.ceil(width / gridSize);

            nodes = [];

            ctx.fillStyle = 'rgba(201, 168, 76, 0.15)'; // gold
            ctx.strokeStyle = 'rgba(201, 168, 76, 0.08)';
            ctx.lineWidth = 1;

            // Draw grid dots and randomly connect
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const x = j * gridSize + gridSize/2;
                    const y = i * gridSize + gridSize/2;
                    
                    // Draw dot
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                    ctx.fill();

                    // Random lines to right
                    if (j < cols - 1 && Math.random() > 0.6) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + gridSize, y);
                        ctx.stroke();
                    }
                    // Random lines to bottom
                    if (i < rows - 1 && Math.random() > 0.6) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, y + gridSize);
                        ctx.stroke();
                    }

                    // Select random glowing nodes
                    if (Math.random() > 0.95) {
                        nodes.push({ x, y, phase: Math.random() * Math.PI * 2 });
                    }
                }
            }
        }

        function animateCanvas() {
            time += 0.05;
            
            // Only clear and redraw glowing nodes on a separate layer or just redraw them
            // For simplicity, we just redraw static, then draw glowing nodes
            drawStaticBackground(); // In a highly optimized version we'd use two canvases, but this is fine

            nodes.forEach(node => {
                const pulse = Math.sin(time + node.phase) * 0.5 + 0.5; // 0 to 1
                const radius = 2 + pulse * 2;
                const opacity = 0.1 + pulse * 0.4;
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 168, 76, ${opacity})`;
                ctx.fill();
                
                // Glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(201, 168, 76, 0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animateCanvas);
        }

        window.addEventListener('resize', initCanvas);
        initCanvas();
        animateCanvas();
    }

    // 7. SKILL BAR ANIMATION
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillFills = entry.target.querySelectorAll('.skill-bar-fill');
                    const skillPercents = entry.target.querySelectorAll('.skill-percent');
                    
                    skillFills.forEach((fill, index) => {
                        const target = fill.getAttribute('data-percent');
                        fill.style.width = '0%';
                        setTimeout(() => {
                            fill.style.transition = 'width 1s ease-out';
                            fill.style.width = target + '%';
                        }, 100 * index);
                    });

                    skillPercents.forEach((span, index) => {
                        const target = parseInt(span.parentElement.parentElement.querySelector('.skill-bar-fill').getAttribute('data-percent'), 10);
                        let current = 0;
                        const duration = 1000; // ms
                        const startTime = performance.now();
                        
                        function updateCount(currentTime) {
                            const elapsed = currentTime - (startTime + 100 * index);
                            if (elapsed > 0) {
                                const progress = Math.min(elapsed / duration, 1);
                                // easeOutQuad
                                const ease = progress * (2 - progress);
                                current = Math.floor(ease * target);
                                span.innerText = current + '%';
                            }
                            
                            if (elapsed < duration) {
                                requestAnimationFrame(updateCount);
                            } else {
                                span.innerText = target + '%';
                            }
                        }
                        requestAnimationFrame(updateCount);
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skillObserver.observe(skillsGrid);
    }

    // 8. STAT COUNTER ANIMATION
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-count'), 10);
                        const suffix = stat.getAttribute('data-suffix') || '';
                        let current = 0;
                        const duration = 1500;
                        const startTime = performance.now();

                        function updateStat(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const ease = progress * (2 - progress);
                            current = Math.floor(ease * target);
                            stat.innerText = current + suffix;

                            if (progress < 1) {
                                requestAnimationFrame(updateStat);
                            } else {
                                stat.innerText = target + suffix;
                            }
                        }
                        requestAnimationFrame(updateStat);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsGrid);
    }

    // 9. MISSION/VISION CARD FLIP
    const mvCards = document.querySelectorAll('.mv-card');
    mvCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // 10. CONTACT FORM
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('fullname');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            let isValid = true;

            function validateField(input, condition, errorMsg) {
                const formGroup = input.closest('.form-group');
                const errorEl = formGroup.querySelector('.error-msg');
                if (!condition) {
                    formGroup.classList.add('error');
                    if(errorEl) errorEl.style.display = 'block';
                    isValid = false;
                } else {
                    formGroup.classList.remove('error');
                    if(errorEl) errorEl.style.display = 'none';
                }
            }

            validateField(nameInput, nameInput.value.trim().length >= 2, 'Name must be at least 2 characters');
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'Enter a valid email');
            
            validateField(subjectInput, subjectInput.value.trim().length >= 2, 'Subject must be at least 2 characters');
            validateField(messageInput, messageInput.value.trim().length >= 10, 'Message must be at least 10 characters');

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';

                // Simulate sending
                setTimeout(() => {
                    // Fallback to mailto
                    const mailtoLink = `mailto:nikhilmisal540@gmail.com?subject=${encodeURIComponent(subjectInput.value)}&body=${encodeURIComponent("From: " + nameInput.value + " (" + emailInput.value + ")\n\n" + messageInput.value)}`;
                    window.location.href = mailtoLink;

                    // Show success
                    contactForm.style.display = 'none';
                    const successMsg = document.createElement('div');
                    successMsg.className = 'form-success visible';
                    successMsg.innerText = 'Message sent successfully! (Or mail client opened)';
                    contactForm.parentNode.insertBefore(successMsg, contactForm);

                    setTimeout(() => {
                        contactForm.reset();
                        contactForm.style.display = 'block';
                        successMsg.remove();
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalText;
                    }, 5000);
                }, 1500);
            }
        });
    }

    // 11. EXPERIENCE CARD DARK PANEL ANIMATION
    // 12. EDUCATION CARD STAGGERED ANIMATION
    // 13. PROJECT TECH PILLS
    const advancedElements = document.querySelectorAll('.exp-dark-panel, .edu-card, .project-card');
    const advObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Tech pills stagger
                if (entry.target.classList.contains('project-card')) {
                    const pills = entry.target.querySelectorAll('.tech-pill');
                    pills.forEach((pill, idx) => {
                        pill.style.transitionDelay = `${idx * 100}ms`;
                        pill.classList.add('visible');
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    advancedElements.forEach(el => advObserver.observe(el));

    // 14. CERTIFICATION CARD TILT ON HOVER
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // max ±5deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // 16. BACK TO TOP
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--primary-color, #c9a84c);
        color: #000;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});

const heroName = document.getElementById("hero-name");

if (heroName) {
  const text = heroName.textContent;
  heroName.textContent = "";

  let index = 0;

  function typeText() {
    if (index < text.length) {
      heroName.textContent += text.charAt(index);
      index++;
      setTimeout(typeText, 100);
    } else {
      setTimeout(() => {
        heroName.style.borderRight = "none";
      }, 1500);
    }
  }

  typeText();
}

