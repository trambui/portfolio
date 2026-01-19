# Tram Bui | Analytical Full-Stack Portfolio

![Netlify Status](https://api.netlify.com/api/v1/badges/b5b5b5-status-badge/deploy-status) A high-performance, data-driven personal portfolio website. Built with scientific rigor to ensure maximum accessibility, performance, and measurable user engagement.

**Live Site:** [trambui-portfolio.netlify.app](https://trambui-portfolio.netlify.app/)

## 🚀 Overview

This is not just a static site; it is a full-stack application leveraging serverless functions for backend logic and advanced analytics for user behavior tracking.

The architecture focuses on **Data Integrity** (GA4 Custom Events), **Security** (CSP Headers, reCAPTCHA), and **Performance** (Lazy-loading, Minification).

## ✨ Key Features

* **🎨 Dynamic Dark Mode:** Persists user preference via `localStorage` and respects system `prefers-color-scheme`.
* **⚡ Serverless Backend:** Secure contact form handling using **Netlify Functions** (Node.js) and **Nodemailer**.
* **📊 Advanced Analytics (GA4):**
    * Custom event tracking for Resume Downloads (`file_download`).
    * Granular tracking for "GitHub" vs "Live Demo" clicks (`project_interaction`).
    * Unified lead tracking for Form Submits vs Mailto clicks (`generate_lead`).
* **🛡️ Security & Anti-Spam:**
    * Integrated **Google reCAPTCHA v2** (Lazy-loaded for performance).
    * Input sanitization on the backend to prevent XSS/Injection.
    * Strict **Content Security Policy (CSP)** headers configured in `netlify.toml`.
* **♿ Accessible (A11y):** WCAG AA compliant with a Lighthouse Accessibility score of ~95.

## 🛠️ Tech Stack

* **Frontend:** HTML5, Vanilla JavaScript (ES6+), Tailwind CSS
* **Backend:** Node.js (Netlify Functions)
* **Styling:** Tailwind CSS (Class-strategy for Dark Mode)
* **Tools:** PostCSS, Google Analytics 4, Lighthouse

## ⚙️ Getting Started

### Prerequisites
* Node.js & npm installed
* [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed globally: `npm install -g netlify-cli`

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone [https://github.com/trambui/portfolio.git](https://github.com/trambui/portfolio.git)
cd portfolio
npm install
