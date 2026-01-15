// 1. THIRD-PARTY MODULES
const express = require('express');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch').default;
const path = require('path');

// 2. ENVIRONMENT VARIABLES (Load these before initializing dependent services)
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// 3. SECURITY & SANITIZATION SETUP
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// 4. APP INITIALIZATION
const app = express();
const port = process.env.PORT || 3000;

// 5. SECURITY MIDDLEWARE 
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": [
                "'self'",
                "https://www.google.com/recaptcha/",
                "https://www.gstatic.com/recaptcha/",
                "https://www.googletagmanager.com"
            ],
            "frame-src": [
                "'self'",
                "https://www.google.com/recaptcha/",
                "https://recaptcha.google.com/"
            ],
            "connect-src": [
                "'self'", 
                "https://www.google.com/recaptcha/", 
                "https://www.google-analytics.com",
                "https://*.google-analytics.com", 
                "https://stats.g.doubleclick.net"
            ],
        },
    },
}));

// 6. REQUEST PARSING MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 7. STATIC ASSET ROUTING (Specific folders first for performance)
app.use('/dist', express.static(path.join(__dirname, 'dist'))); // Compiled Tailwind CSS
app.use('/js', express.static(path.join(__dirname, 'public/js'))); // Externalized JavaScript
app.use(express.static(__dirname)); // Fallback for other root files (favicon, etc.)

// 8. ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// --- Contact Form Route ---
app.post('/send-email', async (req, res) => {
    const name = DOMPurify.sanitize(req.body.name);
    const email = DOMPurify.sanitize(req.body.email);
    const message = DOMPurify.sanitize(req.body.message);

    if (!name || !email || !message) {
        return res.status(400).json({ status: 'error', message: 'Invalid input.' });
    }

    const recaptchaToken = req.body['g-recaptcha-response'];

    if (!recaptchaToken) {
        return res.status(400).json({ status: 'error', message: 'Please complete the CAPTCHA.' });
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;

    try {
        const captchaResponse = await fetch(verificationUrl, { method: 'POST' });
        const captchaData = await captchaResponse.json();

        if (!captchaData.success) {
            console.warn('CAPTCHA FAILED for email:', email);
            return res.status(400).json({ status: 'error', message: 'CAPTCHA verification failed. Please try again.' });
        }
    } catch (captchaError) {
        console.error("CAPTCHA network error:", captchaError);
    }

    // --- Define Internal Alert Email ---
    const internalMailOptions = {
        from: `"Tram Bui - Portfolio" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        replyTo: email,
        sender: process.env.EMAIL_USER,
        subject: `[ACTION REQUIRED] NEW PORTFOLIO LEAD from ${name}`,
        html: `
            <h3>PORTFOLIO MESSAGE</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
        `
    };

    // --- Define Auto-Confirmation Email ---
    const confirmationMailOptions = {
        from: `"Tram Bui - Portfolio" <${process.env.EMAIL_USER}>`,
        to: email,
        sender: process.env.EMAIL_USER,
        subject: `Message Received: Thank you for contacting Tram Bui`,
        html: `
            <p>Hi ${name},</p>
            <p>Thank you for reaching out! This automated email confirms that your message has been successfully received.</p>
            <p>I am reviewing your inquiry now and will provide a personalized response within 48 business hours.</p>
            <hr style="border: 1px dashed #ccc;">
            <h4>Your Message for Reference:</h4>
            <p style="white-space: pre-wrap; background-color: #f7f7f7; padding: 10px; border-radius: 5px;">${message}</p>
            <hr>
            <p>Kind Regards,</p>
            <p>Tram Bui</p>
        `
    };

    // --- Send Emails Sequentially ---
    try {
        await transporter.sendMail(internalMailOptions);

        await transporter.sendMail(confirmationMailOptions);

        return res.status(200).json({ status: 'success', message: 'Message sent successfully!' });

    } catch (error) {
        console.error('CRITICAL: Email send failed (SMTP/Network Error):', error);
        return res.status(500).json({
            status: 'error',
            message: 'A system error occurred. Please check your email for typos or connect with me on LinkedIn.'
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
