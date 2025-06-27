// Hero Background Slideshow
const heroImages = [
    'foodimg/hero1.jpg',
    'foodimg/hero2.jpg',
    'foodimg/hero3.jpg',
    'foodimg/hero4.jpg'
];

class HeroSlideshow {
    constructor(images) {
        this.images = images;
        this.currentIndex = 0;
        this.background = document.querySelector('.hero-background');
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.preloadImages();
        this.setInitialBackground();
        this.startSlideshow();
    }

    preloadImages() {
        this.images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    setInitialBackground() {
        this.background.style.backgroundImage = `url('${this.images[0]}')`;
        setTimeout(() => {
            this.background.classList.add('active');
        }, 100);
    }

    async changeBackground() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Remove active class for fade out
        this.background.classList.remove('active');

        // Wait for fade out
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update image and index
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.background.style.backgroundImage = `url('${this.images[this.currentIndex]}')`;

        // Add active class for fade in
        setTimeout(() => {
            this.background.classList.add('active');
            this.isTransitioning = false;
        }, 100);
    }

    startSlideshow() {
        setInterval(() => this.changeBackground(), 9000);
    }
}

// Mobile Menu Handling
class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.links = document.querySelectorAll('.nav-links a');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    toggleMenu() {
        this.navLinks.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    closeMenu() {
        this.navLinks.classList.remove('active');
        this.hamburger.classList.remove('active');
    }

    handleClickOutside(e) {
        if (!this.navLinks.contains(e.target) && 
            !this.hamburger.contains(e.target) && 
            this.navLinks.classList.contains('active')) {
            this.closeMenu();
        }
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.initSmoothScroll();
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Food Card Animations
class FoodCardAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.food-card');
        this.init();
    }

    init() {
        this.observeCards();
        this.initOrderButtons();
    }

    observeCards() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                    }
                });
            },
            { threshold: 0.1 }
        );

        this.cards.forEach(card => observer.observe(card));
    }

    initOrderButtons() {
        document.querySelectorAll('.order-now').forEach(button => {
            button.addEventListener('click', () => {
                this.handleOrder(button);
            });
        });
    }

    handleOrder(button) {
        const foodName = button.closest('.food-card').querySelector('h3').textContent;
        alert(`Thank you for ordering ${foodName}! Your order will be processed shortly.`);
    }
}

// Food Card Quantity and Price Handling
class FoodCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.food-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            const minusBtn = card.querySelector('.minus');
            const plusBtn = card.querySelector('.plus');
            const quantitySpan = card.querySelector('.quantity');
            const orderBtn = card.querySelector('.order-now');
            let quantity = 1;

            // Get base price without the Naira symbol and comma
            const basePrice = parseFloat(
                card.querySelector('.price').textContent
                    .replace('₦', '')
                    .replace(',', '')
            );

            // Initialize order button with base price
            this.updateOrderButton(orderBtn, basePrice, quantity);

            minusBtn.addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    quantitySpan.textContent = quantity;
                    this.updateOrderButton(orderBtn, basePrice, quantity);
                }
            });

            plusBtn.addEventListener('click', () => {
                if (quantity < 99) {
                    quantity++;
                    quantitySpan.textContent = quantity;
                    this.updateOrderButton(orderBtn, basePrice, quantity);
                }
            });
        });
    }

    updateOrderButton(button, basePrice, quantity) {
        const total = basePrice * quantity;
        // Format number with comma separator
        const formattedTotal = total.toLocaleString('en-NG');
        button.textContent = `Order Now - ₦${formattedTotal}`;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlideshow(heroImages);
    new MobileMenu();
    new SmoothScroll();
    new FoodCardAnimations();
    new FoodCardManager();
});