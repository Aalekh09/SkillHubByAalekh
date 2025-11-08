/* ============================================
   SkillHub by Aalekh - JavaScript
   Features:
   - Smooth scrolling navigation
   - Mobile menu toggle
   - Form submission to Google Sheets
   - Scroll animations
   ============================================ */

// ============================================
// Mobile Menu Toggle
// ============================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.toggle('active');
    }
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

mobileMenuToggle?.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking on overlay
mobileMenuOverlay?.addEventListener('click', toggleMobileMenu);

// ============================================
// Smooth Scrolling for Navigation Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Navbar Background on Scroll
// ============================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// ============================================
// Scroll Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .resource-card');
    animatedElements.forEach(el => observer.observe(el));

    // Animate about section elements
    const aboutImage = document.querySelector('.about-image');
    const aboutText = document.querySelector('.about-text');
    if (aboutImage) observer.observe(aboutImage);
    if (aboutText) observer.observe(aboutText);
});

// ============================================
// Contact Form Submission
// ============================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Replace this URL with your Google Apps Script Web App URL
// After following the setup instructions, paste your web app URL here
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPMRXxzs7dyTRyuvK_r8nj-n0W3RFf43Qdq1dQIexeYTxWYKI_-u5na2T0XoEcyS5v/exec';

/*
Your Google Apps Script is now configured and ready to receive form submissions!
The form will send data to your Google Sheet with the following structure:
- Column A: Timestamp
- Column B: Name  
- Column C: Email
- Column D: Message

If you need to modify the Google Apps Script, the code is available in google-apps-script.js
*/

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
        showFormMessage('Please fill in all fields.', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Disable submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        // Check if Google Script URL is configured
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            // For demo purposes, show success message even without backend
            setTimeout(() => {
                showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }, 1000);
            return;
        }

        // Send data to Google Sheets via Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script doesn't support CORS, so we use no-cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // With no-cors mode, we can't read the response, so we assume success
        // In production, you might want to use a different approach or handle this differently
        showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();

    } catch (error) {
        console.error('Error submitting form:', error);
        showFormMessage('There was an error sending your message. Please try again later.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

// Function to show form message
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message-modern ${type}`;
        formMessage.style.display = 'block';

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide message after 5 seconds for success, keep error visible
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// ============================================
// Active Navigation Link Highlighting
// ============================================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ============================================
// Initialize on page load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to hero content if not already animated
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && !heroContent.classList.contains('fade-in')) {
        heroContent.classList.add('fade-in');
    }

    console.log('SkillHub by Aalekh - Website loaded successfully!');
});

