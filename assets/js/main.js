/* ==========================================================================
   Cityline Travels - Interactive Operations (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. PRELOADER DISMISSAL
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 800); // Small delay to enjoy the smooth animation
        });
    }

    // 2. STICKY NAVBAR SCROLL ACTION
    const navbar = document.querySelector('.custom-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. NAVBAR MOBILE MENU AUTO-CLOSE ON CLICK
    const navLinks = document.querySelectorAll('.custom-navbar .nav-link:not(.dropdown-toggle)');
    const menuToggle = document.getElementById('navbarNav');
    if (menuToggle && navLinks.length > 0) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.getComputedStyle(menuToggle).display !== 'none' && menuToggle.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // 4. SERVICE TABS FILTERING
    const filterButtons = document.querySelectorAll('.btn-tab-filter');
    const serviceCards = document.querySelectorAll('.service-item-col');

    if (filterButtons.length > 0 && serviceCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                serviceCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        // Add fade-in effect
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transition = 'opacity 0.4s ease';
                        }, 50);
                    } else {
                        const categories = card.getAttribute('data-category').split(' ');
                        if (categories.includes(filterValue)) {
                            card.style.display = 'block';
                            card.style.opacity = '0';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transition = 'opacity 0.4s ease';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });

                // Refresh AOS animations if active to recalculate layouts
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            });
        });
    }

    // 5. INTERACTIVE FARE ESTIMATOR CALCULATOR
    const selectVehicle = document.getElementById('calc-vehicle');
    const inputDistance = document.getElementById('calc-distance');
    const displayPrice = document.getElementById('calc-result-price');
    const displayRateText = document.getElementById('calc-result-rate');

    // Approximate Mumbai market average rates per KM based on user text
    const vehicleRates = {
        'tempo': { rate: 30, text: '₹28 - ₹32/km (Tempo Traveller)' },
        'urbania': { rate: 38, text: '₹38/km (16 Seater Urbania)' },
        'seater20': { rate: 28, text: '₹28/km (20 Seater Bus)' },
        'seater32': { rate: 42, text: '₹40 - ₹45/km (32 Seater Bus)' },
        'seater45': { rate: 51, text: '₹48 - ₹55/km (45 Seater Bus)' },
        'seater52': { rate: 55, text: '₹50 - ₹60/km (52 Seater Bus)' },
        'acbus': { rate: 60, text: '₹55 - ₹65/km (AC Bus)' },
        'nonacbus': { rate: 45, text: '₹40 - ₹50/km (Non AC Bus)' }
    };

    function calculateEstimate() {
        if (!selectVehicle || !inputDistance || !displayPrice || !displayRateText) return;

        const vehicle = selectVehicle.value;
        const distanceVal = parseFloat(inputDistance.value);

        if (!vehicle || isNaN(distanceVal) || distanceVal <= 0) {
            displayPrice.textContent = '₹0';
            displayRateText.textContent = 'Please enter distance & select vehicle';
            return;
        }

        const vehicleInfo = vehicleRates[vehicle];
        if (vehicleInfo) {
            const calculatedTotal = vehicleInfo.rate * distanceVal;
            // Format number as Indian currency system (e.g. ₹ 1,23,456)
            const formattedTotal = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(calculatedTotal);

            displayPrice.textContent = formattedTotal;
            displayRateText.textContent = `Based on average rate: ${vehicleInfo.text}`;
        }
    }

    if (selectVehicle && inputDistance) {
        selectVehicle.addEventListener('change', calculateEstimate);
        inputDistance.addEventListener('input', calculateEstimate);
    }

    // 6. CONTACT FORM SUBMISSION WITH WHATSAPP & EMAIL INTEGRATION
    const contactForm = document.getElementById('citylineContactForm');
    
    if (contactForm) {
        // We capture both clicks (WhatsApp vs normal Submit)
        let submitType = 'whatsapp';

        const waSubmitBtn = document.getElementById('submitWhatsApp');
        const emailSubmitBtn = document.getElementById('submitEmail');

        if (waSubmitBtn) {
            waSubmitBtn.addEventListener('click', () => {
                submitType = 'whatsapp';
            });
        }
        if (emailSubmitBtn) {
            emailSubmitBtn.addEventListener('click', () => {
                submitType = 'email';
            });
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch Form Inputs
            const name = document.getElementById('contact-name').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const service = document.getElementById('contact-service').value;
            const date = document.getElementById('contact-date').value;
            const details = document.getElementById('contact-details').value.trim();

            if (!name || !phone || !service || !date) {
                alert('Please fill out all required fields (Name, Phone, Service, and Date).');
                return;
            }

            // Map internal service values to readable names
            const serviceNames = {
                'corporate': 'Corporate Employee Transport',
                'school': 'School Bus Services',
                'ac_bus': 'AC Bus Rental',
                'non_ac': 'Non-AC Bus Rental',
                '32_seater': '32 Seater Bus Hire',
                '45_seater': '45 Seater Bus Hire',
                '52_seater': '52 Seater Bus Hire',
                'tempo': 'Tempo Traveller Rental',
                '20_seater': '20 Seater Bus Rental',
                'urbania': '16 Seater Urbania Rental'
            };

            const selectedServiceName = serviceNames[service] || service;

            // Target number (+91 97681 21433)
            const targetPhone = '919768121433';

            if (submitType === 'whatsapp') {
                // Construct clean pre-filled WhatsApp message
                const messageText = `Hi Cityline Travels,\n\nI want to book a vehicle / get a quote. Here are my details:\n\n*👤 Name:* ${name}\n*📞 Contact:* ${phone}\n*🚌 Vehicle/Service:* ${selectedServiceName}\n*📅 Travel Date:* ${date}\n*📝 Requirements:* ${details || 'None specified'}\n\nLooking forward to your quick response!`;
                
                // Encode and open link
                const encodedMessage = encodeURIComponent(messageText);
                const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMessage}`;
                
                window.open(whatsappUrl, '_blank');
            } else {
                // Email format fallback
                const subject = `New Transport Booking Enquiry from ${name}`;
                const body = `Hi Cityline Travels,\n\nYou have received a new booking enquiry:\n\nName: ${name}\nPhone: ${phone}\nService Required: ${selectedServiceName}\nTravel Date: ${date}\nJourney Details: ${details || 'None'}\n\nRegards.`;
                
                const mailtoUrl = `mailto:Contact@cityline.co.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(mailtoUrl, '_blank');
                
                alert('An email draft has been generated. Please send it through your mail client. Thank you!');
            }

            // Reset form
            contactForm.reset();
        });
    }

    // 7. HERO SECTION TYPING ANIMATION (Vanilla CSS/JS hybrid)
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const words = ['Safe Journeys', 'Professional Drivers', 'Affordable Pricing', '24x7 Customer Support'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 200;

        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                delay = 80;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                delay = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at complete word
                delay = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                // Move to next word
                wordIndex = (wordIndex + 1) % words.length;
                delay = 500;
            }

            setTimeout(typeEffect, delay);
        }

        setTimeout(typeEffect, 1000);
    }

    // 8. FLOATING BUS SCROLL TRACKER LOGIC
    const scrollBus = document.getElementById('scroll-bus');
    const trackerProgress = document.querySelector('.tracker-progress');
    
    if (scrollBus && trackerProgress) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (scrollHeight > 0) {
                // Calculate percentage
                const scrollPercent = (scrollTop / scrollHeight) * 100;
                
                // Update elements
                scrollBus.style.top = `${scrollPercent}%`;
                trackerProgress.style.height = `${scrollPercent}%`;
                
                // Track scroll direction to rotate bus
                if (scrollTop > lastScrollTop) {
                    // Scrolling down -> Point bus down (90deg)
                    scrollBus.style.transform = 'translate(-50%, -50%) rotate(90deg)';
                } else if (scrollTop < lastScrollTop) {
                    // Scrolling up -> Point bus up (-90deg)
                    scrollBus.style.transform = 'translate(-50%, -50%) rotate(-90deg)';
                }
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
});
