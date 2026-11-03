/**
 * Noch & Tey | Fine-Art Gallery Showcase
 * Handles mobile menu toggle and full-screen photo lightbox modal
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.textContent = isOpen ? '✕' : '☰';
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }

    // 2. Photo Lightbox Modal
    const photoCards = document.querySelectorAll('.gallery-card, .luxury-frame, .fine-art-frame');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');

    if (modal && modalImg) {
        photoCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                if (img) {
                    modalImg.src = img.src;
                    modalImg.alt = img.alt || 'Noch & Tey Photo';
                    modal.classList.add('active');
                }
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    // 3. Falling Champagne Sparkles Animation
    const canvas = document.getElementById('sparklesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        const particleCount = window.innerWidth < 768 ? 24 : 45;
        const colors = [
            '#e8be5b', // warm gold
            '#f7dd93', // soft champagne
            '#fad064', // bright gold
            '#ffffff', // diamond white sparkle
            '#dfaf37'  // luxury gold
        ];

        class Sparkle {
            constructor(initRandomY = false) {
                this.reset(initRandomY);
            }

            reset(initRandomY = false) {
                this.x = Math.random() * width;
                this.y = initRandomY ? Math.random() * height : -15 - Math.random() * 25;
                this.type = Math.random() > 0.38 ? 'star' : 'orb';
                this.size = this.type === 'star' ? (Math.random() * 3.5 + 2.5) : (Math.random() * 2.2 + 1.2);
                this.vy = Math.random() * 0.3 + 0.15; // Slow, romantic feather-light downward drift
                this.swayAngle = Math.random() * Math.PI * 2;
                this.swaySpeed = Math.random() * 0.008 + 0.004; // Calmer horizontal sway
                this.swayDistance = Math.random() * 0.6 + 0.25;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.008;
                this.baseAlpha = Math.random() * 0.35 + 0.35;
                this.twinkleAngle = Math.random() * Math.PI * 2;
                this.twinkleSpeed = Math.random() * 0.02 + 0.01; // Softer, slower twinkling
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.vy;
                this.swayAngle += this.swaySpeed;
                this.x += Math.sin(this.swayAngle) * this.swayDistance;
                this.rotation += this.rotSpeed;
                this.twinkleAngle += this.twinkleSpeed;

                if (this.y > height + 25) {
                    this.reset(false);
                }
            }

            draw() {
                const alpha = Math.max(0.12, Math.min(0.9, this.baseAlpha + Math.sin(this.twinkleAngle) * 0.25));
                ctx.save();
                ctx.globalAlpha = alpha;

                if (this.type === 'star') {
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    const outer = this.size;
                    const inner = this.size * 0.22;
                    for (let i = 0; i < 4; i++) {
                        const rot = (i * Math.PI) / 2;
                        ctx.lineTo(Math.cos(rot) * outer, Math.sin(rot) * outer);
                        ctx.lineTo(Math.cos(rot + Math.PI / 4) * inner, Math.sin(rot + Math.PI / 4) * inner);
                    }
                    ctx.closePath();
                    ctx.fill();

                    // Tiny central core gleam
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(0, 0, inner * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
                    grad.addColorStop(0, '#ffffff');
                    grad.addColorStop(0.35, this.color);
                    grad.addColorStop(1, 'rgba(255, 238, 175, 0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        const particles = Array.from({ length: particleCount }, () => new Sparkle(true));

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        }

        animate();
    }
});
