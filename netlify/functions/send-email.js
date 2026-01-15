const nodemailer = require('nodemailer');

// 1. Simple, native sanitization
const sanitize = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        // 2. Sanitize Inputs
        const name = sanitize(data.name);
        const email = sanitize(data.email);
        const message = sanitize(data.message);
        const recaptchaToken = data['g-recaptcha-response'];

        if (!name || !email || !message || !recaptchaToken) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Invalid input' }) };
        }

        // 3. Verify reCAPTCHA
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
        const captchaRes = await fetch(verifyUrl, { method: 'POST' });
        const captchaData = await captchaRes.json();

        if (!captchaData.success) {
            console.error('Captcha Failed:', captchaData);
            return { statusCode: 400, body: JSON.stringify({ message: 'CAPTCHA failed' }) };
        }

        // 4. Send Email
        const mailOptions = {
            from: `"Portfolio Lead" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            replyTo: email,
            subject: `New Message from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br/>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return { statusCode: 200, body: JSON.stringify({ message: 'Email sent successfully!' }) };

    } catch (error) {
        console.error('Function Error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Server Error: ' + error.message }) };
    }
};