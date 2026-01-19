const GA_MEASUREMENT_ID = 'G-Z78W0HFX73';

// Load the Google Tag script
const script = document.createElement('script');
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
script.async = true;
document.head.appendChild(script);

// Initialize the dataLayer and gtag function
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);


// --- 1. Mobile Menu Logic ---
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// --- 2. Contact Form & reCAPTCHA Logic ---
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const notification = document.getElementById('successNotification');
const captchaWarning = document.getElementById('captchaWarning');

window.hideCaptchaWarning = function () {
    captchaWarning.classList.add('hidden');
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        captchaWarning.classList.remove('hidden');
        return;
    }
    captchaWarning.classList.add('hidden');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

    const formData = new FormData(form);
    formData.append('g-recaptcha-response', recaptchaResponse);
    const formProps = Object.fromEntries(formData);

    try {
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formProps),
        });

        if (response.ok) {
            gtag('event', 'generate_lead', { 'method': 'contact_form' });
            notification.classList.remove('hidden');
            form.reset();
            grecaptcha.reset();
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 6000);
        } else {
            const errorData = await response.json();
            alert(`❌ Error! ${errorData.message || 'Could not send the message.'}`);
            grecaptcha.reset();
        }

    } catch (error) {
        console.error('Submission error:', error);
        alert('❌ Network Error: Could not connect to the server.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
});

// --- Global Interaction Tracking ---
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const url = link.href;
    const isDownload = link.hasAttribute('download');
    const linkText = link.innerText.trim();

    let eventName = 'click';
    let eventParams = { transport_type: 'beacon', url: url };

    // 1. Resume Downloads
    if (isDownload) {
        eventName = 'file_download';
        eventParams.file_name = 'Tram_Bui_Resume.pdf';
        eventParams.file_extension = 'pdf';
    }
    // 2. Project Interactions (GitHub/Demo)
    else if (url.includes('github.com') || url.includes('onrender.com') || linkText.includes('Live Demo')) {
        eventName = 'project_interaction';

        const isDemo = url.includes('onrender.com') || linkText.includes('Live Demo');
        eventParams.link_type = isDemo ? 'Live Demo' : 'GitHub Code';

        eventParams.project_name = link.closest('article')?.querySelector('h4')?.innerText || 'Unknown Project';
    }
    // 3. LinkedIn/Social
    else if (url.includes('linkedin.com')) {
        eventName = 'outbound_click';
        eventParams.event_category = 'social';
        eventParams.event_label = 'LinkedIn Profile';
    }
    // 4. Mailto links
    else if (url.startsWith('mailto:')) {
        eventName = 'generate_lead';
        eventParams.method = 'email_link';
    }

    if ((eventName !== 'click' || url.startsWith('http')) && typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
    }
});

// --- Dark Mode Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// 1. Check local storage or system preference on load
// If user has set specific theme OR (no preference saved AND system is dark)
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
} else {
    htmlElement.classList.remove('dark');
}

// 2. Handle toggle click
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            htmlElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    });
}