const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        const name = DOMPurify.sanitize(data.name);
        const email = DOMPurify.sanitize(data.email);
        const message = DOMPurify.sanitize(data.message);
        const recaptchaToken = data['g-recaptcha-response'];

        if (!name || !email || !message || !recaptchaToken) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Invalid input' }) };
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
        const captchaRes = await fetch(verifyUrl, { method: 'POST' });
        const captchaData = await captchaRes.json();

        if (!captchaData.success) {
            return { statusCode: 400, body: JSON.stringify({ message: 'CAPTCHA failed' }) };
        }

        const mailOptions = {
            from: `"Portfolio Lead" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            replyTo: email,
            subject: `New Message from ${name}`,
            html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`
        };

        await transporter.sendMail(mailOptions);
        return { statusCode: 200, body: JSON.stringify({ message: 'Email sent successfully!' }) };

    } catch (error) {
        console.error('Function Error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Server Error' }) };
    }
};